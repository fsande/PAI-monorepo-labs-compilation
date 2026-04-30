/**
 * Universidad de La Laguna
 * Escuela Superior de Ingeniería y Tecnología
 * Grado en Ingeniería Informática
 * Programación de Aplicaciones Interactivas
 * @author Adrián Pérez Poleo
 * @since Apr 25, 2026
 * @desc Program that implements the model of the Hangman game.
 */

import {CountryNamesInSpanish} from './country_names';

export class HangmanModel {
  /** Secret word to be guessed */
  private secretWord: string;
  /** Word containing _ and the letters the user guessed */
  private currentGameState: string;
  /** Number of mistakes the user has made */
  private currentMistakes: number;

  constructor() {
    const countriesArray = Object.values(CountryNamesInSpanish);
    const randomIndex = Math.floor(Math.random() * countriesArray.length);
    this.secretWord = countriesArray[randomIndex];
    this.currentGameState = '';
    for (const character of this.secretWord) {
      if (character === ' ') {
        this.currentGameState += character;
      } else {
        this.currentGameState += '_';
      }
    } 
    this.currentMistakes = 0;
  }

  /**
   * Returns the current state of the word guessed by the user.
   * @return String containing characters and _.
   */
  getGameState(): string {
    return this.currentGameState;
  }

  /**
   * Returns the current number of mistakes the user has made.
   * @return Current number of mistakes the user has made.
   */
  getMistakes(): number {
    return this.currentMistakes;
  }

  /**
   * Returns the secret word the user is trying to guess.
   * @return Word the user is trying to guess.
   */
  getSecretWord(): string {
    return this.secretWord;
  }

  /**
   * Checks if the given character is in the secret word. 
   * @param character Character to check.
   * @return Returns if the character was in the secret word.
   */
  tryCharacter(character: string): boolean {
    if (this.secretWord.includes(character)) {
      let newGameState = '';
      for (let i = 0; i < this.secretWord.length; ++i) {
        if (this.secretWord.at(i) === character) {
          newGameState += character;
        } else {
          newGameState += this.currentGameState[i];
        }
      }
      this.currentGameState = newGameState;
    } else {
      ++this.currentMistakes;
    }
    return this.secretWord.includes(character);
  }

  /**
   * Returns if the user has won the current game.
   * @return True if the user has won the game. False otherwise. 
   */
  isVictory(): boolean {
    return this.currentGameState === this.secretWord;
  }

  /**
   * Returns if the user has lost the game or not.
   * @return True if the user has lost the game. False otherwise.
   */
  isLoss(): boolean {
    return this.currentMistakes === 6;
  }

  /**
   * Restarts the game choosing a new secret word.
   */
  restart(): void {
    const countriesArray = Object.values(CountryNamesInSpanish);
    const randomIndex = Math.floor(Math.random() * countriesArray.length);
    this.secretWord = countriesArray[randomIndex];

    this.currentGameState = '';
    for (const character of this.secretWord) {
      if (character === ' ') {
        this.currentGameState += character;
      } else {
        this.currentGameState += '_';
      }
    } 
    this.currentMistakes = 0;
  }
}