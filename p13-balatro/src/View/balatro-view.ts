/**
 * Universidad de La Laguna
 * Escuela Superior de Ingeniería y Tecnología
 * Grado en Ingeniería Informática
 * Programación de Aplicaciones Interactivas
 * @author Adrián Pérez Poleo
 * @since Apr 29, 2026
 * @desc Class that models the view of the Balatro application.
 */

import {InventoryDisplay} from './inventory-display';
import {HandDisplay} from './hand-display';
import {ScoreDisplay} from './score-display';
import {ActionPanel} from './action-panel';
import {Card} from '../Model/card';
import {PreviewDisplay} from './preview-display';
import type {HandScore} from '../Model/score-calculator';
import {ResultDisplay} from './result-display';
import {LevelInformationDisplay} from './level-information-display';

/**
 * Class that models a Balatro View.
 */
export class BalatroView {
  /** Class that displays the level information */
  private readonly levelInformationDisplay = new LevelInformationDisplay('level-information');
  /** Class that displays the hand of jokers. */
  private readonly inventoryDisplay = new InventoryDisplay('inventory');
  /** Class that displays the number of earned points and needed points on the screen. */
  private scoreDisplay = new ScoreDisplay('points');
  /** Class that renders the current hand the user is playing with. */
  private readonly handDisplay = new HandDisplay('hand', 8);
  /** Class that displays the earned score with the current selected cards. */
  private readonly previewDisplay = new PreviewDisplay('preview');
  /** Class that handles the input events and the counters. */
  private readonly actionPanel = new ActionPanel('actions');
  /** Class that displays the result of the game. */
  private readonly resultDisplay = new ResultDisplay();

  /**
   * Creates a new instance of the view of the Balatro application.
   */
  constructor() {
    this.setListeners();
  }

  /**
   * Sets the number of points needed.
   * @param neededPoints 
   */
  setNeededPoints(neededPoints: number) {
    this.scoreDisplay.setTotalNeededPoints(neededPoints);
  }

  /**
   * Updates the number of needed points in the view.
   * @param newNeededPoints New number of needed points.
   */
  updateNeededPoints(newNeededPoints: number): void {
    this.scoreDisplay.updateNeededPoints(newNeededPoints);
  }

  /**
   * Displays the hand the user is playing with.
   * @param hand Cards the user is playing with.
   */
  displayHand(hand: Card[]): void {
    this.handDisplay.displayHand(hand);
  }

  /**
   * Displays the hand of jokers the user is playing with.
   * @param hand Jokers the user is playing with.
   */
  displayInventory(jokers: Card[], consumables: Card[]): void {
    this.inventoryDisplay.displayJokers(jokers);
    this.inventoryDisplay.displayConsumables(consumables);
  }

  /**
   * Adds a listener to the select card event.
   * @param callback New listener.
   */
  addSelectCardListener(callback: (card: Card) => void): void {
    this.handDisplay.addSelectCardListener(callback);
  }

  /**
   * Adds a listener to the Play event.
   * @param callback New listener.
   */
  addPlayListener(callback: () => void): void {
    this.actionPanel.addPlayListener(callback);
  }

  /**
   * Adds a listener to the Discard event.
   * @param callback New listener.
   */
  addDiscardListener(callback: () => void): void {
    this.actionPanel.addDiscardListener(callback);
  }

  /**
   * Adds a listener to the Sort event.
   * @param callback New listener.
   */
  addSortListener(callback: (criteria: string) => void): void {
    this.actionPanel.addSortListener(callback);
  }

  /**
   * Sets the listeners to the DOM elements.
   */
  setListeners(): void {
    this.handDisplay.setListeners();
  }

  /**
   * Initializes the counters of remaining discards and hands.
   * @param totalHands Number of hands allowed.
   * @param totalDiscards Number of discards allowed.
   */
  initializeCounters(totalHands: number, totalDiscards: number): void {
    this.actionPanel.updateActionPanelInformation(totalHands, totalHands, totalDiscards, totalDiscards);
  }

  /**
   * Highlights a card in the hand.
   * @param card Card to be higlighted.
   */
  highlightCard(card: Card): void {
    this.handDisplay.highlightCard(card);
  }

  /**
   * Draws a border around a card showing it is selected.
   * @param card Card whose border will be printed.
   */
  removeHighlightFromCard(card: Card): void {
    this.handDisplay.removeHighlightFromCard(card);
  }

  /**
   * Removes all the highlights that have been displayed.
   */
  removeAllHighlights(): void {
    this.handDisplay.removeAllHighlights();
  }

  /**
   * Updates the text that prints number of cards that have been selected.
   * @param newNumberOfSelectedCards New number of selected cards. 
   */
  updateSelectedCards(newNumberOfSelectedCards: number): void {
    this.handDisplay.updateSelectedCardsMessage(newNumberOfSelectedCards);
  }

  /**
   * Updates the number of cards remaining in the deck.
   * @param newSize New size of the deck with the cards that haven't been played.
   */
  updateDeckSize(newSize: number): void {
    this.levelInformationDisplay.updateDeckSize(newSize);
  }

  /**
   * Enables the PLAY HAND button.
   */
  enablePlayButton(): void {
    this.actionPanel.enablePlayButton();
  }

  /**
   * Disables the PLAY HAND button.
   */
  disablePlayButton(): void {
    this.actionPanel.disablePlayButton();
  }

  /**
   * Enables the DISCARD button.
   */
  enableDiscardButton(): void {
    this.actionPanel.enableDiscardButton();
  }

  /**
   * Disables the DISCARD button.
   */
  disableDiscardButton(): void {
    this.actionPanel.disableDiscardButton();
  }

  /**
   * Updates the counters of the reamining hands and discards.
   * @param remainingPlays Number of hands that can be played until losing the game.
   * @param remainingDiscards Number of discards that can be done.
   */
  updateActionPanelInformation(remainingPlays: number, maxPlays: number, remainingDiscards: number, maxDiscards: number): void {
    this.actionPanel.updateActionPanelInformation(remainingPlays, maxPlays, remainingDiscards, maxDiscards);
  }

  /**
   * Updates the preview box with the score of the current selected cards.
   * @param scorePreview New score with the current selected cards.
   */
  updatePreview(scorePreview: HandScore): void {
    this.previewDisplay.updateScorePreview(scorePreview);
  }

  /**
   * Displays a victory message displaying a modal.
   * @param finalScore Total points the user got in the round.
   * @param totalScore Needed points to finish the level.
   */
  displayVictory(finalScore: number, totalScore: number): void { 
    this.resultDisplay.showGameOverModal(true, finalScore, totalScore);
  }

  /**
   * Displays a game over message displaying a modal.
   * @param finalScore Total points the user got in the round.
   * @param totalScore Needed points to finish the level.
   */
  displayGameOver(finalScore: number, totalScore: number): void {
    this.resultDisplay.showGameOverModal(false, finalScore, totalScore);
  }

  /**
   * Adds a listener to the restar event.
   * @param callback New listener.
   */
  addRestartListener(callback: () => void): void {
    this.resultDisplay.addRestartListener(callback);
  }

  /**
   * Returns the criteria followed to sort the cards.
   * @return Criteria followed to sort the cards.
   */
  getSortCriteria(): string {
    return this.actionPanel.getSortCriteria();
  }
}
