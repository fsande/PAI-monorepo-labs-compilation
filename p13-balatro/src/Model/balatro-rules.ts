/**
 * Universidad de La Laguna
 * Escuela Superior de Ingeniería y Tecnología
 * Grado en Ingeniería Informática
 * Programación de Aplicaciones Interactivas
 * @author Adrián Pérez Poleo
 * @since May 04, 2026
 * @desc Module containing the rules of the Balatro game.
 */

import type {CardValue} from './card';
import type {Suit} from './card';

/** Names a hand in the Balatro can have. */
export type HandName = 
  | 'Straight Flush' 
  | 'Four of a kind' 
  | 'Full House' 
  | 'Flush' 
  | 'Straight' 
  | 'Three of a kind' 
  | 'Two Pair' 
  | 'Pair' 
  | 'High Card';

/** Interface that defines how a base socre can be given. */
export interface BaseScore {
  baseChips: number;
  multiplier: number;
}

/**
 * Class that contains the rules of the Balatro game.
 */
export class BalatroRules {
  /** 
   * The class acts as a namespace, so it can't be instantiated.
   */
  private constructor() {}

  /** Vector containing the priority of the value of each card. */
  static readonly VALUE_ORDER: CardValue[] = [
    'empty', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'jack', 'queen', 'king', 'ace'
  ];

  /** Vector containing the priority of the suit of each card. */
  static readonly SUIT_ORDER: Suit[] = ['None', 'Diamonds', 'Clubs', 'Hearts', 'Spades'];

  /** Dictionary containing the base scores and multipliers for each hand. */
  static readonly HAND_BASE_SCORES: Record<HandName, BaseScore> = {
    'Straight Flush':  {baseChips: 100, multiplier: 8},
    'Four of a kind':  {baseChips: 60,  multiplier: 7},
    'Full House':      {baseChips: 40,  multiplier: 4},
    'Flush':           {baseChips: 35,  multiplier: 4},
    'Straight':        {baseChips: 30,  multiplier: 4},
    'Three of a kind': {baseChips: 30,  multiplier: 3},
    'Two Pair':        {baseChips: 20,  multiplier: 2},
    'Pair':            {baseChips: 10,  multiplier: 2},
    'High Card':       {baseChips: 5,   multiplier: 1},
  };
}
