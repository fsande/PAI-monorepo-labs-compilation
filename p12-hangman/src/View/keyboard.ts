/**
 * Universidad de La Laguna
 * Escuela Superior de Ingeniería y Tecnología
 * Grado en Ingeniería Informática
 * Programación de Aplicaciones Interactivas
 * @author Adrián Pérez Poleo
 * @since Apr 25, 2026
 * @desc Program that displays a interactive keyboard on the screen.
 */

import {Event} from '../event';

export class Keyboard {
  /** List of buttons representing the keys of the keyboard. */
  private readonly keys: HTMLButtonElement[] = [];
  /** Button that restarts the game. */
  private readonly restartButton: HTMLButtonElement;
  /** Event that indicates a key has been clicked by the user. */
  private readonly clickedCharacterEvent = new Event<string>;
  /** Event that indicates the user wants to restart de game. */
  private readonly restartEvent = new Event<void>;

  constructor() {
    const div = document.getElementById('keyboard') as HTMLDivElement;
    
    this.restartButton = document.createElement('button') as HTMLButtonElement;
    this.restartButton.innerText = 'Restart';
    this.restartButton.classList.add('button', 'is-primary', 'is-medium', 'is-responsive', 'ml-4', 'mt-2');

    const alphabet = 'ABCDEFGHIJKLMNÑOPQRSTUVWXYZ';
    for (const character of alphabet) {
      if (character === 'L') {
        div.appendChild(this.restartButton);
        div.appendChild(document.createElement('br') as HTMLBRElement);
      }
      const newButton: HTMLButtonElement = document.createElement('button') as HTMLButtonElement;
      newButton.innerText = character;
      newButton.classList.add('button', 'is-medium', 'is-responsive', 'ml-2', 'mt-2');
      newButton.value = character;

      div.appendChild(newButton);
      this.keys.push(newButton);
    }
  }

  /**
   * Adds a listener to all the keys if the keyboard.
   */
  setListeners(): void {
    for (const button of this.keys) {
      button.disabled = false;
      button.addEventListener('click', this.activateButton);
    }

    this.restartButton.addEventListener('click', () => {
      this.restartEvent.trigger();
    });
  }

  /**
   * Removes listeners from all keys (Useful for restarting the game)
   */
  removeListeners(): void {
    for (const button of this.keys) {
      button.removeEventListener('click', this.activateButton);
    }
  }

  /**
   * Method that describes what to do when a button is clicked.
   * @param event Mouse event done by the user.
   */
  private activateButton = (event: MouseEvent) => {
    const button = event.currentTarget as HTMLButtonElement;
    this.clickedCharacterEvent.trigger(button.value);
    button.disabled = true;
  };

  /**
   * Adds a new listener to the clickedCharacter event.
   * @param callback New listener.
   */
  addClickedCharacterListener(callback: (character: string) => void): void {
    this.clickedCharacterEvent.addListener(callback);
  }

  /**
   * Adds a new listener to the restart event.
   * @param callback New listener.
   */
  addRestartListener(callback: () => void): void {
    this.restartEvent.addListener(callback);
  }
}
