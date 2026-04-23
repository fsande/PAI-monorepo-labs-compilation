/**
 * Universidad de La Laguna
 * Escuela Superior de Ingeniería y Tecnología
 * Grado en Ingeniería Informática
 * Programación de Aplicaciones Interactivas
 *
 * @author Daniel Martínez
 * @since Apr 07 2026
 * @description Class responsible for drawing an ellipse using parametric equations.
 */

import { Viewport } from '../model/viewport.js';

export class EllipseRenderer {
  /**
   * Initializes the ellipse renderer.
   * @param context Canvas context.
   * @param viewport Mathematical viewport.
   */
  constructor(
    private readonly context: CanvasRenderingContext2D,
    private readonly viewport: Viewport,
  ) {}

  /**
   * Draws the ellipse based on parametric equations: x = A*cos(t) + h, y = B*sin(t) + k.
   * @param semiAxisA Semi-axis A.
   * @param semiAxisB Semi-axis B.
   * @param centerX Center h.
   * @param centerY Center k.
   * @param color Color name for the line.
   */
  draw(semiAxisA: number, semiAxisB: number, centerX: number, centerY: number, color: string): void {
    this.context.save();
    this.context.strokeStyle = color;
    this.context.lineWidth = 3;
    this.context.beginPath();

    const segments = 200; 
    for (let i = 0; i <= segments; i++) {
      const parameterT = (i / segments) * 2 * Math.PI;
      
      // Ecuaciones paramétricas 
      const mathX = semiAxisA * Math.cos(parameterT) + centerX;
      const mathY = semiAxisB * Math.sin(parameterT) + centerY;

      const canvasX = this.mapHorizontalToCanvas(mathX);
      const canvasY = this.mapVerticalToCanvas(mathY);

      if (i === 0) {
        this.context.moveTo(canvasX, canvasY);
      } else {
        this.context.lineTo(canvasX, canvasY);
      }
    }

    this.context.stroke();
    this.context.restore();
  }

  private mapHorizontalToCanvas(xCoordinate: number): number {
    return (xCoordinate - this.viewport.getMinimumHorizontalValue()) * this.context.canvas.width / this.viewport.getHorizontalRange();
  }

  private mapVerticalToCanvas(yCoordinate: number): number {
    return this.context.canvas.height - ((yCoordinate - this.viewport.getMinimumVerticalValue()) * this.context.canvas.height / this.viewport.getVerticalRange());
  }
}