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
 * @desc Controller component for the TicTacToe game. 
 *       It acts as the mediator between the Model and the View, 
 *       linking user interactions to game logic updates.
 */

import {TicTacToeModel as TicTacToeModel} from '../Model/tic-tac-toe-model.js';
import {TicTacToeView} from '../View/tic-tac-toe-view.js';

/**
 * Class that initializes both the Model and the View, 
 * and handles the communication between them.
 */
export class TicTacToeController {
  /**
   * Creates a new instance of the TicTacToeController.
   * @param model Model that contains the information of the game.
   * @param view Interface used to display the model.
   */
  constructor(private readonly model: TicTacToeModel,
              private readonly view: TicTacToeView) {

    this.view.addPlayListener((move: number) => { 
      this.model.play(move); 
    });

    this.model.addUpdateCellListener((data) => { 
      this.view.updateCell(data); 
    });

    this.model.addVictoryListener((winner) => { 
      this.view.victory(winner); 
    });

    this.model.addDrawListener(() => { 
      this.view.draw(); 
    });
  }

  /**
   * Starts the application by rendering the initial view.
   */
  run(): void {
    this.view.render();
  }
}