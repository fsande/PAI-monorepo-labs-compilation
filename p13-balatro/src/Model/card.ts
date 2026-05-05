/**
 * Universidad de La Laguna
 * Escuela Superior de Ingeniería y Tecnología
 * Grado en Ingeniería Informática
 * Programación de Aplicaciones Interactivas
 * @author Adrián Pérez Poleo
 * @since Apr 29, 2026
 * @desc Class that models a card in the Balatro game.
 */

/**Type representing the values a card can have. */
export type CardValue = 'ace' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | 'jack' | 'queen' | 'king' |'empty';

/** Type that contains the possible suits a card can belong to. */
export type Suit = 'Spades' | 'Hearts' | 'Diamonds' | 'Clubs' | 'None';

/**
 * Class that models a poker card.
 */
export class Card {
  /**
   * Creates a new instance of the class.
   * @param value Value of the card.
   * @param suit Suit to which the card belongs.
   * @param basePoints Optional parameters used if a card represents an amount of points.
   */
  constructor(private readonly value: CardValue,
              private readonly suit: Suit,
              private readonly basePoints: number) { }

  /**
   * Returns the value of the card.
   * @return Value of the card. 
   */
  getValue(): CardValue {
    return this.value;
  }

  /**
   * Returns the suit of the card.
   * @return Suit of the card. 
   */
  getSuit(): Suit {
    return this.suit;
  }

  /**
   * Returns the base points of a card.
   * @return Base points of a card.
   */
  getBasePoints(): number {
    return this.basePoints;
  }
}