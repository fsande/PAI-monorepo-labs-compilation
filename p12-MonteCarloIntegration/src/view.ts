/**
 * Universidad de La Laguna
 * Escuela Superior de Ingenieria y Tecnologia
 * Grado en Ingenieria Informatica
 * Programacion de Aplicaciones Interactivas
 *
 * @author Pablo Hernandez Jimenez
 * @since Apr 29, 2026
 * @description Provides the DOM and canvas view for the Monte Carlo integral assignment.
 */

import type {
  AxisRangeSnapshot,
  CartesianPlaneSnapshot,
  MonteCarloFormValues,
  MonteCarloGraphSnapshot,
  MonteCarloSamplePointSnapshot,
  MonteCarloValidationErrors,
  PointSnapshot,
} from './types';

const PLOT_PADDING = 42;
const TICK_SIZE = 6;

/**
 * Defines the centered plotting rectangle used for Cartesian projection.
 */
interface PlotRectangle {
  readonly x: number;
  readonly y: number;
  readonly size: number;
}

/**
 * Defines the callbacks exposed by the controller to the view.
 */
export interface MonteCarloIntegralViewBindings {
  readonly onInput: (values: MonteCarloFormValues) => void;
  readonly onAddPoint: () => void;
  readonly onAnimationToggle: (isEnabled: boolean) => void;
  readonly onSpeedChange: (speed: number) => void;
  readonly onReset: () => void;
  readonly onResize: () => void;
}

/**
 * Owns the visible page controls and the function canvas.
 */
export class MonteCarloIntegralView {
  private readonly canvas: HTMLCanvasElement;
  private readonly context: CanvasRenderingContext2D;
  private readonly inputs: Record<keyof MonteCarloFormValues, HTMLInputElement>;
  private readonly errorSlots: Record<keyof MonteCarloValidationErrors, HTMLElement>;
  private readonly statusElement: HTMLElement;
  private readonly addPointButton: HTMLButtonElement;
  private readonly animateCheckbox: HTMLInputElement;
  private readonly speedSlider: HTMLInputElement;
  private readonly resetButton: HTMLButtonElement;
  private readonly totalPointsElement: HTMLElement;
  private readonly pointsWithinAreaElement: HTMLElement;
  private readonly areaEstimationElement: HTMLElement;
  private resizeListener: (() => void) | null = null;
  private inputListener: (() => void) | null = null;
  private addPointListener: (() => void) | null = null;
  private animateListener: (() => void) | null = null;
  private speedListener: (() => void) | null = null;
  private resetListener: (() => void) | null = null;

  /**
   * Creates the view from the expected page elements.
   *
   * @param documentRef - Document that contains the Monte Carlo page.
   */
  constructor(documentRef: Document) {
    this.canvas = expectCanvasElement(documentRef, 'montecarlo-canvas');
    this.context = expectRenderingContext(this.canvas);
    this.inputs = {
      expression: expectInputElement(documentRef, 'input-function'),
      xMin: expectInputElement(documentRef, 'input-x-min'),
      xMax: expectInputElement(documentRef, 'input-x-max'),
      yMax: expectInputElement(documentRef, 'input-y-max'),
    };
    this.errorSlots = {
      expression: expectElement(documentRef, 'input-function-error'),
      xMin: expectElement(documentRef, 'input-x-min-error'),
      xMax: expectElement(documentRef, 'input-x-max-error'),
      yMax: expectElement(documentRef, 'input-y-max-error'),
    };
    this.statusElement = expectElement(documentRef, 'graph-status');
    this.addPointButton = expectButtonElement(documentRef, 'add-point-button');
    this.animateCheckbox = expectInputElement(documentRef, 'animate-checkbox');
    this.speedSlider = expectInputElement(documentRef, 'speed-slider');
    this.resetButton = expectButtonElement(documentRef, 'reset-button');
    this.totalPointsElement = expectElement(documentRef, 'total-points-value');
    this.pointsWithinAreaElement = expectElement(documentRef, 'points-within-area-value');
    this.areaEstimationElement = expectElement(documentRef, 'area-estimation-value');
  }

  /**
   * Wires DOM listeners to the controller callbacks.
   *
   * @param bindings - Controller callbacks for input and resize events.
   */
  bind(bindings: MonteCarloIntegralViewBindings): void {
    this.inputListener = () => {
      bindings.onInput(this.readFormValues());
    };
    this.addPointListener = () => {
      bindings.onAddPoint();
    };
    this.animateListener = () => {
      bindings.onAnimationToggle(this.animateCheckbox.checked);
    };
    this.speedListener = () => {
      bindings.onSpeedChange(readSpeedValue(this.speedSlider));
    };
    this.resetListener = () => {
      bindings.onReset();
    };
    this.resizeListener = () => {
      bindings.onResize();
    };

    for (const input of Object.values(this.inputs)) {
      input.addEventListener('input', this.inputListener);
    }

    this.addPointButton.addEventListener('click', this.addPointListener);
    this.animateCheckbox.addEventListener('change', this.animateListener);
    this.speedSlider.addEventListener('input', this.speedListener);
    this.resetButton.addEventListener('click', this.resetListener);
    window.addEventListener('resize', this.resizeListener);
  }

  /**
   * Releases DOM listeners owned by the view.
   */
  destroy(): void {
    if (this.inputListener !== null) {
      for (const input of Object.values(this.inputs)) {
        input.removeEventListener('input', this.inputListener);
      }
    }

    if (this.addPointListener !== null) {
      this.addPointButton.removeEventListener('click', this.addPointListener);
    }

    if (this.animateListener !== null) {
      this.animateCheckbox.removeEventListener('change', this.animateListener);
    }

    if (this.speedListener !== null) {
      this.speedSlider.removeEventListener('input', this.speedListener);
    }

    if (this.resetListener !== null) {
      this.resetButton.removeEventListener('click', this.resetListener);
    }

    if (this.resizeListener !== null) {
      window.removeEventListener('resize', this.resizeListener);
    }

    this.inputListener = null;
    this.addPointListener = null;
    this.animateListener = null;
    this.speedListener = null;
    this.resetListener = null;
    this.resizeListener = null;
  }

  /**
   * Writes raw form values into the visible inputs.
   *
   * @param values - Raw values that should be shown below the canvas.
   */
  setFormValues(values: MonteCarloFormValues): void {
    this.inputs.expression.value = values.expression;
    this.inputs.xMin.value = values.xMin;
    this.inputs.xMax.value = values.xMax;
    this.inputs.yMax.value = values.yMax;
  }

  /**
   * Reflects the current animation controls in the sidebar.
   *
   * @param isEnabled - Whether autonomous animation is enabled.
   * @param speed - Points-per-second value shown by the slider.
   */
  setSimulationControls(isEnabled: boolean, speed: number): void {
    this.animateCheckbox.checked = isEnabled;
    this.speedSlider.value = `${Math.max(1, Math.round(speed))}`;
  }

  /**
   * Clears all validation feedback from the form.
   */
  clearValidationErrors(): void {
    for (const [fieldName, input] of Object.entries(this.inputs) as [
      keyof MonteCarloFormValues,
      HTMLInputElement,
    ][]) {
      input.setAttribute('aria-invalid', 'false');
      this.errorSlots[fieldName].textContent = '';
    }
  }

  /**
   * Renders field-level validation messages.
   *
   * @param errors - Validation messages keyed by field.
   */
  showValidationErrors(errors: MonteCarloValidationErrors): void {
    this.clearValidationErrors();

    for (const [fieldName, message] of Object.entries(errors) as [
      keyof MonteCarloValidationErrors,
      string | undefined,
    ][]) {
      if (message === undefined) {
        continue;
      }

      this.inputs[fieldName].setAttribute('aria-invalid', 'true');
      this.errorSlots[fieldName].textContent = message;
    }
  }

  /**
   * Draws the current function, axes, and Monte Carlo rectangle.
   *
   * @param snapshot - Render data produced by the model.
   */
  render(snapshot: MonteCarloGraphSnapshot): void {
    resizeCanvas(this.canvas);

    const width = this.canvas.width;
    const height = this.canvas.height;
    const plot = createPlotRectangle(width, height);

    this.context.clearRect(0, 0, width, height);
    paintBackground(this.context, width, height);
    paintGrid(this.context, snapshot.plane, plot);
    paintAxes(this.context, snapshot.plane, plot);
    paintRectangle(this.context, snapshot, plot);
    paintFunction(this.context, snapshot.samples, snapshot.plane, plot);
    paintMonteCarloPoints(this.context, snapshot.monteCarloPoints, snapshot.plane, plot);
    paintAxisLabels(this.context, snapshot.plane, plot);

    this.statusElement.textContent = `f(x) = ${snapshot.expression} on [${formatNumber(
      snapshot.rectangle.xMin,
    )}, ${formatNumber(snapshot.rectangle.xMax)}] with yMax = ${formatNumber(
      snapshot.rectangle.yMax,
    )}`;
    this.totalPointsElement.textContent = `${snapshot.totalPoints}`;
    this.pointsWithinAreaElement.textContent = `${snapshot.pointsWithinArea}`;
    this.areaEstimationElement.textContent = formatNumber(snapshot.areaEstimation);
  }

  /**
   * Reads the current form values from the visible inputs.
   *
   * @returns A raw form-value record.
   */
  readFormValues(): MonteCarloFormValues {
    return {
      expression: this.inputs.expression.value,
      xMin: this.inputs.xMin.value,
      xMax: this.inputs.xMax.value,
      yMax: this.inputs.yMax.value,
    };
  }

  /**
   * Clears the canvas and all text-based UI feedback.
   */
  clearPresentation(): void {
    resizeCanvas(this.canvas);
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    paintBackground(this.context, this.canvas.width, this.canvas.height);
    this.statusElement.textContent = '';
    this.totalPointsElement.textContent = '0';
    this.pointsWithinAreaElement.textContent = '0';
    this.areaEstimationElement.textContent = '0';
  }
}

/**
 * Resizes the canvas backing store to match CSS pixels and device pixel ratio.
 *
 * @param canvas - Canvas that should be resized.
 */
function resizeCanvas(canvas: HTMLCanvasElement): void {
  const bounds = canvas.getBoundingClientRect();
  const pixelRatio = window.devicePixelRatio || 1;
  const nextWidth = Math.max(1, Math.round(bounds.width * pixelRatio));
  const nextHeight = Math.max(1, Math.round(bounds.height * pixelRatio));

  if (canvas.width === nextWidth && canvas.height === nextHeight) {
    return;
  }

  canvas.width = nextWidth;
  canvas.height = nextHeight;
}

/**
 * Paints the paper-like stage background.
 *
 * @param context - 2D canvas context.
 * @param width - Canvas width in device pixels.
 * @param height - Canvas height in device pixels.
 */
function paintBackground(
  context: CanvasRenderingContext2D,
  width: number,
  height: number,
): void {
  context.fillStyle = 'white';
  context.fillRect(0, 0, width, height);
}

/**
 * Creates a square plotting area centered in the canvas.
 *
 * @param width - Canvas width in device pixels.
 * @param height - Canvas height in device pixels.
 * @returns Plot rectangle used for Cartesian projection.
 */
function createPlotRectangle(width: number, height: number): PlotRectangle {
  const size = Math.max(Math.min(width, height) - PLOT_PADDING * 2, 1);

  return {
    x: (width - size) / 2,
    y: (height - size) / 2,
    size,
  };
}

/**
 * Paints the Cartesian grid aligned with plane coordinates.
 *
 * @param context - 2D canvas context.
 * @param plane - Visible Cartesian plane.
 * @param plot - Centered square plot rectangle.
 */
function paintGrid(
  context: CanvasRenderingContext2D,
  plane: CartesianPlaneSnapshot,
  plot: PlotRectangle,
): void {
  const xStep = resolveTickStep(plane.xRange);
  const yStep = resolveTickStep(plane.yRange);

  context.save();
  context.strokeStyle = 'lightgray';
  context.lineWidth = 1;
  context.beginPath();

  for (
    let x = Math.ceil(plane.xRange.minimum / xStep) * xStep;
    x <= plane.xRange.maximum + xStep * 0.5;
    x += xStep
  ) {
    const canvasX = projectPoint({ x, y: 0 }, plane, plot).x;
    context.moveTo(canvasX, plot.y);
    context.lineTo(canvasX, plot.y + plot.size);
  }

  for (
    let y = Math.ceil(plane.yRange.minimum / yStep) * yStep;
    y <= plane.yRange.maximum + yStep * 0.5;
    y += yStep
  ) {
    const canvasY = projectPoint({ x: 0, y }, plane, plot).y;
    context.moveTo(plot.x, canvasY);
    context.lineTo(plot.x + plot.size, canvasY);
  }

  context.stroke();
  context.strokeStyle = 'slategray';
  context.strokeRect(plot.x, plot.y, plot.size, plot.size);
  context.restore();
}

/**
 * Paints the integration rectangle defined by the current inputs.
 *
 * @param context - 2D canvas context.
 * @param snapshot - Current graph snapshot.
 * @param plot - Centered square plot rectangle.
 */
function paintRectangle(
  context: CanvasRenderingContext2D,
  snapshot: MonteCarloGraphSnapshot,
  plot: PlotRectangle,
): void {
  const left = projectPoint({ x: snapshot.rectangle.xMin, y: 0 }, snapshot.plane, plot).x;
  const right = projectPoint({ x: snapshot.rectangle.xMax, y: 0 }, snapshot.plane, plot).x;
  const top = projectPoint({ x: 0, y: snapshot.rectangle.yMax }, snapshot.plane, plot).y;
  const bottom = projectPoint({ x: 0, y: snapshot.rectangle.yMin }, snapshot.plane, plot).y;

  context.save();
  context.fillStyle = 'rgb(14 165 233 / 8%)';
  context.strokeStyle = 'darkcyan';
  context.lineWidth = 2;
  // context.setLineDash([10, 6]);
  context.fillRect(left, top, right - left, bottom - top);
  context.strokeRect(left, top, right - left, bottom - top);
  context.restore();
}

/**
 * Paints the coordinate axes and their tick marks.
 *
 * @param context - 2D canvas context.
 * @param plane - Visible Cartesian plane.
 * @param plot - Centered square plot rectangle.
 */
function paintAxes(
  context: CanvasRenderingContext2D,
  plane: CartesianPlaneSnapshot,
  plot: PlotRectangle,
): void {
  const origin = projectPoint({ x: 0, y: 0 }, plane, plot);
  const xAxisY = origin.y;
  const yAxisX = origin.x;
  const xStep = resolveTickStep(plane.xRange);
  const yStep = resolveTickStep(plane.yRange);

  context.save();
  context.strokeStyle = 'black';
  context.fillStyle = 'black';
  context.lineWidth = 2.25;

  if (plane.yRange.minimum <= 0 && plane.yRange.maximum >= 0) {
    context.beginPath();
    context.moveTo(plot.x, xAxisY);
    context.lineTo(plot.x + plot.size, xAxisY);
    context.stroke();
    paintArrow(context, plot.x + plot.size, xAxisY, 1, 0);
    paintXAxisTicks(context, plane, plot, xAxisY, xStep);
  }

  if (plane.xRange.minimum <= 0 && plane.xRange.maximum >= 0) {
    context.beginPath();
    context.moveTo(yAxisX, plot.y + plot.size);
    context.lineTo(yAxisX, plot.y);
    context.stroke();
    paintArrow(context, yAxisX, plot.y, 0, -1);
    paintYAxisTicks(context, plane, plot, yAxisX, yStep);
  }

  context.restore();
}

/**
 * Paints axis names and numeric labels using the same Cartesian projection.
 *
 * @param context - 2D canvas context.
 * @param plane - Visible Cartesian plane.
 * @param plot - Centered square plot rectangle.
 */
function paintAxisLabels(
  context: CanvasRenderingContext2D,
  plane: CartesianPlaneSnapshot,
  plot: PlotRectangle,
): void {
  const origin = projectPoint({ x: 0, y: 0 }, plane, plot);
  const xAxisY = origin.y;
  const yAxisX = origin.x;
  const xStep = resolveTickStep(plane.xRange);
  const yStep = resolveTickStep(plane.yRange);

  context.save();
  context.fillStyle = 'slategray';
  context.font = '600 13px "Avenir Next", "Segoe UI", sans-serif';

  if (plane.yRange.minimum <= 0 && plane.yRange.maximum >= 0) {
    context.textAlign = 'center';
    context.textBaseline = xAxisY < plot.y + plot.size - 18 ? 'top' : 'bottom';

    for (
      let x = Math.ceil(plane.xRange.minimum / xStep) * xStep;
      x <= plane.xRange.maximum + xStep * 0.5;
      x += xStep
    ) {
      if (Math.abs(x) < xStep * 0.25) {
        continue;
      }

      const point = projectPoint({ x, y: 0 }, plane, plot);
      const labelY = xAxisY < plot.y + plot.size - 18 ? xAxisY + 8 : xAxisY - 8;
      context.fillText(formatTickLabel(x, xStep), point.x, labelY);
    }

    context.font = '600 15px "Avenir Next", "Segoe UI", sans-serif';
    context.fillText('x', plot.x + plot.size - 12, xAxisY - 12);
    context.font = '600 13px "Avenir Next", "Segoe UI", sans-serif';
  }

  if (plane.xRange.minimum <= 0 && plane.xRange.maximum >= 0) {
    context.textAlign = yAxisX > plot.x + 26 ? 'right' : 'left';
    context.textBaseline = 'middle';

    for (
      let y = Math.ceil(plane.yRange.minimum / yStep) * yStep;
      y <= plane.yRange.maximum + yStep * 0.5;
      y += yStep
    ) {
      if (Math.abs(y) < yStep * 0.25) {
        continue;
      }

      const point = projectPoint({ x: 0, y }, plane, plot);
      const labelX = yAxisX > plot.x + 26 ? yAxisX - 10 : yAxisX + 10;
      context.fillText(formatTickLabel(y, yStep), labelX, point.y);
    }

    context.font = '600 15px "Avenir Next", "Segoe UI", sans-serif';
    context.fillText('y', yAxisX + 10, plot.y + 14);
  }

  context.restore();
}

/**
 * Paints the user function as a smooth polyline.
 *
 * @param context - 2D canvas context.
 * @param samples - Sampled points along the function.
 * @param plane - Visible Cartesian plane.
 * @param plot - Centered square plot rectangle.
 */
function paintFunction(
  context: CanvasRenderingContext2D,
  samples: readonly (PointSnapshot | null)[],
  plane: CartesianPlaneSnapshot,
  plot: PlotRectangle,
): void {
  context.save();
  context.strokeStyle = 'orangered';
  context.lineWidth = 4;
  context.lineJoin = 'round';
  context.lineCap = 'round';

  let isSegmentOpen = false;

  for (const point of samples) {
    if (point === null) {
      if (isSegmentOpen) {
        context.stroke();
      }

      isSegmentOpen = false;
      continue;
    }

    const canvasPoint = projectPoint(point, plane, plot);

    if (!isSegmentOpen) {
      context.beginPath();
      context.moveTo(canvasPoint.x, canvasPoint.y);
      isSegmentOpen = true;
      continue;
    }

    context.lineTo(canvasPoint.x, canvasPoint.y);
  }

  if (isSegmentOpen) {
    context.stroke();
  }

  context.restore();
}

/**
 * Paints Monte Carlo sample points using red for hits and blue for misses.
 *
 * @param context - 2D canvas context.
 * @param points - Monte Carlo samples inside the integration rectangle.
 * @param plane - Visible Cartesian plane.
 * @param plot - Centered square plot rectangle.
 */
function paintMonteCarloPoints(
  context: CanvasRenderingContext2D,
  points: readonly MonteCarloSamplePointSnapshot[],
  plane: CartesianPlaneSnapshot,
  plot: PlotRectangle,
): void {
  context.save();

  for (const point of points) {
    const canvasPoint = projectPoint(point, plane, plot);

    context.fillStyle = point.isWithinArea ? 'red' : 'blue';
    context.beginPath();
    context.arc(canvasPoint.x, canvasPoint.y, 1, 0, Math.PI * 2);
    context.fill();
  }

  context.restore();
}

/**
 * Paints short tick marks along the x axis.
 *
 * @param context - 2D canvas context.
 * @param plane - Visible Cartesian plane.
 * @param plot - Centered square plot rectangle.
 * @param xAxisY - Canvas y coordinate of the x axis.
 * @param step - Tick spacing in Cartesian units.
 */
function paintXAxisTicks(
  context: CanvasRenderingContext2D,
  plane: CartesianPlaneSnapshot,
  plot: PlotRectangle,
  xAxisY: number,
  step: number,
): void {
  context.beginPath();

  for (
    let x = Math.ceil(plane.xRange.minimum / step) * step;
    x <= plane.xRange.maximum + step * 0.5;
    x += step
  ) {
    const point = projectPoint({ x, y: 0 }, plane, plot);
    context.moveTo(point.x, xAxisY - TICK_SIZE);
    context.lineTo(point.x, xAxisY + TICK_SIZE);
  }

  context.stroke();
}

/**
 * Paints short tick marks along the y axis.
 *
 * @param context - 2D canvas context.
 * @param plane - Visible Cartesian plane.
 * @param plot - Centered square plot rectangle.
 * @param yAxisX - Canvas x coordinate of the y axis.
 * @param step - Tick spacing in Cartesian units.
 */
function paintYAxisTicks(
  context: CanvasRenderingContext2D,
  plane: CartesianPlaneSnapshot,
  plot: PlotRectangle,
  yAxisX: number,
  step: number,
): void {
  context.beginPath();

  for (
    let y = Math.ceil(plane.yRange.minimum / step) * step;
    y <= plane.yRange.maximum + step * 0.5;
    y += step
  ) {
    const point = projectPoint({ x: 0, y }, plane, plot);
    context.moveTo(yAxisX - TICK_SIZE, point.y);
    context.lineTo(yAxisX + TICK_SIZE, point.y);
  }

  context.stroke();
}

/**
 * Paints a small arrow head aligned with a given direction.
 *
 * @param context - 2D canvas context.
 * @param x - Arrow tip x coordinate.
 * @param y - Arrow tip y coordinate.
 * @param dx - Direction x component.
 * @param dy - Direction y component.
 */
function paintArrow(
  context: CanvasRenderingContext2D,
  x: number,
  y: number,
  dx: number,
  dy: number,
): void {
  const angle = Math.atan2(dy, dx);

  context.save();
  context.translate(x, y);
  context.rotate(angle);
  context.beginPath();
  context.moveTo(0, 0);
  context.lineTo(-12, -6);
  context.lineTo(-12, 6);
  context.closePath();
  context.fill();
  context.restore();
}

/**
 * Formats numeric labels without noisy floating-point tails.
 *
 * @param value - Number that should become label text.
 * @returns Compact text representation.
 */
function formatNumber(value: number): string {
  return Number(value.toFixed(3)).toString();
}

/**
 * Formats tick labels based on their step granularity.
 *
 * @param value - Tick value in Cartesian units.
 * @param step - Tick spacing in Cartesian units.
 * @returns Compact label text.
 */
function formatTickLabel(value: number, step: number): string {
  if (Math.abs(step - Math.round(step)) < 1e-9) {
    return `${Math.round(value)}`;
  }

  return formatNumber(value);
}

/**
 * Resolves a visually stable tick step for one axis range.
 *
 * @param range - Axis range in Cartesian units.
 * @returns A rounded tick spacing.
 */
function resolveTickStep(range: AxisRangeSnapshot): number {
  const span = Math.max(range.maximum - range.minimum, Number.EPSILON);
  const roughStep = span / 8;
  const exponent = Math.floor(Math.log10(roughStep));
  const magnitude = 10 ** exponent;
  const normalized = roughStep / magnitude;

  if (normalized <= 1) {
    return magnitude;
  }

  if (normalized <= 2) {
    return 2 * magnitude;
  }

  if (normalized <= 5) {
    return 5 * magnitude;
  }

  return 10 * magnitude;
}

/**
 * Projects a Cartesian point into canvas coordinates.
 *
 * @param point - Cartesian point.
 * @param plane - Plane ranges.
 * @param plot - Centered square plot rectangle.
 * @returns Canvas-space coordinates.
 */
function projectPoint(
  point: PointSnapshot,
  plane: CartesianPlaneSnapshot,
  plot: PlotRectangle,
): PointSnapshot {
  const xRatio =
    (point.x - plane.xRange.minimum) / (plane.xRange.maximum - plane.xRange.minimum);
  const yRatio =
    (point.y - plane.yRange.minimum) / (plane.yRange.maximum - plane.yRange.minimum);

  return {
    x: plot.x + xRatio * plot.size,
    y: plot.y + (1 - yRatio) * plot.size,
  };
}

/**
 * Resolves a required canvas element by id.
 *
 * @param documentRef - Document to query.
 * @param id - Canvas element id.
 * @returns The resolved canvas element.
 * @throws When the element is missing or has the wrong type.
 */
function expectCanvasElement(documentRef: Document, id: string): HTMLCanvasElement {
  const element = documentRef.getElementById(id);

  if (!(element instanceof HTMLCanvasElement)) {
    throw new Error(`Expected canvas "${id}".`);
  }

  return element;
}

/**
 * Resolves a required input element by id.
 *
 * @param documentRef - Document to query.
 * @param id - Input element id.
 * @returns The resolved input element.
 * @throws When the element is missing or has the wrong type.
 */
function expectInputElement(documentRef: Document, id: string): HTMLInputElement {
  const element = documentRef.getElementById(id);

  if (!(element instanceof HTMLInputElement)) {
    throw new Error(`Expected input "${id}".`);
  }

  return element;
}

/**
 * Resolves a required button element by id.
 *
 * @param documentRef - Document to query.
 * @param id - Button element id.
 * @returns The resolved button element.
 * @throws When the element is missing or has the wrong type.
 */
function expectButtonElement(documentRef: Document, id: string): HTMLButtonElement {
  const element = documentRef.getElementById(id);

  if (!(element instanceof HTMLButtonElement)) {
    throw new Error(`Expected button "${id}".`);
  }

  return element;
}

/**
 * Reads the slider value as a positive integer speed.
 *
 * @param slider - Range input controlling simulation speed.
 * @returns Points-per-second speed.
 */
function readSpeedValue(slider: HTMLInputElement): number {
  const parsedValue = Number(slider.value);

  if (!Number.isFinite(parsedValue)) {
    return 1;
  }

  return Math.max(1, Math.round(parsedValue));
}

/**
 * Resolves a required generic HTMLElement by id.
 *
 * @param documentRef - Document to query.
 * @param id - Element id.
 * @returns The resolved element.
 * @throws When the element is missing.
 */
function expectElement(documentRef: Document, id: string): HTMLElement {
  const element = documentRef.getElementById(id);

  if (!(element instanceof HTMLElement)) {
    throw new Error(`Expected element "${id}".`);
  }

  return element;
}

/**
 * Resolves the 2D rendering context for the simulation canvas.
 *
 * @param canvas - Canvas that should expose a 2D context.
 * @returns The resolved rendering context.
 * @throws When the context is unavailable.
 */
function expectRenderingContext(canvas: HTMLCanvasElement): CanvasRenderingContext2D {
  const context = canvas.getContext('2d');

  if (context === null) {
    throw new Error('Expected a 2D rendering context.');
  }

  return context;
}
