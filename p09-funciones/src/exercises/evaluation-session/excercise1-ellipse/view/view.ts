/**
 * Universidad de La Laguna
 * Escuela Superior de Ingeniería y Tecnología
 * ... (Cabecera completa omitida por brevedad, igual a las anteriores)
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
   * Renders the ellipse scene.
   */
  renderEllipse(semiAxisA: number, semiAxisB: number, centerX: number, centerY: number): void {
    this.clearCanvases();

    new GridRenderer(this.plotContext, this.viewport).draw();
    new AxesRenderer(this.plotContext, this.viewport).draw();
    
    const ellipse = new EllipseRenderer(this.plotContext, this.viewport);
    ellipse.draw(semiAxisA, semiAxisB, centerX, centerY, 'purple');

    this.drawTextInfo(semiAxisA, semiAxisB, centerX, centerY);
  }

  private drawTextInfo(semiAxisA: number, semiAxisB: number, centerX: number, centerY: number): void {
    this.textContext.font = '20px Arial';
    this.textContext.fillStyle = 'black';
    this.textContext.fillText(`Elipse: A=${semiAxisA}, B=${semiAxisB}, Centro=(${centerX}, ${centerY})`, 20, 40);
    this.textContext.fillText(`Ecuación: x = ${semiAxisA}cos(t) + ${centerX} | y = ${semiAxisB}sin(t) + ${centerY}`, 20, 70);
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