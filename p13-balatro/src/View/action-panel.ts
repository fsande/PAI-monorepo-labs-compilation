/**
 * Universidad de La Laguna
 * Escuela Superior de Ingeniería y Tecnología
 * Grado en Ingeniería Informática
 * Programación de Aplicaciones Interactivas
 * @author Adrián Pérez Poleo
 * @since May 1, 2026
 * @desc Class that listens to events in the action panel.
 */

import {Event} from '../event';

/**
 * Class that displays the button to play a round in the game.
 */
export class ActionPanel {
  /** Button that is clicked when the user wants to play with the selected cards. */
  private readonly playButton: HTMLButtonElement;
  /** Button used to discard the selected cards and receive new ones. */
  private readonly discardButton: HTMLButtonElement;
  /** Button clicked to sort the cards by value or by suit. */
  private readonly sortButton: HTMLButtonElement;
  /** Text containing the remaining hands the user can play. */
  private readonly remainingHandsText: HTMLParagraphElement;
  /** Text containing the remaining discards the user can do. */
  private readonly remainingDiscardsText: HTMLParagraphElement;
  /** Event triggered when the user wants to play with the selected cards. */
  private readonly playEvent = new Event<void>();
  /** Event triggered to discard the selected cards. */
  private readonly discardEvent = new Event<void>();
  /** Event triggered to sort the cards by value or by suit. */
  private readonly sortEvent = new Event<string>();
  /** Criteria followed to display the hand. */
  private sortCriteria: 'rank' |'suit' = 'rank';

  /**
   * Creates a new instance of an Action Panel
   */
  constructor(containerId: string) {
    const container = document.getElementById(containerId) as HTMLDivElement;
    if (!container) throw new Error(`No se encontró el contenedor ${containerId}`);
    container.innerHTML = '';

    const columnsDiv = document.createElement('div');
    columnsDiv.className = 'columns is-vcentered';
    container.appendChild(columnsDiv);

    this.playButton = this.createActionButton(columnsDiv, 'PLAY HAND', 'has-background-green', true);
    this.discardButton = this.createActionButton(columnsDiv, 'DISCARD', 'has-background-gray', true);
  
    this.remainingHandsText = this.createTextBox(columnsDiv, 'Hands: 3/3');
    this.remainingDiscardsText = this.createTextBox(columnsDiv, 'Discards: 3/3');

    this.createInformationButton(columnsDiv);
    this.sortButton = this.createActionButton(columnsDiv, 'SORT: RANK', 'has-background-blue', false);

    this.setListeners();
  }

  /**
   * Sets the listeners into the buttons of the panel.
   */
  setListeners() {
    this.playButton.addEventListener('click', () => {
      this.playEvent.trigger();
      this.playButton.disabled = true;
      this.discardButton.disabled = true;
    });

    this.discardButton.addEventListener('click', () => {
      this.discardButton.disabled = true;
      this.playButton.disabled = true;
      this.discardEvent.trigger();
    });

    this.sortButton.addEventListener('click', () => {
      if (this.sortCriteria === 'rank') {
        this.sortCriteria = 'suit';
        this.sortButton.innerText = 'SORT: SUIT';
      } else {
        this.sortCriteria = 'rank';
        this.sortButton.innerText = 'SORT: RANK';
      }
      this.sortEvent.trigger(this.sortCriteria);
    });
  }

  /**
   * Adds a listener to the play event.
   * @param callback New listener.
   */
  addPlayListener(callback: () => void) {
    this.playEvent.addListener(callback);
  }

  /**
   * Adds a listener to the discard event.
   * @param callback New listener.
   */
  addDiscardListener(callback: () => void) {
    this.discardEvent.addListener(callback);
  }

  /**
   * Adds a listener to the sort event.
   * @param callback New listener. 
   */
  addSortListener(callback: (criteria: string) => void) {
    this.sortEvent.addListener(callback);
  }

  /**
   * Enables the PLAY HAND button.
   */
  enablePlayButton(): void {
    this.playButton.disabled = false;
  }

  /**
   * Disables the PLAY HAND button.
   */
  disablePlayButton(): void {
    this.playButton.disabled = true;
  }

  /**
   * Enables the DISCARD button.
   */
  enableDiscardButton(): void {
    this.discardButton.disabled = false;
  }

  /**
   * Disables the DISCARD button.
   */
  disableDiscardButton(): void {
    this.discardButton.disabled = true;
  }

  /**
   * Updates the counters with the remaining number of plays and discards.
   * @param remainingPlays Number of hands that can still be played.
   * @param remainingDiscards Number of discards that can be done.
   */
  updateActionPanelInformation(remainingPlays: number, maxPlays: number, remainingDiscards: number, maxDiscards: number): void {
    this.remainingHandsText.innerText = `Hands: ${remainingPlays}/${maxPlays}`;
    this.remainingDiscardsText.innerText = `Discards: ${remainingDiscards}/${maxDiscards}`;
  }

  /**
   * Returns the criteria followed to sort the hand.
   * @return Criteria followed to sort the hand.
   */
  getSortCriteria(): string {
    return this.sortCriteria;
  }

  private createColumn(parent: HTMLElement): HTMLDivElement {
    const column = document.createElement('div');
    column.className = 'column';
    parent.appendChild(column);
    return column;
  }

  private createActionButton(parent: HTMLElement, text: string, colorClass: string, isDisabled: boolean): HTMLButtonElement {
    const column = this.createColumn(parent);
    const button = document.createElement('button');
    button.className = `button ${colorClass} has-text-white`;
    button.innerText = text;
    button.disabled = isDisabled;
    column.appendChild(button);
    return button;
  }

  private createTextBox(parent: HTMLElement, initialText: string): HTMLParagraphElement {
    const column = this.createColumn(parent);
    const box = document.createElement('div');
    box.className = 'box has-background-blue has-text-gray is-size-8 p-2 is-rounded has-text-centered';
    
    const textElement = document.createElement('p');
    textElement.className = 'is-size-7';
    textElement.innerText = initialText;
    
    box.appendChild(textElement);
    column.appendChild(box);
    
    return textElement; // Devolvemos el <p> para poder actualizar los números luego
  }

  /** Construye el botón de información estático */
  private createInformationButton(parent: HTMLElement): void {
    const column = this.createColumn(parent);
    const infoButton = document.createElement('button');
    infoButton.className = 'button has-background-purple has-text-white';
    infoButton.innerText = 'HAND INFO';
    column.appendChild(infoButton);
  }
}