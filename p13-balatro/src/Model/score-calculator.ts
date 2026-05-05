/**
 * Universidad de La Laguna
 * Escuela Superior de Ingeniería y Tecnología
 * Grado en Ingeniería Informática
 * Programación de Aplicaciones Interactivas
 * @author Adrián Pérez Poleo
 * @since Apr 29, 2026
 * @desc Class that calculates the score of a given hand.
 */

import {Card, CardValue} from './card';
import {BalatroRules, HandName} from './balatro-rules';

/** 
 * Interface that defines how a hand score can be given.
 */
export interface HandScore {
  handName: string,
  chips: number,
  multiplier: number,
  totalScore: number  
}

/**
 * Class that computes the score obtained with a given hand.
 */
export class ScoreCalculator {
  /** Record containing each card value and its number of appearances. */
  private counts: Record<string, number> = {};
  /** Record containing the base points of each possible value. */
  private points: Record<string, number> = {};
  /** Record containing each card suit and its number of appearances. */
  private suitCounts: Record<string, number> = {};

  /**
   * Evaluates the score obtained with a hand.
   * @param hand Hand to be evaluated.
   * @return Score that would be obtained and the name of the hand.
   */
  evaluate(hand: Card[]): HandScore {
    this.resetPreviousCounts();
    this.calculateFrequencies(hand);
    return this.evaluateStraightFlush() ??
           this.evaluateFourOfAKind() ??
           this.evaluateFullHouse() ??
           this.evaluateFlush() ??
           this.evaluateStraight() ??
           this.evaluateThreeOfAKind() ??
           this.evaluateTwoPair() ??
           this.evaluatePair() ?? 
           this.evaluateHighCard(); 
  }

  /** 
   * Removes the counts done in the previous iteration of the game. 
   */
  private resetPreviousCounts(): void {
    this.counts = {};
    this.points = {};
    this.suitCounts = {};
  }

  /**
   * Counts the number of appearances of each value and each suit in the hand.
   * @param hand Hand whose cards will be counted.
   */
  private calculateFrequencies(hand: Card[]): void {
    for (const card of hand) {
      if (card.getValue() === 'empty') continue;
      
      const value = card.getValue();
      const suit = card.getSuit();
      this.counts[value] = (this.counts[value] || 0) + 1;
      this.points[value] = card.getBasePoints();
      this.suitCounts[suit] = (this.suitCounts[suit] || 0) + 1;
    }
  }

  /**
   * Evaluates if a Straight Flush exists in the hand of the user.
   * @return Score obtained with the straight flush if it exists or null. 
   */
  private evaluateStraightFlush(): HandScore | null {
    const isStraight = this.evaluateStraight();
    const isFlush = this.evaluateFlush();

    if (isStraight !== null && isFlush !== null) {
      const pureCardsChips = isStraight.chips - BalatroRules.HAND_BASE_SCORES['Straight'].baseChips;
      return this.buildHandScore('Straight Flush', pureCardsChips);
    }
    return null;
  }

  /**
   * Evaluates if a Four of a Kind exists in the hand of the user.
   * @return Score obtained with the four of a kind if it exists or null. 
   */
  private evaluateFourOfAKind(): HandScore | null {
    for (const value of BalatroRules.VALUE_ORDER) {
      if (this.counts[value] === 4) {
        return this.buildHandScore('Four of a kind', this.points[value] * 4);
      }
    }
    return null;
  }

  /**
   * Evaluates if a Full House exists in the hand of the user.
   * @return Score obtained with the full house if it exists or null. 
   */
  private evaluateFullHouse(): HandScore | null {
    const repeatedValues: [CardValue | null, CardValue | null] = [null, null];
    for (const value of BalatroRules.VALUE_ORDER) {
      if (this.counts[value] === 3) repeatedValues[0] = value;
      if (this.counts[value] === 2) repeatedValues[1] = value;
    }
    if (!repeatedValues.includes(null)) {
      const chips = this.points[repeatedValues[0]!] * 3 + this.points[repeatedValues[1]!] * 2;
      return this.buildHandScore('Full House', chips);
    }
    return null;
  }

  /**
   * Evaluates if a Flush exists in the hand of the user.
   * @return Score obtained with the flush if it exists or null. 
   */
  private evaluateFlush(): HandScore |null {
    for (const suit of BalatroRules.SUIT_ORDER) {
      if (this.suitCounts[suit] === 5) {
        let chips = 0;
        for (const value in this.counts) {
          chips += this.points[value] * this.counts[value];
        }
        return this.buildHandScore('Flush', chips);
      }
    }
    return null;
  }

  /**
   * Evaluates if a Straight exists in the hand of the user.
   * @return Score obtained with the straight if it exists or null. 
   */
  private evaluateStraight(): HandScore | null {
    const orderWithLowAce = ['ace', ...BalatroRules.VALUE_ORDER];
    const reversedOrder = orderWithLowAce.reverse();
    let consecutiveCount = 0;
    let chipsSum = 0;

    for (const value of reversedOrder) {
      if (this.counts[value] >= 1) {
        ++consecutiveCount;
        chipsSum += this.points[value];
        if (consecutiveCount === 5) {
          return this.buildHandScore('Straight', chipsSum);
        }
      } else {
        consecutiveCount = 0;
        chipsSum = 0;
      }
    }
    return null;
  }

  /**
   * Evaluates if a Three of a Kind exists in the hand of the user.
   * @return Score obtained with the three of a kind if it exists or null. 
   */
  private evaluateThreeOfAKind(): HandScore | null {
    for (const value of BalatroRules.VALUE_ORDER) {
      if (this.counts[value] === 3) {
        const chips = this.points[value] * 3;
        return this.buildHandScore('Three of a kind', chips);
      }
    }
    return null;
  }

  /**
   * Evaluates if a Two Pair exists in the hand of the user.
   * @return Score obtained with the two pairs if they exist or null. 
   */
  private evaluateTwoPair(): HandScore | null {
    const repeatedValues: CardValue[] = [];
    for (const value of BalatroRules.VALUE_ORDER) {
      if (this.counts[value] === 2) {
        repeatedValues.push(value);
      }
    }
    if (repeatedValues.length === 2) {
      const chips = this.points[repeatedValues[0]] * 2 + this.points[repeatedValues[1]] * 2;
      return this.buildHandScore('Two Pair', chips);
    }
    return null;
  }

  /**
   * Evaluates if a Pair exists in the hand of the user.
   * @return Score obtained with the pair if it exists or null. 
   */
  private evaluatePair(): HandScore | null {
    const reversedOrder = [...BalatroRules.VALUE_ORDER].reverse();
    for (const value of reversedOrder) {
      if (this.counts[value] >= 2) {
        const chips = (this.points[value] * 2);
        return this.buildHandScore('Pair', chips);
      }
    }
    return null;
  }

  /**
   * Evaluates the Highest Card in the hand.
   * @return Score obtained with the highest card.
   */
  private evaluateHighCard(): HandScore {
    const reversedOrder = [...BalatroRules.VALUE_ORDER].reverse();
    for (const value of reversedOrder) {
      if (this.counts[value] >= 1) {
        const chips = this.points[value];
        return this.buildHandScore('High Card', chips);
      }
    }
    return this.buildHandScore('High Card', 0);
  }

  /**
   * Creates a hand score by looking in the rules the addition and multiplier of each hand.
   * @param handName Name of the played hand.
   * @param cardsChips Number of chips the sum of the cards has.
   * @return Hand score of the played hand. 
   */
  private buildHandScore(handName: HandName, cardsChips: number): HandScore {
    const baseScore = BalatroRules.HAND_BASE_SCORES[handName];
    const totalChips = cardsChips + baseScore.baseChips;
    return {
      handName: handName,
      chips: totalChips,
      multiplier: baseScore.multiplier,
      totalScore: totalChips * baseScore.multiplier
    };
  }
}