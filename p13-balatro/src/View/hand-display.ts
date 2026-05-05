/**
 * Universidad de La Laguna
 * Escuela Superior de Ingeniería y Tecnología
 * Grado en Ingeniería Informática
 * Programación de Aplicaciones Interactivas
 * @author Adrián Pérez Poleo
 * @since Apr 29, 2026
 * @desc Class that knows how to display a hand of cards.
 */

import {Card} from '../Model/card';
import {HandRenderer} from './hand-renderer';

export class HandDisplay {
  /** Text displaying the number of selected cards. */
  private readonly selectedCardsUpperText: HTMLParagraphElement;
  /** Smaller text that shows the number of cards that have been selected. */
  private readonly selectedCardsLowerText: HTMLParagraphElement;
  /** Vector containing the image DOM elements that will contain the cards. */
  private readonly handRenderer: HandRenderer;
  
  /**
   * Creates a new instance of a Hand Renderer.
   */
  constructor(containerId: string, maxNumberOfCards: number) {
    const divParent = document.getElementById(containerId) as HTMLDivElement;

    this.selectedCardsUpperText = document.createElement('p') as HTMLParagraphElement;
    this.selectedCardsUpperText.innerText = 'CURRENT HAND (0 SELECTED):';
    this.selectedCardsUpperText.style.marginBottom = '15px';
    divParent.append(this.selectedCardsUpperText);

    this.selectedCardsLowerText = document.createElement('p') as HTMLParagraphElement;
    this.selectedCardsLowerText.innerText = 'Selected: 0/5';
    this.selectedCardsLowerText.style.marginBottom = '15px';
    divParent.append(this.selectedCardsLowerText);

    this.handRenderer = new HandRenderer(divParent, maxNumberOfCards);
  }

  /**
   * Displays the cards that are in the user hand.
   * @param hand Cards the user is playing with.
   */
  displayHand(hand: Card[]): void {
    this.handRenderer.displayHand(hand);
  }

  /**
   * Adds a listener to the click card event.
   * @param callback New listener.
   */
  addSelectCardListener(callback: (card: Card) => void): void {
    this.handRenderer.addSelectCardListener(callback);
  }

  /**
   * Adds listeners to the DOM elements in the Hand renderer.
   */
  setListeners(): void {
    this.handRenderer.setListeners();
  }

  /**
   * Highlights the selected card.
   * @param card Card to be highlighted.
   */
  highlightCard(card: Card): void {
    this.handRenderer.highlightCard(card);
  }

  /**
   * Removes the highlighting of a card.
   * @param card Card whose highlight will be removed.
   */
  removeHighlightFromCard(card: Card): void {
    this.handRenderer.removeHighlightFromCard(card);
  }

  /**
   * Removes all the highlights that were displayed in the application.
   */
  removeAllHighlights(): void {
    this.handRenderer.removeAllHighlights();     
  }
  
  /**
   * Updates the cards containing the number of selected cards.
   * @param newSelectedCards New number of selected cards.
   */
  updateSelectedCardsMessage(newSelectedCards: number): void {
    this.selectedCardsUpperText.innerText = `CURRENT HAND (${newSelectedCards} SELECTED):`;
    this.selectedCardsLowerText.innerText = `Selected: ${newSelectedCards}/5`;
  }
}