/**
 * Universidad de La Laguna
 * Escuela Superior de Ingeniería y Tecnología
 * Grado en Ingeniería Informática
 * Programación de Aplicaciones Interactivas
 *
 * @author Daniel Martínez
 * @since Apr 07 2026
 * @description Main entry point for the Ellipse rendering application.
 */

import { PlotterController } from './plotter-controller.js';

/**
 * Starts the application by initializing the controller.
 * @desc Minimal entry point that delegates all logic to the PlotterController.
 */
function main(): void {
  const applicationController = new PlotterController();
  applicationController.run();
}

main();