/**
 * Universidad de La Laguna
 * Escuela Superior de Ingeniería y Tecnología
 * Grado en Ingeniería Informática
 * Programación de Aplicaciones Interactivas
 * @author Adrián Pérez Poleo
 * @since Apr 25, 2026
 * @desc Class that models the interface of the Hangman application.
 */

import {HangmanImageRender} from './image-render';
import {Keyboard} from './keyboard';
import {WordViewer} from './word-viewer';
import {ResultViewer} from './result-viewer';

export class HangmanView {
  /** Class containing the image of the hangman. */
  private readonly hangmanImage = new HangmanImageRender('hangman_image');
  /** Class that displays the keyboard. */
  private readonly keyboard: Keyboard = new Keyboard();
  /** Displays the word on screen. */
  private readonly wordViewer: WordViewer = new WordViewer();
  /** Class that displays the result of the game.  */
  private readonly resultViewer: ResultViewer = new ResultViewer();

  constructor() {
    this.keyboard.setListeners();
  }

  /**
   * UPdates the view with the new game state and number of errors.
   * @param word Word representing the current game state.
   * @param mistakes Number of mistakes the user has made.
   */
  update(word: string, mistakes: number): void {
    this.hangmanImage.updateHangmanImage(mistakes);
    this.wordViewer.displayWord(word);
  }

  /** Ends the game and displays the restart button.  */
  end(): void {
    this.keyboard.removeListeners();
  }

  /** Resets the listeners so that none is actively listening and clears the * canvas.  */
  restart(): void {
    this.keyboard.removeListeners();
    this.keyboard.setListeners();
    this.resultViewer.clear();
  }

  /**
   * Adds a new listener to the click character event
   * @param callback New listener.
   */
  addClickedCharacterListener(callback: (character: string) => void): void {
    this.keyboard.addClickedCharacterListener(callback);
  }

  /**
   * Adds a new listener to the restart event
   * @param callback New listener.
   */
  addRestartListener(callback: () => void): void {
    this.keyboard.addRestartListener(callback);
  }

  /**
   * Displays a victory message.
   */
  displayWin(): void  {
    this.resultViewer.displayVictory();
  }

  /**
   * Displays a defeat message.
   */
  displayLoss(): void {
    this.resultViewer.displayLoss();
  }
}
