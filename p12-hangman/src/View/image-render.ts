/**
 * Universidad de La Laguna
 * Escuela Superior de Ingeniería y Tecnología
 * Grado en Ingeniería Informática
 * Programación de Aplicaciones Interactivas
 * @author Adrián Pérez Poleo
 * @since Apr 25, 2026
 * @desc Program that implements the Hangman Game using the MVC pattern.
 */

export class HangmanImageRender {
  /** Image of the hangman to be displayed. */
  private readonly hangmanImage: HTMLImageElement;

  constructor(elementId: string) {
    const div = document.getElementById(elementId) as HTMLDivElement;
    this.hangmanImage = document.createElement('img') as HTMLImageElement;
    div.appendChild(this.hangmanImage);

    this.hangmanImage.style.height = `${window.innerHeight * 0.58}px`;
    this.updateHangmanImage(0);
  }

  /**
   * Updates the current displayed image of the hangman given the number of errors 
   * the user has made.
   * @param mistakes Number of errors that the user has made.
   */
  updateHangmanImage(mistakes: number): void {
    this.hangmanImage.src = new URL(`./images/Hangman-${mistakes}.png`, import.meta.url).href;
  }
}