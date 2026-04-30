/**
 * Universidad de La Laguna
 * Escuela Superior de Ingenieria y Tecnologia
 * Grado en Ingenieria Informatica
 * Programacion de Aplicaciones Interactivas
 *
 * @author Pablo Hernandez Jimenez
 * @since Apr 29, 2026
 * @description Coordinates the Monte Carlo integral model and view.
 */

import type {
  MonteCarloFieldName,
  MonteCarloFormValues,
  MonteCarloGraphRequest,
  MonteCarloValidationErrors,
} from './types';

import {
  DEFAULT_MONTE_CARLO_ANIMATION_ENABLED,
  DEFAULT_MONTE_CARLO_REQUEST,
  DEFAULT_MONTE_CARLO_SPEED,
} from './constants';
import { compileFunctionExpression } from './expression';
import { MonteCarloIntegralModel } from './model';
import { MonteCarloIntegralView } from './view';

/**
 * Owns the input-validation pipeline for the Monte Carlo integral assignment.
 */
export class MonteCarloIntegralController {
  private hasValidConfiguration = false;
  private isAnimationEnabled = DEFAULT_MONTE_CARLO_ANIMATION_ENABLED;
  private speedPointsPerSecond = DEFAULT_MONTE_CARLO_SPEED;
  private animationFrameId: number | null = null;
  private previousFrameTimeMs: number | null = null;
  private bufferedPoints = 0;

  /**
   * Creates the controller from explicit model and view collaborators.
   *
   * @param model - Assignment model.
   * @param view - DOM and canvas view.
   */
  constructor(
    private readonly model: MonteCarloIntegralModel,
    private readonly view: MonteCarloIntegralView,
  ) {}

  /**
   * Binds the page and renders the default parabola.
   */
  initialize(): void {
    this.view.bind({
      onInput: (values) => {
        this.applyFormValues(values);
      },
      onAddPoint: () => {
        this.addPointOneByOne();
      },
      onAnimationToggle: (isEnabled) => {
        this.setAnimationEnabled(isEnabled);
      },
      onSpeedChange: (speed) => {
        this.setSpeed(speed);
      },
      onReset: () => {
        this.resetApplication();
      },
      onResize: () => {
        this.view.render(this.model.getSnapshot());
      },
    });

    const defaultValues = createDefaultFormValues();

    this.view.setSimulationControls(this.isAnimationEnabled, this.speedPointsPerSecond);
    this.view.setFormValues(defaultValues);
    this.applyFormValues(defaultValues);
  }

  /**
   * Releases the DOM listeners owned by the view.
   */
  destroy(): void {
    this.stopAnimationLoop();
    this.view.destroy();
  }

  /**
   * Parses, validates, and renders one set of raw form values.
   *
   * @param values - Raw strings typed by the user.
   */
  applyFormValues(values: MonteCarloFormValues): void {
    const parseResult = parseFormValues(values);

    if (!parseResult.ok) {
      this.hasValidConfiguration = false;
      this.stopAnimationLoop();
      this.view.showValidationErrors(parseResult.errors);
      return;
    }

    this.hasValidConfiguration = true;
    this.view.clearValidationErrors();
    this.view.render(this.model.configure(parseResult.value));
    this.syncAnimationLoop();
  }

  /**
   * Adds one random Monte Carlo point when the current configuration is valid.
   */
  private addPointOneByOne(): void {
    if (!this.hasValidConfiguration) {
      return;
    }

    this.view.render(this.model.addRandomPoint());
  }

  /**
   * Enables or disables the autonomous simulation loop.
   *
   * @param isEnabled - Whether the animation checkbox is active.
   */
  private setAnimationEnabled(isEnabled: boolean): void {
    this.isAnimationEnabled = isEnabled;
    this.view.setSimulationControls(this.isAnimationEnabled, this.speedPointsPerSecond);
    this.syncAnimationLoop();
  }

  /**
   * Updates the autonomous simulation speed in points per second.
   *
   * @param speed - Positive integer speed from the slider.
   */
  private setSpeed(speed: number): void {
    this.speedPointsPerSecond = Math.max(1, Math.round(speed));
    this.view.setSimulationControls(this.isAnimationEnabled, this.speedPointsPerSecond);
  }

  /**
   * Clears inputs, counters, and canvas while resetting the model state.
   */
  private resetApplication(): void {
    const defaultValues = createDefaultFormValues();

    this.model.reset();
    this.hasValidConfiguration = true;
    this.isAnimationEnabled = DEFAULT_MONTE_CARLO_ANIMATION_ENABLED;
    this.speedPointsPerSecond = DEFAULT_MONTE_CARLO_SPEED;
    this.bufferedPoints = 0;
    this.stopAnimationLoop();
    this.view.setSimulationControls(this.isAnimationEnabled, this.speedPointsPerSecond);
    this.view.setFormValues(defaultValues);
    this.view.clearValidationErrors();
    this.view.render(this.model.getSnapshot());
  }

  /**
   * Starts or stops the requestAnimationFrame loop according to the UI state.
   */
  private syncAnimationLoop(): void {
    if (!this.isAnimationEnabled || !this.hasValidConfiguration) {
      this.stopAnimationLoop();
      return;
    }

    if (this.animationFrameId !== null) {
      return;
    }

    this.previousFrameTimeMs = null;
    this.animationFrameId = requestAnimationFrame((timestampMs) => {
      this.handleAnimationFrame(timestampMs);
    });
  }

  /**
   * Advances the autonomous simulation and schedules the next frame.
   *
   * @param timestampMs - Browser frame timestamp in milliseconds.
   */
  private handleAnimationFrame(timestampMs: number): void {
    if (!this.isAnimationEnabled || !this.hasValidConfiguration) {
      this.stopAnimationLoop();
      return;
    }

    const previousFrameTimeMs = this.previousFrameTimeMs ?? timestampMs;
    const elapsedSeconds = Math.max(0, timestampMs - previousFrameTimeMs) / 1000;

    this.previousFrameTimeMs = timestampMs;
    this.bufferedPoints += elapsedSeconds * this.speedPointsPerSecond;

    const pointsToGenerate = Math.floor(this.bufferedPoints);

    if (pointsToGenerate > 0) {
      this.bufferedPoints -= pointsToGenerate;
      this.view.render(this.model.addRandomPoints(pointsToGenerate));
    }

    this.animationFrameId = requestAnimationFrame((nextTimestampMs) => {
      this.handleAnimationFrame(nextTimestampMs);
    });
  }

  /**
   * Stops the current requestAnimationFrame loop and clears frame accumulators.
   */
  private stopAnimationLoop(): void {
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
    }

    this.animationFrameId = null;
    this.previousFrameTimeMs = null;
    this.bufferedPoints = 0;
  }
}

/**
 * Describes the successful result of parsing the four visible fields.
 */
interface ParseSuccess {
  readonly ok: true;
  readonly value: MonteCarloGraphRequest;
}

/**
 * Describes a failed field parse with validation messages.
 */
interface ParseFailure {
  readonly ok: false;
  readonly errors: MonteCarloValidationErrors;
}

/**
 * Creates the startup values shown below the canvas.
 *
 * @returns Raw default form values.
 */
function createDefaultFormValues(): MonteCarloFormValues {
  return {
    expression: DEFAULT_MONTE_CARLO_REQUEST.expression,
    xMin: `${DEFAULT_MONTE_CARLO_REQUEST.xMin}`,
    xMax: `${DEFAULT_MONTE_CARLO_REQUEST.xMax}`,
    yMax: `${DEFAULT_MONTE_CARLO_REQUEST.yMax}`,
  };
}


/**
 * Parses and validates the raw fields produced by the view.
 *
 * @param values - Raw form values.
 * @returns Either a typed request or validation errors.
 */
function parseFormValues(values: MonteCarloFormValues): ParseSuccess | ParseFailure {
  const errors: MonteCarloValidationErrors = {};
  const xMin = parseNumber(values.xMin);
  const xMax = parseNumber(values.xMax);
  const yMax = parseNumber(values.yMax);

  if (values.expression.trim().length === 0) {
    errors.expression = 'Write a function expression.';
  } else {
    try {
      compileFunctionExpression(values.expression)(0);
    } catch (error) {
      errors.expression = error instanceof Error ? error.message : 'Use a valid function expression.';
    }
  }

  if (xMin === null) {
    errors.xMin = 'Write a valid left endpoint.';
  }

  if (xMax === null) {
    errors.xMax = 'Write a valid right endpoint.';
  }

  if (yMax === null) {
    errors.yMax = 'Write a valid maximum height.';
  } else if (yMax <= 0) {
    errors.yMax = 'Use a positive y-Max value.';
  }

  if (xMin !== null && xMax !== null && xMax <= xMin) {
    errors.xMax = 'Use an x-Max value greater than x-Min.';
  }

  if (hasValidationErrors(errors)) {
    return {
      ok: false,
      errors,
    };
  }

  return {
    ok: true,
    value: {
      expression: values.expression.trim(),
      xMin: requireNumber(xMin, 'xMin'),
      xMax: requireNumber(xMax, 'xMax'),
      yMax: requireNumber(yMax, 'yMax'),
    },
  };
}

/**
 * Parses one localized decimal string into a finite number.
 *
 * @param rawValue - Raw text field value.
 * @returns A number when valid, otherwise `null`.
 */
function parseNumber(rawValue: string): number | null {
  const normalizedValue = rawValue.trim().replace(/,/gu, '.');

  if (normalizedValue.length === 0) {
    return null;
  }

  const parsedValue = Number(normalizedValue);

  return Number.isFinite(parsedValue) ? parsedValue : null;
}

/**
 * Detects whether at least one field contains an error message.
 *
 * @param errors - Validation-error map.
 * @returns `true` when any field is invalid.
 */
function hasValidationErrors(errors: MonteCarloValidationErrors): boolean {
  return (Object.keys(errors) as MonteCarloFieldName[]).some(
    (fieldName) => errors[fieldName] !== undefined,
  );
}

/**
 * Narrows a nullable parsed number after successful validation.
 *
 * @param value - Nullable numeric value.
 * @param fieldName - Field used in the impossible-state error message.
 * @returns The non-null number.
 * @throws When called before validation has rejected null values.
 */
function requireNumber(value: number | null, fieldName: MonteCarloFieldName): number {
  if (value === null) {
    throw new Error(`Cannot build the Monte Carlo request from invalid ${fieldName}.`);
  }

  return value;
}
