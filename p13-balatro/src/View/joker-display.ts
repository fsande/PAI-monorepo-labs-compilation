/**
 * Universidad de La Laguna
 * Escuela Superior de Ingeniería y Tecnología
 * Grado en Ingeniería Informática
 * Programación de Aplicaciones Interactivas
 * @author Adrián Pérez Poleo
 * @since Apr 29, 2026
 * @desc Class that knows how to display a hand of jokers.
 */

import {HandRenderer} from './hand-renderer';
import {Card} from '../Model/card';

export class JokerDisplay {
  /** Title of the section. */
  private readonly titleText: HTMLParagraphElement;
  /** Object that displays the hand of jokers. */
  private readonly jokerDisplayer: HandRenderer;

  /**
   * Creates a new Joker Display.
   * @param containerId Id of the container where the hand will be displayed.
   * @param maxJokers Maximum number of jokers.
   */
  constructor(container: HTMLDivElement, maxJokers: number = 5) {
    this.titleText = document.createElement('p');
    this.titleText.innerText = 'JOKERS';
    this.titleText.style.marginBottom = '10px';
    container.appendChild(this.titleText);

    this.jokerDisplayer = new HandRenderer(container, maxJokers);
  }

  /**
   * Displays the hand of jokers.
   * @param jokers Jokers the user has stored.
   */
  displayJokers(jokers: Card[]): void {
    this.jokerDisplayer.displayHand(jokers);
  }
}