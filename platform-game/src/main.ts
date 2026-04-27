/**
 * Universidad de La Laguna
 * Escuela Superior de Ingeniería y Tecnología
 * Grado en Ingeniería Informática
 * Programación de Aplicaciones Interactivas
 *
 * @author Adrián Castro Rodríguez <adrian.castro.46@ull.edu.es>
 * @author Bruno Morales Hernández <morales.hernandez.28@ull.edu.es>
 * @author Ezequiel Juan Canale Oliva <ezequiel.juan.11@ull.edu.es>
 * @since Apr 27 2026
 * @desc Application entry point that wires up game levels, MVC instances, and
 * launches gameplay.
 */

import {GAME_LEVELS} from './GameLevels.js';
import {GameController} from './controller/GameController.js';
import {GameModel} from './model/GameModel.js';
import {GameView} from './view/GameView.js';

/** @desc Entry point of the game application. */
function main() {
  const canvas = document.getElementById('main-canvas');
  if (!(canvas instanceof HTMLCanvasElement)) {
    throw new TypeError('Main: #main-canvas not found or invalid');
  }
  const model = new GameModel(GAME_LEVELS);
  const view = new GameView(canvas, 'canvas');
  const controller = new GameController(model, view);
  controller.start();
}

main();
