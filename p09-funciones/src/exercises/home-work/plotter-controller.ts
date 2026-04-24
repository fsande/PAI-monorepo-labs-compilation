/**
 * Universidad de La Laguna
 * Escuela Superior de Ingeniería y Tecnología
 * Grado en Ingeniería Informática
 * Programación de Aplicaciones Interactivas
 *
 * @author Daniel Martínez
 * @since Apr 07 2026
 * @description Controller class that handles the application logic, 
 * event listeners, and coordination between the input and the view.
 */

import { Viewport } from './model/viewport.ts';
import { View } from './view/view.ts';

/**
 * Global declaration for the mathjs library.
 */
declare const math: any;

/**
 * Orchestrates the function plotting application.
 */
export class PlotterController {
  private readonly viewport: Viewport;
  private readonly view: View;
  private readonly functionInput: HTMLInputElement;
  private readonly renderButton: HTMLButtonElement;

  /**
   * Initializes the controller and captures DOM elements.
   * @param plotCanvasId ID for the plotting canvas.
   * @param textCanvasId ID for the text canvas.
   * @param inputId ID for the text input.
   * @param buttonId ID for the render button.
   */
  constructor(
    plotCanvasId: string,
    textCanvasId: string,
    inputId: string,
    buttonId: string,
  ) {
    this.viewport = new Viewport(-10, 10, -10, 10);
    this.view = new View(plotCanvasId, textCanvasId, this.viewport);

    const inputElement = document.getElementById(inputId) as HTMLInputElement | null;
    const buttonElement = document.getElementById(buttonId) as HTMLButtonElement | null;

    if (!inputElement || !buttonElement) {
      throw new Error('Required DOM elements were not found.');
    }

    this.functionInput = inputElement;
    this.renderButton = buttonElement;
  }

  /**
   * Starts the application by setting up listeners and performing the initial render.
   */
  run(): void {
    this.renderButton.addEventListener('click', () => this.handleRendering());
    this.handleRendering();
  }

  /**
   * Processes the user input using mathjs and updates the view.
   * @desc Uses the mathjs expression parser as required in the original assignment.
   */
  private handleRendering(): void {
    const userExpression = this.functionInput.value;

    try {
      const compiledExpression = math.compile(userExpression);

      /**
       * Evaluation wrapper for the function renderer.
       * @param x Mathematical x coordinate.
       * @returns Evaluated y coordinate.
       */
      const mathFunction = (x: number): number => {
        return compiledExpression.evaluate({ x: x });
      };

      this.view.render(mathFunction, userExpression);
    } catch (error) {
      alert('Error en la expresión: ' + error);
    }
  }
}
