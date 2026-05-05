/**
 * Universidad de La Laguna
 * Escuela Superior de Ingeniería y Tecnología
 * Grado en Ingeniería Informática
 * Programación de Aplicaciones Interactivas
 * @author Adrián Pérez Poleo
 * @since Apr 29, 2026
 * @desc Class that models the model of the Balatro application.
 */

import {Card} from './card';
import type {HandScore} from './score-calculator';
import {ScoreCalculator} from './score-calculator';
import type {Level} from './level';
import {PlayerState} from './player_state';
import {Event} from '../event';
import {BalatroRules} from './balatro-rules';

/**
 * Class that models a Balatro model.
 */
export class BalatroModel {
  /** class containing the cards of the player. */
  private player: PlayerState;

  /** Number of points the user has received. */
  private currentPoints: number = 0;
  /** Number of discards the user has done. */
  private discardsDone: number = 0;
  /** Number of hands the user has played. */
  private playsDone: number = 0;

  /** Event that indicates the user has reched the target score. */
  private readonly victoryEvent = new Event<void>();
  /** Event triggered when the number of hands playes is higher than the allowed. */
  private readonly gameOverEvent = new Event<void>();

  /**
   * Initializes all the elements needed to play the Balatro game.
   * @param currentLevel Information needed about the level to be played.
   */
  constructor(private currentLevel: Level = {name: 'Small Blind', targetScore: 300, maximumHands: 3, maximumDiscards: 3, handSize: 8, maximumSelectedCards: 5}) {
    this.player = new PlayerState(currentLevel.handSize);
  }

  /**
   * Returns the hand the user is playing with.-
   * @return Cards the user is playing with. 
   */
  getCurrentHand(): Card[] {
    return this.player.getHand();
  }

  /**
   * Returns the cards of the current hand sorted by the value of its cards.
   * @return Cards sorted by value.
   */
  getHandSortedByValue(): Card[] {
    return [...this.player.getHand()].sort((first, second) => {
      const firstIndex = BalatroRules.VALUE_ORDER.indexOf(first.getValue());
      const secondIndex = BalatroRules.VALUE_ORDER.indexOf(second.getValue());
      return secondIndex - firstIndex;
    });
  }

  /**
   * Returns the cards of the current hand sorted by the suit of its cards.
   * @return Cards sorted by suit.
   */
  getHandSortedBySuit(): Card[] {
    return [...this.player.getHand()].sort((first, second) => {
      const firstIndex = BalatroRules.SUIT_ORDER.indexOf(first.getSuit());
      const secondIndex = BalatroRules.SUIT_ORDER.indexOf(second.getSuit());
      return secondIndex - firstIndex;  // We will sort from highest to lowest
    });
  }


  /**
   * Returns the number of cards the deck has.
   * @return Number of cards the deck has.
   */
  getDeckSize(): number {
    return this.player.getDeckSize();
  }

  /**
   * Returns the number of cards that have been selected.
   * @return Number of selected cards. 
   */
  getNumberOfSelectedCards(): number {
    return this.player.getSelectedCards().length;
  }

  /**
   * Selects a card in the hand.
   * @param card Card to be selected.
   * @return True if the card could be selected. False otherwise.
   */
  selectCard(card: Card): boolean {
    return this.player.selectCard(card);
  }

  /**
   * Removes the selection of a card.
   * @param card Card to be unselected.
   */
  unselectCard(card: Card): void {
    this.player.unselectCard(card);
  }

  /**
   * Evaluates the selected cards to show the preview.
   * @return Score of the current selected cards.
   */
  evaluateHand(): HandScore {
    const evaluator = new ScoreCalculator();
    return evaluator.evaluate(this.player.getSelectedCards());
  }

  /**
   * Calculates the score of the current hand and evaluates if the game is over. 
   */
  playHand(): void {
    if (this.getRemainingHands() <= 0) return;

    const score = this.evaluateHand();
    ++this.playsDone;
    this.currentPoints += score.totalScore;
    this.player.discardSelectedCardsAndRefill();

    if (this.isGameOver()) {
      this.gameOverEvent.trigger();
    } else if (this.isVictory()) {
      this.victoryEvent.trigger();
    }
  }

  /**
   * Discards the cards the user has selected and refills the slots with new cards.
   */
  discardSelectedCards(): void {
    if (this.discardsDone >= this.currentLevel.maximumDiscards) return;
    this.player.discardSelectedCardsAndRefill();
    ++this.discardsDone;
  }

  /**
   * Returns the number of pointsd the user has won.
   * @return Number of points the user has won. 
   */
  getTotalNeededPoints(): number {
    return this.currentLevel.targetScore;
  }

  /**
   * Returns the number of points the user needs to win.
   * @return Points the user needs to win.
   */
  getCurrentNeededPoints(): number {
    return Math.max(0, this.currentLevel.targetScore - this.currentPoints);
  }

  /**
   * Returns the number of points the user has.
   * @return Number of points the user currently has.
   */
  getCurrentPoints(): number {
    return this.currentPoints;
  }

  /**
   * Returns the number of discard the user can do.
   * @return Number of discards the user is still able to do. 
   */
  getRemainingDiscards(): number {
    return this.currentLevel.maximumDiscards - this.discardsDone;
  }

  /**
   * Returns the maximum number of discards the user can do.
   * @return Maximum number of discards the user can do.
   */
  getTotalAllowedDiscards(): number {
    return this.currentLevel.maximumDiscards;
  }

  /**
   * Returns the number of hands available before losing the game.
   * @return Number of hands the user can still play. 
   */
  getRemainingHands(): number {
    return this.currentLevel.maximumHands - this.playsDone;
  }

  /**
   * Returns the maximum number of plays the user can do.
   * @return Maximum number of plays the user can do.
   */
  getTotalAllowedHands(): number {
    return this.currentLevel.maximumHands;
  }

  /**
   * Returns true if the user has lost the game.
   * @return True if the game is over. False otherwise. 
   */
  private isGameOver(): boolean {
    return this.currentPoints < this.currentLevel.targetScore && this.playsDone === this.currentLevel.maximumHands;
  }

  /**
   * Returns true if the user has won the game.
   * @return True if the user has won. False otherwise. 
   */
  private isVictory(): boolean {
    return this.currentPoints >= this.currentLevel.targetScore && this.playsDone <= this.currentLevel.maximumHands;
  }

  /**
   * Restarts the game by setting all the information to the initial state.
   */
  restart(): void {
    this.currentPoints = 0;
    this.discardsDone = 0;
    this.playsDone = 0;
    this.player.restart();
  }

  /**
   * Adds a listener to the game over event.
   * @param callback New listener.
   */
  addGameOverListener(callback: () => void): void {
    this.gameOverEvent.addListener(callback);
  }

  /**
   * Adds a new listener to the victory Event.
   * @param callback New listener.
   */
  addVictoryListener(callback: () => void): void {
    this.victoryEvent.addListener(callback);
  }
}
