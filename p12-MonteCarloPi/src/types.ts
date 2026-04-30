/**
 * Universidad de La Laguna
 * Escuela Superior de Ingenieria y Tecnologia
 * Grado en Ingenieria Informatica
 * Programacion de Aplicaciones Interactivas
 *
 * @author Pablo Hernandez Jimenez
 * @since Apr 29, 2026
 * @description Defines the Monte Carlo integral MVC data contracts.
 */

/**
 * Enumerates the editable input names shown below the canvas.
 */
export type MonteCarloFieldName = 'expression' | 'xMin' | 'xMax' | 'yMax';

/**
 * Stores the raw string values typed by the user.
 */
export interface MonteCarloFormValues {
  readonly expression: string;
  readonly xMin: string;
  readonly xMax: string;
  readonly yMax: string;
}

/**
 * Associates optional validation messages with each form field.
 */
export type MonteCarloValidationErrors = Partial<Record<MonteCarloFieldName, string>>;

/**
 * Represents one Cartesian point ready for rendering.
 */
export interface PointSnapshot {
  readonly x: number;
  readonly y: number;
}

/**
 * Stores one Monte Carlo sample together with its area classification.
 */
export interface MonteCarloSamplePointSnapshot extends PointSnapshot {
  readonly isWithinArea: boolean;
}

/**
 * Describes one numeric axis range in Cartesian coordinates.
 */
export interface AxisRangeSnapshot {
  readonly minimum: number;
  readonly maximum: number;
}

/**
 * Represents the visible Cartesian plane used to draw the assignment.
 */
export interface CartesianPlaneSnapshot {
  readonly xRange: AxisRangeSnapshot;
  readonly yRange: AxisRangeSnapshot;
}

/**
 * Stores the numeric request accepted by the model after validation.
 */
export interface MonteCarloGraphRequest {
  readonly expression: string;
  readonly xMin: number;
  readonly xMax: number;
  readonly yMax: number;
}

/**
 * Describes the plot rectangle used by the Monte Carlo method.
 */
export interface RectangleSnapshot {
  readonly xMin: number;
  readonly xMax: number;
  readonly yMin: number;
  readonly yMax: number;
}

/**
 * Captures the full state needed by the view to draw the scene.
 */
export interface MonteCarloGraphSnapshot {
  readonly expression: string;
  readonly plane: CartesianPlaneSnapshot;
  readonly rectangle: RectangleSnapshot;
  readonly samples: readonly (PointSnapshot | null)[];
  readonly monteCarloPoints: readonly MonteCarloSamplePointSnapshot[];
  readonly totalPoints: number;
  readonly pointsWithinArea: number;
  readonly areaEstimation: number;
}
