/**
 * Universidad de La Laguna
 * Escuela Superior de Ingeniería y Tecnología
 * Grado en Ingeniería Informática
 * Programación de Aplicaciones Interactivas 2024-2025
 *
 * @author Eric Rios Hamilton
 * @since May 1, 2025
 * @desc Main entry point for the Trapezoidal Rule Calculator.
 *
 */

import { TrapezoidalModel } from "./model/trapezoidal-model";
import { TrapezoidalView } from "./view/trapezoidal-view";
import { TrapezoidalController } from "./controller/trapezoidal-controller";

function main() {
  const trapezoidalModel = new TrapezoidalModel();
  const trapezoidalView = new TrapezoidalView('graph-canvas');
  const trapezoidalController = new TrapezoidalController(trapezoidalModel, trapezoidalView);
  trapezoidalController.initialize({
    expression: 'x^2 + 1',
    numberOfTrapezoids: 4,
    xStart: 0,
    xEnd: 2,
  });
}

main();