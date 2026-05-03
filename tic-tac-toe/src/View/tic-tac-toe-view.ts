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
 * @desc View component for the TicTacToe game. 
 *       It handles DOM manipulation, renders the board, and captures user interactions.
 */

import {Event} from '../event.js';
import type {Player} from '../Model/tic-tac-toe-model.js';
import type {UpdateCellData } from '../Model/tic-tac-toe-model.js';

/**
 * Class that models how the TicTacToe game will be displayed.
 */
export class TicTacToeView {
  /**
   * Event triggered when a user clicks on a board cell that 
   * emits the index of the selected cell.
   */
  private readonly playEvent: Event<number>;
  
  /**
   * Array of DOM elements representing the 9 cells of the TicTacToe board.
   */
  private cells!: HTMLDivElement[];  // The ! indicates that it will be initialized later.

  /**
   * DOM element used to display the game outcome.
   */
  private message!: HTMLDivElement;

  /**
   * Initializes the view and creates the event emitter for player moves.
   */
  constructor() {
    this.playEvent = new Event<number>(); // The event will emmit the number of the chosen cell.
  }

  /**
   * Subscribes a listener to the event triggered when a user clicks a cell.
   * @param listener Callback function that receives the index of the clicked cell.
   */
  addPlayListener(listener: (move: number) => void): void {
    this.playEvent.addListener(listener);
  }

  /**
   * Builds the TicTacToe board and injects the HTML elements into the DOM.
   * It also attaches click event listeners to each cell.
   */
  render(): void {
    const board = document.createElement('div');
    board.className = 'board';
    this.cells = Array(9).fill(null).map((_, i) => {
      const cell = document.createElement('div');
      cell.className = 'cell';
      cell.addEventListener('click', () => {
        this.playEvent.trigger(i);
      });
      board.appendChild(cell);
      return cell;
    });

    this.message = document.createElement('div');
    this.message.className = 'message';

    const root = document.getElementById('root');
    if (root) {
      root.appendChild(board);
      root.appendChild(this.message);
    }
  }

  /**
   * Updates a specific cell in the DOM with the corresponding player's symbol.
   * @param data Object containing the cell index and the player.
   */
  updateCell(data: UpdateCellData): void {
    if (this.cells[data.move]) {
      this.cells[data.move].innerHTML = data.player;
    }
  }

  /**
   * Displays the victory message on the screen.
   * @param winner The player who has won the game.
   */
  victory(winner: Player): void {
    this.message.innerHTML = `${winner} wins!`;
  }

  /**
   * Displays the draw message on the screen.
   */
  draw(): void {
    this.message.innerHTML = 'It\'s a draw!';
  }
}
