/**
 * Universidad de La Laguna
 * Escuela Superior de Ingeniería y Tecnología
 * Grado en Ingeniería Informática
 * Programación de Aplicaciones Interactivas
 *
 * @author Daniel Martínez
 * @since Apr 07 2026
 * @description View class that renders each frame of the planetary animation.
 */

import { Viewport } from '../model/viewport.js';
import { AxesRenderer } from './axes-renderer.js';
import { GridRenderer } from './grid-renderer.js';
import { EllipseRenderer } from './ellipse-renderer.js';

export class View {
  private readonly plotContext: CanvasRenderingContext2D;
  private readonly textContext: CanvasRenderingContext2D;

  constructor(
    private readonly plotCanvasId: string,
    private readonly textCanvasId: string,
    private readonly viewport: Viewport,
  ) {
    this.plotContext = this.initializeContext(this.plotCanvasId);
    this.textContext = this.initializeContext(this.textCanvasId);
  }

  /**
   * Renders a single frame of the animation.
   * @param semiAxisA Semi-axis A of the ellipse.
   * @param semiAxisB Semi-axis B of the ellipse.
   * @param centerX Horizontal center coordinate (h).
   * @param centerY Vertical center coordinate (k).
   * @param angle Current orbital position in radians.
   */
  renderEllipse(semiAxisA: number, semiAxisB: number, centerX: number, centerY: number, angle: number): void {
    this.clearCanvases();

    // Dibujamos el escenario estático
    new GridRenderer(this.plotContext, this.viewport).draw();
    new AxesRenderer(this.plotContext, this.viewport).draw();
    
    const ellipseRenderer = new EllipseRenderer(this.plotContext, this.viewport);
    
    // Dibujamos la órbita (púrpura) y el planeta (rojo)
    ellipseRenderer.draw(semiAxisA, semiAxisB, centerX, centerY, 'purple');
    ellipseRenderer.drawPlanet(semiAxisA, semiAxisB, centerX, centerY, angle);

    this.drawTextInfo(semiAxisA, semiAxisB, centerX, centerY, angle);
  }

  /**
   * Updates the textual information with the current orbital data.
   */
  private drawTextInfo(semiAxisA: number, semiAxisB: number, centerX: number, centerY: number, angle: number): void {
    this.textContext.font = '20px Arial';
    this.textContext.fillStyle = 'black';
    this.textContext.fillText(`Sistema Orbital: A=${semiAxisA}, B=${semiAxisB}, Centro=(${centerX}, ${centerY})`, 20, 40);
    this.textContext.fillStyle = 'blue';
    this.textContext.fillText(`Posición angular actual: ${angle.toFixed(2)} rad`, 20, 70);
  }

  private initializeContext(id: string): CanvasRenderingContext2D {
    const canvas = document.getElementById(id) as HTMLCanvasElement;
    return canvas.getContext('2d')!;
  }

  private clearCanvases(): void {
    this.plotContext.clearRect(0, 0, this.plotContext.canvas.width, this.plotContext.canvas.height);
    this.textContext.clearRect(0, 0, this.textContext.canvas.width, this.textContext.canvas.height);
  }
}