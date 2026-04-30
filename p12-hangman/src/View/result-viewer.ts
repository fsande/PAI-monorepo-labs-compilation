/**
 * Universidad de La Laguna
 * Escuela Superior de Ingeniería y Tecnología
 * Grado en Ingeniería Informática
 * Programación de Aplicaciones Interactivas
 * @author Adrián Pérez Poleo
 * @since Apr 25, 2026
 * @desc Class that displays if the game was won or lost.
 */

export class ResultViewer {
  /** Paragraph element where the text will be added. */
  private readonly resultText: HTMLParagraphElement;

  constructor() {
    this.resultText = document.getElementById('result') as HTMLParagraphElement;
    
    this.resultText.classList.add('has-text-centered', 'is-size-3', 'has-text-weight-bold', 'mt-5');
  }

  /**
   * Displays a victory message on screen.
   */
  displayVictory(): void {
    this.clearStyles();
    this.resultText.innerText = 'YOU ARE WINNER!';
    this.resultText.classList.add('has-text-success');
  }

  /**
   * Displays a loss message on screen.
   */
  displayLoss(): void {
    this.clearStyles();
    this.resultText.innerText = 'YOU HAVE LOST';
    this.resultText.classList.add('has-text-danger');
  }

  /**
   * Removes the displayed messages.
   */
  clear(): void {
    this.resultText.innerText = '';
    this.clearStyles();
  }

  /**
   * Clears the Bulma styles given to the paragraph element.
   */
  private clearStyles(): void {
    this.resultText.classList.remove('has-text-success', 'has-text-danger');
  }
}