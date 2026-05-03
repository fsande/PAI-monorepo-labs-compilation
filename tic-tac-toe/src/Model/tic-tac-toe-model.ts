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
 * @desc Model component for the TicTacToe game. 
 *       It manages the game logic, state, and rules.
 */

import {Event} from '../event.js';

/**
 * Defines the valid players in the game.
 */
export type Player = 'X' | 'O';

/**
 * Interface representing the data payload when a cell is updated.
 */
export interface UpdateCellData {
  /**
   * Index of the board cell where the move will be done. 
   */
  move: number;
  /** 
   * Player who made the move.
   */
  player: Player;
}

/**
 * Represents the TicTacToe game logic and state.
 */
export class TicTacToeModel {
  private board: (Player | null)[];
  private currentPlayer: Player;
  private finished: boolean;

  private readonly updateCellEvent: Event<UpdateCellData>;
  private readonly victoryEvent: Event<Player>;
  private readonly drawEvent: Event<void>;

  /**
   * Initializes a new instance of the TicTacToe game.
   * Sets up an empty board, sets the starting player to 'X', and creates the events.
   */
  constructor() {
    this.board = Array(9).fill(null);
    this.currentPlayer = 'X';
    this.finished = false;

    this.updateCellEvent = new Event<UpdateCellData>();
    this.victoryEvent = new Event<Player>();
    this.drawEvent = new Event<void>();
  }

  /**
   * Subscribes a listener to be notified whenever a cell on the board is updated.
   * @param listener Callback function receiving the move index and player.
   */
  addUpdateCellListener(listener: (data: UpdateCellData) => void): void {
    this.updateCellEvent.addListener(listener);
  }

  /**
   * Subscribes a listener to be notified when a player wins the game.
   * @param listener Callback function receiving the winning player.
   */
  addVictoryListener(listener: (player: Player) => void): void {
    this.victoryEvent.addListener(listener);
  }

  /**
   * Subscribes a listener to be notified when the game ends in a draw.
   * @param listener Callback function executed on a draw.
   */
  addDrawListener(listener: () => void): void {
    this.drawEvent.addListener(listener);
  }

  /**
   * Attempts to play a move for the current player at the specified position.
   * @param move The index of the board cell to play in.
   * @returns true if the move was valid and executed, false otherwise.
   */
  play(move: number): boolean {
    if (this.finished || move < 0 || move > 8 || this.board[move] !== null) { 
      return false; 
    }

    this.board[move] = this.currentPlayer;
    this.updateCellEvent.trigger({ move, player: this.currentPlayer });

    this.finished = this.victory() || this.draw();

    if (!this.finished) { 
      this.switchPlayer(); 
    }

    return true;
  }

  /**
   * Evaluates the current board state to check for a winning combination.
   * Triggers the victory event if a win is detected.
   * @returns true if there is a winning combination, false otherwise.
   */
  private victory(): boolean {
    const lines = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8],
      [0, 3, 6], [1, 4, 7], [2, 5, 8],
      [0, 4, 8], [2, 4, 6],
    ];

    const isVictory = lines.some(l => 
      this.board[l[0]] !== null && 
      this.board[l[0]] === this.board[l[1]] && 
      this.board[l[1]] === this.board[l[2]]
    );

    if (isVictory) {
      this.victoryEvent.trigger(this.currentPlayer);
    }

    return isVictory;
  }

  /**
   * Evaluates the current board state to check if it is completely full.
   * Triggers the draw event if there are no empty cells left.
   * @returns true if there has been a draw, false otherwise. 
   */
  private draw(): boolean {
    const isDraw = this.board.every(cell => cell !== null);
    if (isDraw) {
      this.drawEvent.trigger(undefined);
    }
    return isDraw;
  }

  /**
   * Toggles the current player turn between 'X' and 'O'.
   */
  private switchPlayer(): void {
    this.currentPlayer = this.currentPlayer === 'X' ? 'O' : 'X';
  }
}