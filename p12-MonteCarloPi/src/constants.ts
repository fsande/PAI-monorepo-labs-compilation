/**
 * Universidad de La Laguna
 * Escuela Superior de Ingenieria y Tecnologia
 * Grado en Ingenieria Informatica
 * Programacion de Aplicaciones Interactivas
 *
 * @author Pablo Hernandez Jimenez
 * @since Apr 29, 2026
 * @description Stores defaults for the Monte Carlo integral MVC assignment.
 */

import type { CartesianPlaneSnapshot, MonteCarloGraphRequest } from './types';

/**
 * Stores the default integration configuration shown at startup.
 */
export const DEFAULT_MONTE_CARLO_REQUEST: MonteCarloGraphRequest = {
  expression: '-(x - 1) (x + 1)',
  xMin: -1,
  xMax: 1,
  yMax: 1,
};

/**
 * Defines the fixed Cartesian plane used to render the function and axes.
 */
export const MONTE_CARLO_CARTESIAN_PLANE: CartesianPlaneSnapshot = {
  xRange: {
    minimum: -1.5,
    maximum: 1.5,
  },
  yRange: {
    minimum: -1.5,
    maximum: 1.5,
  },
};

/**
 * Stores the default animation speed shown by the slider.
 */
export const DEFAULT_MONTE_CARLO_SPEED = 50;

/**
 * Stores the startup state of the animation checkbox.
 */
export const DEFAULT_MONTE_CARLO_ANIMATION_ENABLED = false;
