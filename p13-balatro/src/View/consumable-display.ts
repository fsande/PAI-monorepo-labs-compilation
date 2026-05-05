/**
 * Universidad de La Laguna
 * Escuela Superior de Ingeniería y Tecnología
 * Grado en Ingeniería Informática
 * Programación de Aplicaciones Interactivas
 * @author Adrián Pérez Poleo
 * @since May 04, 2026
 * @desc Class that knows how to display a hand of consumables.
 */

import {HandRenderer} from './hand-renderer';
import {Card} from '../Model/card';

export class ConsumableDisplay {
  /** Title of the section. */
  private readonly titleText: HTMLParagraphElement;
  /** Object that displays the hand of jokers. */
  private readonly consumableDisplayer: HandRenderer;

  /**
   * Creates a new Consumable Display.
   * @param containerId Id of the container where the hand will be displayed.
   * @param maxConsumables Maximum number of consumables.
   */
  constructor(container: HTMLDivElement, maxConsumables: number = 2) {   
    this.titleText = document.createElement('p');
    this.titleText.innerText = 'CONSUMABLES';
    this.titleText.style.marginBottom = '10px';
    container.appendChild(this.titleText);

    this.consumableDisplayer = new HandRenderer(container, maxConsumables);
  }

  /**
   * Displays the hand of consumables.
   * @param consumables Consumables the user has stored.
   */
  displayConsumables(consumables: Card[]): void {
    this.consumableDisplayer.displayHand(consumables);
  }
}