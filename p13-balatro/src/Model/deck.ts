/**
 * Universidad de La Laguna
 * Escuela Superior de Ingeniería y Tecnología
 * Grado en Ingeniería Informática
 * Programación de Aplicaciones Interactivas
 * @author Adrián Pérez Poleo
 * @since Apr 29, 2026
 * @desc Class that models a card in the Balatro game.
 */

import {Card, CardValue, Suit} from './card';

/**
 * Class that models a poker deck.
 */
export class Deck {
  /** Values the cards can have. */
  private readonly CARD_VALUES = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'jack', 'queen', 'king', 'ace'];
  /** Possible suits a card can belong to. */
  private readonly CARD_SUITS = ['Spades' , 'Hearts' , 'Diamonds' , 'Clubs'];
  /** Vector containing the cards in the deck. */
  private cards: Card[] = [];

  /**
   * Creates a new deck and initializes all its cards.
   */
  constructor() {
    this.initializeDeck();
    this.shuffle();
  }

  /**
   * Returns the current size of the deck.
   * @return Current size of the deck.
   */
  getSize(): number {
    return this.cards.length;
  }

  /**
   * Returns a random card from the deck.
   * @return Card that has been drawn.
   */
  drawACard(): Card {
    if (this.cards.length === 0) {
      return new Card('empty', 'None', 0);
    }
    return this.cards.pop()!;
  }

  /**
   * Shuffles the deck using the Fisher-Yates Sorting Algorithm
   * @see {@link https://www.freecodecamp.org/news/how-to-shuffle-an-array-of-items-using-javascript-or-typescript/}
   */
  shuffle(): void {
    for (let i = this.cards.length - 1; i > 0; --i) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.cards[i], this.cards[j]] = [this.cards[j], this.cards[i]];
    }
  }

  /**
   * Restarts the deck, adding all the cards it initially had.
   */
  restart(): void {
    this.cards = [];
    this.initializeDeck();
    this.shuffle();
  }

  /**
   * Creates all the cards that are in the deck.
   */
  private initializeDeck(): void {
    for (const value of this.CARD_VALUES) {
      for (const suit of this.CARD_SUITS) {
        let cardBasePoints;
        if (value === 'ace') {
          cardBasePoints = 11;
        } else {
          cardBasePoints = Math.min(this.CARD_VALUES.indexOf(value) + 2, 10);
        }        
        const newCard = new Card(value as CardValue, suit as Suit, cardBasePoints);
        this.cards.push(newCard);
      }
    }
  }
  
}