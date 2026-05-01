/**
 * Universidad de La Laguna
 * Escuela Superior de Ingeniería y Tecnología
 * Grado en Ingeniería Informática
 * Programación de Aplicaciones Interactivas 2024-2025
 *
 * @author Eric Rios Hamilton
 * @since May 1, 2025
 * @description CurveRenderer class for rendering a curve on a canvas.
 *
 */

import { PointScaler } from './point-scaler.ts';
import { RenderInformation } from './render-information.ts';
import { Point } from '../model/point.ts';

export class CurveRenderer {
  private readonly canvas: HTMLCanvasElement;
  private readonly context: CanvasRenderingContext2D;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.context = this.canvas.getContext('2d') as CanvasRenderingContext2D;
  }

  /**
   * @description Renders a curve on the canvas using the provided points.
   * @param points The points that define the curve.
   */
  public render(curvePoints: Point[], information: RenderInformation): void {
    this.context.beginPath();
    for (const point of curvePoints) {
      const scaledPoint = PointScaler.convertPointToCanvasCoordinates(
        point,
        information
      );
      this.context.lineTo(
        scaledPoint.xPosition,
        scaledPoint.yPosition
      );
    }
    this.context.strokeStyle = 'blue';
    this.context.lineWidth = 2;
    this.context.stroke();
  }
}