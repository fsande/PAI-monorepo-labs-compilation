/**
 * Universidad de La Laguna
 * Escuela Superior de Ingeniería y Tecnología
 * Grado en Ingeniería Informática
 * Programación de Aplicaciones Interactivas
 *
 * @author Daniel Martínez
 * @since Apr 07 2026
 * @description Controller that manages the animation loop for the planetary orbit.
 */

import { Viewport } from './model/viewport.js';
import { View } from './view/view.js';

export class PlotterController {
  private readonly viewport: Viewport;
  private readonly view: View;
  private currentAngle: number = 0;
  private isAnimating: boolean = false;

  constructor() {
    this.viewport = new Viewport(-15, 15, -15, 15);
    this.view = new View('plot-canvas', 'text-canvas', this.viewport);
  }

  /**
   * Starts the application and the animation loop.
   */
  run(): void {
    const renderButton = document.getElementById('render-button') as HTMLButtonElement;
    renderButton.addEventListener('click', () => {
      if (!this.isAnimating) {
        this.isAnimating = true;
        this.animate();
      }
    });

    // Inicio automático de la animación
    this.isAnimating = true;
    this.animate();
  }

  /**
   * Animation loop using requestAnimationFrame.
   * @desc Increments the angle to simulate orbital movement.
   */
  private animate(): void {
    this.handleRender();
    this.currentAngle += 0.02;
    
    // Mantenemos el ángulo en el rango [0, 2PI] para evitar desbordamientos
    if (this.currentAngle > Math.PI * 2) {
      this.currentAngle -= Math.PI * 2;
    }

    requestAnimationFrame(() => this.animate());
  }

  /**
   * Captures parameters and delegates the drawing to the view.
   */
  private handleRender(): void {
    const semiAxisA = Number((document.getElementById('param-a') as HTMLInputElement).value);
    const semiAxisB = Number((document.getElementById('param-b') as HTMLInputElement).value);
    const centerX = Number((document.getElementById('param-h') as HTMLInputElement).value);
    const centerY = Number((document.getElementById('param-k') as HTMLInputElement).value);

    this.view.renderEllipse(semiAxisA, semiAxisB, centerX, centerY, this.currentAngle);
  }
}