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
import {Event} from '../event';

export class HandRenderer {
  /** Vector containing the image DOM elements that will contain the cards. */
  private readonly cardImages: HTMLImageElement[] = [];
  /** Current cards the user has in the hand. */
  private currentCards: Card[] = [];
  /** Event triggered when the user clicks a card. */
  private readonly selectCardEvent = new Event<Card>;
  
  /**
   * Creates a new instance of a hand renderer.
   * @param container Container where the hand will be displayed.
   * @param maximumNumberOfCards Maximum number of cards to be displayed.
   */
  constructor(container: HTMLDivElement, private readonly maximumNumberOfCards: number) {
    const cardsDiv = document.createElement('div') as HTMLDivElement;
    cardsDiv.classList.add('columns', 'is-centered', 'is-multiline');
    container.appendChild(cardsDiv);

    this.createCardElements(cardsDiv);
  }

  /**
   * Displays the cards that are in the user hand.
   * @param hand Cards the user is playing with.
   */
  displayHand(hand: Card[]): void {
    this.currentCards = hand;  // We are storing the cards to avoid creating cards in the view

    for (let i = 0; i < this.cardImages.length; ++i) {
      const imgElement = this.cardImages[i];
      const card = hand[i];

      if (card && card.getValue() !== 'empty') {
        imgElement.src = this.getCardImageURL(card);
        imgElement.className = 'is-card';
      } else {
        imgElement.src = 'https://upload.wikimedia.org/wikipedia/commons/8/89/HD_transparent_picture.png?utm_source=commons.wikimedia.org&utm_campaign=index&utm_content=original';
        imgElement.className = 'is-empty-slot';
      }
    }
  }

  /**
   * Adds a listener to the click card event.
   * @param callback New listener.
   */
  addSelectCardListener(callback: (card: Card) => void): void {
    this.selectCardEvent.addListener(callback);
  }

  /**
   * Adds listeners to the DOM elements in the Hand renderer.
   */
  setListeners(): void {
    for (let i = 0; i < this.cardImages.length; ++i) {
      this.cardImages[i].addEventListener('click', () => {
        const card = this.currentCards[i];
        if (card && card.getValue() !== 'empty') {
          this.selectCardEvent.trigger(card);
        }
      });
    }
  }

  /**
   * Highlights the selected card.
   * @param card Card to be highlighted.
   */
  highlightCard(card: Card): void {
    const index = this.currentCards.indexOf(card);
    if (index !== -1) {
      this.cardImages[index].classList.add('is-clicked-card');
    }
  }

  /**
   * Removes the highlighting of a card.
   * @param card Card whose highlight will be removed.
   */
  removeHighlightFromCard(card: Card): void {
    const index = this.currentCards.indexOf(card);
    if (index !== -1) {
      this.cardImages[index].classList.remove('is-clicked-card');
    }
  }

  /**
   * Removes all the highlights that were displayed in the application.
   */
  removeAllHighlights(): void {
    for (const image of this.cardImages) {
      image.classList.remove('is-clicked-card');
    }        
  }
  
  /**
   * Obtains the link of the image used to display the card.
   * @param card Card to be displayed.
   * @return Link of the image to display.
   */
  private getCardImageURL(card: Card): string {
    if (card.getSuit() === 'None') return 'https://upload.wikimedia.org/wikipedia/commons/8/89/HD_transparent_picture.png?utm_source=commons.wikimedia.org&utm_campaign=index&utm_content=original';
    const imageName = `${card.getValue()}_of_${card.getSuit().toLowerCase()}.svg`;  
    return new URL(`/public/img/SVG-cards-1.3/${imageName}`, import.meta.url).href;
  }

  /**
   * Creates the cards in the interface.
   * @param container Container where the cards will be displayed.
   */
  private createCardElements(container: HTMLDivElement): void {
    for (let i = 0; i < this.maximumNumberOfCards; ++i) {
      const columnDiv = document.createElement('div') as HTMLDivElement;
      columnDiv.classList.add('column', 'is-narrow');

      const newCardImage = document.createElement('img') as HTMLImageElement;
      newCardImage.classList.add('is-card'); 
      
      columnDiv.appendChild(newCardImage);
      this.cardImages.push(newCardImage);
      container.appendChild(columnDiv);
    }
  }
}