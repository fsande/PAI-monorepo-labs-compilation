/**
 * Universidad de La Laguna
 * Escuela Superior de Ingeniería y Tecnología
 * Grado en Ingeniería Informática
 * Programación de Aplicaciones Interactivas 2025-2026
 *
 * @author Sergio Rosales Calzadilla alu010635590@ull.edu.es
 * @since Apr 19 2026
 * @desc LissajousCurveViewer class.
 * Renders the curve and its components on the main canvas.
 */

import { LissajousCurve } from '../model/lissajous-curve.js';
import { Grid } from './grid.js';

export class LissajousCurveViewer {
  private readonly canvas: HTMLCanvasElement;
  private readonly context: CanvasRenderingContext2D;
  private readonly grid: Grid;
  
  private readonly CURVE_COLOR: string = 'Black';
  private readonly CURVE_WIDTH: number = 2;
  // private readonly POINT_RADIUS: number = 5;
  // private readonly POINT_COLOR: string = 'Red';

  constructor(width: number, height: number) {
    this.canvas = document.createElement('canvas');
    this.canvas.width = width;
    this.canvas.height = height;
    this.context = this.canvas.getContext('2d')!;
    this.grid = new Grid();
  }

  /**
   * @description Clears the canvas and draws the grid and the curve.
   * @param curve The curve model to render.
   */
  render(curve: LissajousCurve): void {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.grid.draw(this.context, this.canvas.width, this.canvas.height); 
    const points = curve.generatePoints();
    if (points.length === 0) return;
    const centerX = this.canvas.width / 2;
    const centerY = this.canvas.height / 2;
    this.context.strokeStyle = this.CURVE_COLOR;
    this.context.lineWidth = this.CURVE_WIDTH;
    this.context.beginPath();
    // Move to the first point
    this.context.moveTo(centerX + points[0].x, centerY - points[0].y);
    for (const point of points) {
      this.context.lineTo(centerX + point.x, centerY - point.y);
    }
    this.context.stroke();
  }

  getCanvasElement(): HTMLCanvasElement {
    return this.canvas;
  }
}
