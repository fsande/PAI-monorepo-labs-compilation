/**
 * Universidad de La Laguna
 * Escuela Superior de Ingeniería y Tecnología
 * Grado en Ingeniería Informática
 * Programación de Aplicaciones Interactivas
 *
 * @author Daniel Martínez
 * @since Apr 07 2026
 * @description Class responsible for drawing an ellipse and a static planet on its orbit.
 */

import { Viewport } from '../model/viewport.js';

/**
 * Handles the graphical representation of an ellipse and associated celestial bodies.
 */
export class EllipseRenderer {
  /**
   * Initializes the ellipse renderer.
   * @param context Canvas rendering context.
   * @param viewport Mathematical region to be used for coordinate mapping.
   */
  constructor(
    private readonly context: CanvasRenderingContext2D,
    private readonly viewport: Viewport,
  ) {}

  /**
   * Draws the ellipse based on parametric equations: x = A*cos(t) + h, y = B*sin(t) + k.
   * @param semiAxisA Semi-axis A of the ellipse.
   * @param semiAxisB Semi-axis B of the ellipse.
   * @param centerX Horizontal center coordinate (h).
   * @param centerY Vertical center coordinate (k).
   * @param color Name of the color for the stroke.
   */
  draw(semiAxisA: number, semiAxisB: number, centerX: number, centerY: number, color: string): void {
    this.context.save();
    this.context.strokeStyle = color;
    this.context.lineWidth = 3;
    this.context.beginPath();

    const segments = 200;
    for (let i = 0; i <= segments; i++) {
      const parameterT = (i / segments) * 2 * Math.PI;
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

  /**
   * Draws a static planet as a filled red circle on the ellipse path.
   * @desc The planet is drawn at a fixed parametric position.
   * @param semiAxisA Semi-axis A.
   * @param semiAxisB Semi-axis B.
   * @param centerX Center h.
   * @param centerY Center k.
   * @param parameterT Position on the ellipse in radians.
   */
  drawPlanet(semiAxisA: number, semiAxisB: number, centerX: number, centerY: number, parameterT: number): void {
    const mathX = semiAxisA * Math.cos(parameterT) + centerX;
    const mathY = semiAxisB * Math.sin(parameterT) + centerY;
   
    const canvasX = this.mapHorizontalToCanvas(mathX);
    const canvasY = this.mapVerticalToCanvas(mathY);

    this.context.save();
    this.context.fillStyle = 'red';
    this.context.beginPath();
    // Dibujamos un planeta de radio 12
    this.context.arc(canvasX, canvasY, 12, 0, 2 * Math.PI);
    this.context.fill();
    this.context.restore();
  }

  /**
   * Maps a mathematical horizontal value to canvas coordinates.
   * @param xValue Mathematical x value.
   * @returns Canvas horizontal coordinate.
   */
  private mapHorizontalToCanvas(xValue: number): number {
    return (xValue - this.viewport.getMinimumHorizontalValue()) * this.context.canvas.width / this.viewport.getHorizontalRange();
  }

  /**
   * Maps a mathematical vertical value to canvas coordinates.
   * @param yValue Mathematical y value.
   * @returns Canvas vertical coordinate.
   */
  private mapVerticalToCanvas(yValue: number): number {
    return this.context.canvas.height - ((yValue - this.viewport.getMinimumVerticalValue()) * this.context.canvas.height / this.viewport.getVerticalRange());
  }
}