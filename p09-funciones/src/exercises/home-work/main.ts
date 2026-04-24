/**
 * Universidad de La Laguna
 * Escuela Superior de Ingeniería y Tecnología
 * Grado en Ingeniería Informática
 * Programación de Aplicaciones Interactivas
 *
 * @author Daniel Martínez
 * @since Apr 07 2026
 * @description Main entry point. Instantiates and runs the application controller.
 */

import { PlotterController } from './plotter-controller.ts';

/**
 * Starts the application by initializing the controller.
 * @desc Minimal entry point that delegates all logic to the PlotterController[cite: 1, 2].
 */
function main() {
  const applicationController = new PlotterController('plot-canvas', 'text-canvas', 'function-input', 'render-button');
  applicationController.run();
}

main();
