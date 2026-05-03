/**
 * Universidad de La Laguna
 * Escuela Superior de Ingeniería y Tecnología
 * Grado en Ingeniería Informática
 * Programación de Aplicaciones Interactivas 2025-2026
 *
 * @author Adrián Pérez Poleo <adrian.perez.46@ull.edu.es>
 * @author Enrique Gómez Díaz <enrique.gomez.13@ull.edu.es>
 * @author Manuel Cadenas García <manuel.cadenas.25@ull.edu.es>
 * @since Mar 30 2026
 * @description Program that initializes the TicTacToe controller and starts the game execution.
 */

import {TicTacToeController} from './Controller/tic-tac-toe-controller.js';
import { TicTacToeView } from './View/tic-tac-toe-view.js';
import {TicTacToeModel} from './Model/tic-tac-toe-model.js';

/**
 * Main function of the program.
 */
function main() {
  const ticTacToeView = new TicTacToeView();
  const ticTacToeModel = new TicTacToeModel();
  const ticTacToe = new TicTacToeController(ticTacToeModel, ticTacToeView);
  ticTacToe.run();
}

main();