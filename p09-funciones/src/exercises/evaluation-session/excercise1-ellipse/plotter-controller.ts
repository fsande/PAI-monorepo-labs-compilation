/**
 * Universidad de La Laguna
 * Escuela Superior de Ingeniería y Tecnología
 * ... (Cabecera completa)
 */

import { Viewport } from './model/viewport.js';
import { View } from './view/view.js';

export class PlotterController {
  private readonly viewport: Viewport;
  private readonly view: View;

  constructor() {
    this.viewport = new Viewport(-15, 15, -15, 15);
    this.view = new View('plot-canvas', 'text-canvas', this.viewport);
  }

  run(): void {
    const button = document.getElementById('render-button') as HTMLButtonElement;
    button.addEventListener('click', () => this.handleRender());
    this.handleRender();
  }

  private handleRender(): void {
    const semiAxisA = Number((document.getElementById('param-a')! as HTMLInputElement).value);
    const semiAxisB = Number((document.getElementById('param-b')! as HTMLInputElement).value);
    const centerX = Number((document.getElementById('param-h')! as HTMLInputElement).value);
    const centerY = Number((document.getElementById('param-k')! as HTMLInputElement).value);

    this.view.renderEllipse(semiAxisA, semiAxisB, centerX, centerY);
  }
}