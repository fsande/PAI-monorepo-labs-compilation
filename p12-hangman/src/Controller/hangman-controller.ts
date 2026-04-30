/**
 * Universidad de La Laguna
 * Escuela Superior de Ingeniería y Tecnología
 * Grado en Ingeniería Informática
 * Programación de Aplicaciones Interactivas
 * @author Adrián Pérez Poleo
 * @since Apr 25, 2026
 * @desc Program that implements controller of the Hangman game.
 */

import {HangmanModel} from '../Model/hangman-model';
import {HangmanView} from '../View/hangman-view';

export class HangmanController {
  constructor (private readonly model: HangmanModel,
               private readonly view: HangmanView) {
    this.view.update(this.model.getGameState(), this.model.getMistakes());

    this.view.addClickedCharacterListener((character) => this.handleNewCharacter(character));
    this.view.addRestartListener(() => this.handleRestart());
  }

  /**
   * Receives the character clicked by the user and updates the model.
   * @param character Character introduced by the user.
   */
  private handleNewCharacter(character: string): void {
    this.model.tryCharacter(character);
    this.view.update(this.model.getGameState(), this.model.getMistakes());

    if (this.model.isVictory()) {
      this.view.displayWin();
      this.finishGame();
    }

    if (this.model.isLoss()) {
      this.view.update(this.model.getSecretWord(), this.model.getMistakes());
      this.view.displayLoss();
      this.finishGame();
    }
  }

  /**
   * Defines how to restart the game.
   */
  private handleRestart(): void {
    this.model.restart();
    this.view.restart();
    this.view.update(this.model.getGameState(), this.model.getMistakes());
  }

  /**
   * Ends the game and suscribes to the Restart event.
   */
  private finishGame(): void {
    this.view.end();
  }
}