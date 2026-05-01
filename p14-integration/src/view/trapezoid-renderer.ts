/**
 * Universidad de La Laguna
 * Escuela Superior de Ingeniería y Tecnología
 * Grado en Ingeniería Informática
 * Programación de Aplicaciones Interactivas 2024-2025
 *
 * @author Eric Rios Hamilton
 * @since May 1, 2025
 * @description TrapezoidRenderer class for rendering trapezoids on a canvas.
 *
 */

import { PointScaler } from './point-scaler.ts';
import { RenderInformation } from './render-information.ts';
import { Trapezoid } from '../model/trapezoid.ts';
import { Point } from '../model/point.ts';

export class TrapezoidRenderer {
  private readonly canvas: HTMLCanvasElement;
  private readonly context: CanvasRenderingContext2D;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.context = this.canvas.getContext('2d') as CanvasRenderingContext2D;
  }

  /**
   * @description Renders trapezoids on the canvas using the provided trapezoids.
   * @param Trapezoids The trapezoids to render
   * @param information Information needed for rendering on the canvas
   */
  public render(Trapezoids: Trapezoid[], information: RenderInformation): void {
    this.context.save();
    this.context.fillStyle = 'rgba(255, 0, 0, 0.3)'; // Semi-transparent red
    this.context.strokeStyle = 'grey';
    for (const trapezoid of Trapezoids) {
      const { dynamicLeft, dynamicRight, fixedLeft, fixedRight } = this.getCanvasCoordinates(trapezoid, information);
      this.fillTrapezoid(dynamicLeft, dynamicRight, fixedRight, fixedLeft);
      this.drawLine(dynamicLeft, dynamicRight, 2, []);
      this.drawLine(fixedLeft, fixedRight, 2, []);
      this.drawLine(dynamicLeft, fixedLeft, 1, [10, 12]);
      this.drawLine(dynamicRight, fixedRight, 1, [10, 12]);
      this.drawCircle(dynamicLeft);
      this.drawCircle(dynamicRight);
    }
    this.context.setLineDash([]);
    this.context.restore();
  }

  /**
   * Converts trapezoid points to canvas coordinates.
   */
  private getCanvasCoordinates(trapezoid: Trapezoid, information: RenderInformation) {
    return {
      dynamicLeft: PointScaler.convertPointToCanvasCoordinates(trapezoid.dynamicLeft, information),
      dynamicRight: PointScaler.convertPointToCanvasCoordinates(trapezoid.dynamicRight, information),
      fixedLeft: PointScaler.convertPointToCanvasCoordinates(trapezoid.fixedLeft, information),
      fixedRight: PointScaler.convertPointToCanvasCoordinates(trapezoid.fixedRight, information),
    };
  }

  /**
   * Fills a trapezoid on the canvas.
   */
  private fillTrapezoid(dynamicLeft: Point, dynamicRight: Point, fixedRight: Point, fixedLeft: Point): void {
    this.context.beginPath();
    this.context.moveTo(dynamicLeft.xPosition, dynamicLeft.yPosition);
    this.context.lineTo(dynamicRight.xPosition, dynamicRight.yPosition);
    this.context.lineTo(fixedRight.xPosition, fixedRight.yPosition);
    this.context.lineTo(fixedLeft.xPosition, fixedLeft.yPosition);
    this.context.closePath();
    this.context.fill();
  }

  /**
   * Draws a line between two points with specified width and dash style.
   */
  private drawLine(start: Point, end: Point, lineWidth: number, dash: number[]): void {
    this.context.lineWidth = lineWidth;
    this.context.setLineDash(dash);
    this.context.beginPath();
    this.context.moveTo(start.xPosition, start.yPosition);
    this.context.lineTo(end.xPosition, end.yPosition);
    this.context.stroke();
  }

  /**
   * Draws a circle at the specified point on the canvas.
   */
  private drawCircle(point: Point): void {
    this.context.save();
    this.context.beginPath();
    this.context.arc(point.xPosition, point.yPosition, 4, 0, Math.PI * 2);
    this.context.fillStyle = 'red';
    this.context.fill();
    this.context.closePath();
    this.context.restore();
  }
}