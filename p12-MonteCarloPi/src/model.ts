/**
 * Universidad de La Laguna
 * Escuela Superior de Ingenieria y Tecnologia
 * Grado en Ingenieria Informatica
 * Programacion de Aplicaciones Interactivas
 *
 * @author Pablo Hernandez Jimenez
 * @since Apr 29, 2026
 * @description Implements the model for the Monte Carlo integral MVC assignment.
 */

import type {
  MonteCarloGraphRequest,
  MonteCarloGraphSnapshot,
  MonteCarloSamplePointSnapshot,
  PointSnapshot,
} from './types';

import {
  DEFAULT_MONTE_CARLO_REQUEST,
  MONTE_CARLO_CARTESIAN_PLANE,
} from './constants';
import { compileFunctionExpression, type FunctionEvaluator } from './expression';

const SAMPLE_COUNT = 320;

/**
 * Owns the validated function and graph bounds for the assignment.
 */
export class MonteCarloIntegralModel {
  private request = DEFAULT_MONTE_CARLO_REQUEST;
  private evaluator = compileFunctionExpression(DEFAULT_MONTE_CARLO_REQUEST.expression);
  private monteCarloPoints: MonteCarloSamplePointSnapshot[] = [];

  /**
   * Replaces the current graph configuration.
   *
   * @param request - Validated function and rectangle bounds.
   * @returns The resulting render snapshot.
   */
  configure(request: MonteCarloGraphRequest): MonteCarloGraphSnapshot {
    const hasConfigurationChanged =
      this.request.expression !== request.expression ||
      this.request.xMin !== request.xMin ||
      this.request.xMax !== request.xMax ||
      this.request.yMax !== request.yMax;

    this.request = request;
    this.evaluator = compileFunctionExpression(request.expression);
    if (hasConfigurationChanged) {
      this.monteCarloPoints = [];
    }

    return this.getSnapshot();
  }

  /**
   * Restores the startup configuration.
   *
   * @returns The default render snapshot.
   */
  reset(): MonteCarloGraphSnapshot {
    this.request = DEFAULT_MONTE_CARLO_REQUEST;
    this.evaluator = compileFunctionExpression(DEFAULT_MONTE_CARLO_REQUEST.expression);
    this.monteCarloPoints = [];

    return this.getSnapshot();
  }

  /**
   * Adds one random Monte Carlo sample inside the integration rectangle.
   *
   * @returns The updated render snapshot.
   */
  addRandomPoint(): MonteCarloGraphSnapshot {
    const x = this.request.xMin + Math.random() * (this.request.xMax - this.request.xMin);
    const y = Math.random() * this.request.yMax;
    const functionValue = this.evaluator(x);

    this.monteCarloPoints.push({
      x,
      y,
      isWithinArea: functionValue >= 0 && y <= functionValue,
    });

    return this.getSnapshot();
  }

  /**
   * Adds several random Monte Carlo samples inside the integration rectangle.
   *
   * @param count - Number of points that should be generated.
   * @returns The updated render snapshot.
   */
  addRandomPoints(count: number): MonteCarloGraphSnapshot {
    const boundedCount = Math.max(0, Math.floor(count));

    for (let index = 0; index < boundedCount; index += 1) {
      this.addRandomPoint();
    }

    return this.getSnapshot();
  }

  /**
   * Captures the current model state as plain render data.
   *
   * @returns The snapshot consumed by the view.
   */
  getSnapshot(): MonteCarloGraphSnapshot {
    const samples = sampleFunction(
      this.evaluator,
      MONTE_CARLO_CARTESIAN_PLANE.xRange.minimum,
      MONTE_CARLO_CARTESIAN_PLANE.xRange.maximum,
    );
    const pointsWithinArea = this.monteCarloPoints.filter((point) => point.isWithinArea).length;
    const rectangleArea =
      (this.request.xMax - this.request.xMin) * (this.request.yMax - 0);
    const totalPoints = this.monteCarloPoints.length;
    const areaEstimation =
      totalPoints === 0 ? 0 : (pointsWithinArea / totalPoints) * rectangleArea;

    return {
      expression: this.request.expression,
      plane: MONTE_CARLO_CARTESIAN_PLANE,
      rectangle: {
        xMin: this.request.xMin,
        xMax: this.request.xMax,
        yMin: 0,
        yMax: this.request.yMax,
      },
      samples,
      monteCarloPoints: this.monteCarloPoints,
      totalPoints,
      pointsWithinArea,
      areaEstimation,
    };
  }
}

/**
 * Samples the current function across the configured interval.
 *
 * @param evaluator - Numeric function evaluator.
 * @param xMin - Left edge of the interval.
 * @param xMax - Right edge of the interval.
 * @returns A polyline-ready list of points, with `null` entries breaking invalid spans.
 */
function sampleFunction(
  evaluator: FunctionEvaluator,
  xMin: number,
  xMax: number,
): readonly (PointSnapshot | null)[] {
  return Array.from({ length: SAMPLE_COUNT + 1 }, (_, index) => {
    const x = xMin + ((xMax - xMin) * index) / SAMPLE_COUNT;

    try {
      const y = evaluator(x);
      return Number.isFinite(y) ? { x, y } : null;
    } catch {
      return null;
    }
  });
}
