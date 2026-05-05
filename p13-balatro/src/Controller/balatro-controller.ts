/**
 * Universidad de La Laguna
 * Escuela Superior de Ingeniería y Tecnología
 * Grado en Ingeniería Informática
 * Programación de Aplicaciones Interactivas
 * @author Adrián Pérez Poleo
 * @since Apr 29, 2026
 * @desc Class that models the controller of the Balatro application.
 */

import {BalatroModel} from '../Model/balatro-model';
import {Card} from '../Model/card';
import {BalatroView} from '../View/balatro-view';

/**
 * Class that models a Balatro controller.
 */
export class BalatroController {
  /**
   * Creates a new instance of the controller.
   * @param model Model of the application that contains the state of the game.
   * @param view Interface of the Balatro game.
   */
  constructor(private readonly model: BalatroModel,
              private readonly view: BalatroView) { 
    this.view.setNeededPoints(this.model.getTotalNeededPoints());
    this.view.initializeCounters(this.model.getTotalAllowedHands(), this.model.getTotalAllowedDiscards());
    this.view.displayHand(this.model.getHandSortedByValue());
    this.view.displayInventory([], []);

    this.addListeners();
  }

  /**
   * Adds listeners to the view and model events.
   */
  private addListeners(): void {
    this.view.addSelectCardListener((card) => this.handleSelectCard(card));
    this.view.addPlayListener(() => this.handlePlayEvent());
    this.view.addDiscardListener(() => this.handleDiscardEvent());
    this.view.addSortListener((criteria) => this.handleSortEvent(criteria));
    this.model.addVictoryListener(() => this.handleVictory());
    this.model.addGameOverListener(() => this.handleGameOver());

    this.view.addRestartListener(() => this.handleRestart());
  }

  /**
   * Handles the Select Card event.
   * @param card Card that has been clicked.
   */
  private handleSelectCard(card: Card): void {
    if (this.model.selectCard(card)) {
      this.view.highlightCard(card);
      this.view.updateSelectedCards(this.model.getNumberOfSelectedCards());
    } else {
      this.view.removeHighlightFromCard(card);
      this.model.unselectCard(card);
      this.view.updateSelectedCards(this.model.getNumberOfSelectedCards());
    }
    if (this.model.getNumberOfSelectedCards() > 0) {
      this.view.enablePlayButton();
      if (this.model.getRemainingDiscards() > 0) {
        this.view.enableDiscardButton();
      }
    } else {
      this.view.disablePlayButton();
      this.view.disableDiscardButton();
    }
    this.view.updatePreview(this.model.evaluateHand());
  }

  /**
   * Handles the Play event.
   */
  private handlePlayEvent(): void {
    this.model.playHand();

    this.view.updateNeededPoints(this.model.getCurrentNeededPoints());
    this.view.updateSelectedCards(this.model.getNumberOfSelectedCards());

    this.view.removeAllHighlights();
    this.displayHand();
    this.view.updateDeckSize(this.model.getDeckSize());
    this.view.updateActionPanelInformation(this.model.getRemainingHands(), this.model.getTotalAllowedHands(), 
        this.model.getRemainingDiscards(), this.model.getTotalAllowedDiscards());
  }

  /**
   * Handles the Discard Event.
   */
  private handleDiscardEvent(): void {
    this.view.removeAllHighlights();
    this.model.discardSelectedCards();
    this.displayHand();
    this.view.updateDeckSize(this.model.getDeckSize());

    this.view.updateActionPanelInformation(this.model.getRemainingHands(), this.model.getTotalAllowedHands(), 
        this.model.getRemainingDiscards(), this.model.getTotalAllowedDiscards());
  } 

  /**
   * Handles the Sort event.
   * @param criteria Criteria used to sort the hand (by value or by suit).
   */
  private handleSortEvent(criteria: string): void {
    if (criteria === 'rank') {
      this.view.displayHand(this.model.getHandSortedByValue());
    } else {
      this.view.displayHand(this.model.getHandSortedBySuit());
    }
  }

  /**
   * Handles the Victory Event.
   */
  private handleVictory(): void {
    const currentScore = this.model.getCurrentPoints();
    this.view.displayVictory(currentScore, this.model.getTotalNeededPoints());
  }

  /**
   * Handles the Game Over event.
   */
  private handleGameOver(): void { 
    const currentScore = this.model.getCurrentPoints();
    this.view.displayGameOver(currentScore, this.model.getTotalNeededPoints());
  }

  /**
   * Handles the Restart Event.
   */
  private handleRestart(): void {
    this.model.restart();
    this.view.removeAllHighlights();
    this.displayHand();

    this.view.updateDeckSize(this.model.getDeckSize());
    this.view.updateActionPanelInformation(this.model.getRemainingHands(), this.model.getTotalAllowedHands(), 
        this.model.getRemainingDiscards(), this.model.getTotalAllowedDiscards());
    this.view.updateNeededPoints(this.model.getCurrentNeededPoints());
    this.view.updateSelectedCards(0);
    
    this.view.updatePreview({handName: 'PREVIEW', chips: 0, multiplier: 0, totalScore: 0});
  }

  /**
   * Displays the hand using the sort criteria stored in the view.
   */
  private displayHand(): void {
    const criteria = this.view.getSortCriteria();
    if (criteria === 'rank') {
      this.view.displayHand(this.model.getHandSortedByValue());
    } else {
      this.view.displayHand(this.model.getHandSortedBySuit());
    }
  }
}