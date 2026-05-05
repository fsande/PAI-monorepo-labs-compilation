/**
 * Universidad de La Laguna
 * Escuela Superior de Ingeniería y Tecnología
 * Grado en Ingeniería Informática
 * Programación de Aplicaciones Interactivas
 * @author Adrián Pérez Poleo
 * @since May 04, 2026
 * @desc Class that models the player information of the Balatro game.
 */

import {Card} from './card';
import {Deck} from './deck';

export class PlayerState {
  /** Deck initially containing the 52 available cards. */
  private deck: Deck = new Deck();
  /** Cards the user is playing with. */
  private hand: Card[] = [];
  /** Cards the user has selected but hasn't played with or discarded. */
  private selectedCards: Card[] = [];

  /**
   * Creates a new isntance of a PlayerState class. 
   * @param maximumHandSize Number of cards the user initially has.
   */
  constructor(private readonly maximumHandSize: number) {
    this.deck = new Deck();
    this.refillHand();
  }

  /**
   * Returns the cards the user is playing with.
   * @return Cards that are in the user's hand. 
   */
  getHand(): Card[] {
    return this.hand;
  }

  /**
   * Returns the cards the user has selected..
   * @return Vector containing the selected cards. 
   */
  getSelectedCards(): Card[] {
    return this.selectedCards;
  }

  /**
   * Returns the amount of cards in the deck that haven't been picked.
   * @return Amount of cards that haven't been played. 
   */
  getDeckSize(): number {
    return this.deck.getSize();
  }

  /**
   * Selects a card and stores it.
   * @param card Card to be selected.
   * @return True if the card could be selected. False otherwise.
   */
  selectCard(card: Card): boolean {
    if (!this.selectedCards.includes(card)) {
      this.selectedCards.push(card);
      return true;
    } 
    return false;
  }

  /**
   * Removes the card from the vector of selected cards.
   * @param card Card to be removed from the vector.
   */
  unselectCard(card: Card): void {
    this.selectedCards = this.selectedCards.filter(selected => selected !== card);
  }

  /**
   * Discards the selected cards from the current hand and chooses new ones from the deck.
   */
  discardSelectedCardsAndRefill(): void {
    for (const card of this.selectedCards) {
      this.hand = this.hand.filter(selected => selected !== card);
    }
    this.selectedCards = [];
    this.refillHand();
  }

  /**
   * Picks cards from the deck and stores them into the current hand.
   */
  private refillHand(): void {
    const cardsNeeded = this.maximumHandSize - this.hand.length;
    for (let i = 0; i < cardsNeeded; ++i) {
      this.hand.push(this.deck.drawACard());
    }
  }

  /**
   * Restarts the game by returning all the elements to their initial state.
   */
  restart(): void {
    this.deck.restart();
    this.hand = [];
    this.selectedCards = [];
    this.refillHand();
  }

}