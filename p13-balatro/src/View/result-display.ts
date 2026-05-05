/**
 * Universidad de La Laguna
 * Escuela Superior de Ingeniería y Tecnología
 * Grado en Ingeniería Informática
 * Programación de Aplicaciones Interactivas
 * @author Adrián Pérez Poleo
 * @since May 02, 2026
 * @desc Class that displays the result of the game.
 */

import {Event} from '../event';

export class ResultDisplay {
  /** Div Element where the modal with the result will be placed. */
  private modalContainer: HTMLDivElement;
  /** Text containing the result of the game. */
  private resultTitleText: HTMLHeadingElement;
  /** Text containing the score the user got during the game. */
  private scoreText: HTMLParagraphElement;
  /** Button that allows restarting the game. */
  private buttonRestart: HTMLButtonElement;
  /** Event that allows restarting the game. */
  private readonly restartEvent = new Event<void>();

  /**
   * Creates a new instance of a Result Display.
   */
  constructor() {
    this.modalContainer = document.createElement('div');
    this.resultTitleText = document.createElement('h2');
    this.scoreText = document.createElement('p');
    this.buttonRestart = document.createElement('button');
    this.buildModal();
    this.setListeners();
  }

  /**
   * Muestra el modal con el resultado final de la partida.
   * @param isVictory true si el jugador ganó, false si perdió
   * @param finalScore Puntuación total conseguida
   * @param targetScore Puntuación objetivo a la que había que llegar
   */
  showGameOverModal(isVictory: boolean, finalScore: number, targetScore: number): void {
    if (isVictory) {
      this.resultTitleText.textContent = 'VICTORY';
      this.resultTitleText.className = 'title is-2 has-text-success';
    } else {
      this.resultTitleText.textContent = 'GAME OVER';
      this.resultTitleText.className = 'title is-2 has-text-danger';
    }
    this.scoreText.textContent = `Score: ${finalScore} / ${targetScore}`;
    this.modalContainer.classList.add('is-active');
  }

  /**
   * Hides the modal after the user selects restart.
   */
  hideModal(): void {
    this.modalContainer.classList.remove('is-active');
  }

  /**
   * ADds a listener to the Restart event.
   * @param callback New listener.
   */
  addRestartListener(callback: () => void): void {
    this.restartEvent.addListener(callback);
  }

  /**
   * Creates a modal
   */
  private buildModal(): void {
    this.modalContainer.className = 'modal';

    const background = document.createElement('div');
    background.className = 'modal-background';
    this.modalContainer.appendChild(background);

    const card = document.createElement('div');
    card.className = 'modal-card';
    this.modalContainer.appendChild(card);

    const header = document.createElement('header');
    header.className = 'modal-card-head';
    header.classList.add('has-text-centered', 'has-background-ull-purple');
    
    const title = document.createElement('p');
    title.className = 'modal-card-title';
    title.classList.add('has-text-white');
    title.textContent = 'GAME RESULT';
    header.appendChild(title);
    card.appendChild(header);

    const body = document.createElement('section');
    body.className = 'modal-card-body has-text-centered';
    this.resultTitleText.className = 'title is-2';
    this.scoreText.className = 'subtitle is-4 mt-4';
    body.appendChild(this.resultTitleText);
    body.appendChild(this.scoreText);
    card.appendChild(body);

    const footer = document.createElement('footer');
    footer.className = 'modal-card-foot';
    footer.style.justifyContent = 'center';

    this.buttonRestart.className = 'button is-primary is-large';
    this.buttonRestart.textContent = 'RESTART';
    footer.appendChild(this.buttonRestart);
    card.appendChild(footer);
    document.body.appendChild(this.modalContainer);
  }

  /**
   * Sets the listener to the Restart button.
   */
  private setListeners(): void {
    this.buttonRestart.addEventListener('click', () => {
      this.hideModal();
      this.restartEvent.trigger();
    });
  }
}