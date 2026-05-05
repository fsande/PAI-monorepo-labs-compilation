/**
 * Universidad de La Laguna
 * Escuela Superior de Ingeniería y Tecnología
 * Grado en Ingeniería Informática
 * Programación de Aplicaciones Interactivas
 * @author Adrián Pérez Poleo
 * @since Apr 29, 2026
 * @desc Class that knows how to display the preview of the score of a hand of cards.
 */

import {HandScore} from '../Model/score-calculator';

export class PreviewDisplay {
  /** Text field where the name of the han appears. */
  private readonly handNameText: HTMLParagraphElement;
  /** Text field with the calculation of the new score. */
  private readonly scoreOperationText: HTMLParagraphElement;

  constructor(containerId: string) {
    const previewDiv: HTMLDivElement = document.getElementById(containerId) as HTMLDivElement;
    this.handNameText = document.createElement('p') as HTMLParagraphElement;
    previewDiv.appendChild(this.handNameText);
    this.handNameText.classList.add('has-text-gray');
    this.handNameText.innerText = 'PREVIEW';

    this.scoreOperationText = document.createElement('p') as HTMLParagraphElement;
    this.scoreOperationText.classList.add('has-text-yellow');
    previewDiv.appendChild(this.scoreOperationText);
    this.scoreOperationText.innerText = '0 chips x 0 mul = 0 pts';
  }

  /**
   * Updates the score preview showing the points to receive if the user plays the selected hand.
   * @param score New score information to display.
   */
  updateScorePreview(score: HandScore): void {
    this.handNameText.innerText = score.handName.toUpperCase();
    this.scoreOperationText.innerText = `${score.chips} chips x ${score.multiplier} mult = ${score.totalScore} pts`;
  }
}