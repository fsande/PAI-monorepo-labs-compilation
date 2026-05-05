/**
 * Universidad de La Laguna
 * Escuela Superior de Ingeniería y Tecnología
 * Grado en Ingeniería Informática
 * Programación de Aplicaciones Interactivas
 * @author Adrián Pérez Poleo
 * @since May 04, 2026
 * @desc Class that knows how to display the inventory.
 */

import {Card} from '../Model/card';
import {JokerDisplay} from './joker-display';
import {ConsumableDisplay} from './consumable-display';

export class InventoryDisplay {
  /** Element that displays the joker cards. */
  private readonly jokerDisplay: JokerDisplay;
  /** Element that displays the consumable cards. */
  private readonly consumableDisplay: ConsumableDisplay;

  /**
   * Creates a new Joker Display.
   * @param containerId Id of the container where the hand will be displayed.
   * @param maxConsumables Maximum number of consumables.
   */
  constructor(containerId: string, maxJokers: number = 5, maxConsumables: number = 2) {
    const container = document.getElementById(containerId) as HTMLDivElement;
    container.innerHTML = '';
    container.classList.add('columns');

    const jokerColumn = document.createElement('div') as HTMLDivElement;
    jokerColumn.className = 'column is-8';
    container.appendChild(jokerColumn);
    this.jokerDisplay = new JokerDisplay(jokerColumn, maxJokers);

    const consumableColumn = document.createElement('div') as HTMLDivElement;
    consumableColumn.className = 'column is-4';
    container.appendChild(consumableColumn);
    this.consumableDisplay = new ConsumableDisplay(consumableColumn, maxConsumables);    
  }

  /**
   * Displays the hand of jokers.
   * @param jokers Jokers the user has stored.
   */
  displayJokers(jokers: Card[]): void {
    this.jokerDisplay.displayJokers(jokers);
  }

  /**
   * Displays the hand of consumables.
   * @param consumables Consumables the user has stored.
   */
  displayConsumables(consumables: Card[]): void {
    this.consumableDisplay.displayConsumables(consumables);
  }
}