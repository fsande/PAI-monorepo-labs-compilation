/**
 * Universidad de La Laguna
 * Escuela Superior de Ingeniería y Tecnología
 * Grado en Ingeniería Informática
 * Programación de Aplicaciones Interactivas 2025-2026
 *
 * @author Sergio Rosales Calzadilla alu0101635590@ull.edu.es
 * @since Apr 18 2026
 * @desc Main entry point for the Lissajous curves application.
 * Instantiates the MVC components and starts the application.
 */

import { LissajousCurveModel } from './model/lissajous-curve-model.js';
import { View } from './view/view.js';
import { Controller } from './controller/controller.js';

/**
 * @description Main function that bootstraps the application.
 */
function main(): void {
  const model = new LissajousCurveModel();
  const view = new View();
  new Controller(model, view);
}

main();