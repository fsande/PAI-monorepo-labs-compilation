/**
 * Universidad de La Laguna
 * Escuela Superior de Ingeniería y Tecnología
 * Grado en Ingeniería Informática
 * Programación de Aplicaciones Interactivas 2024-2025
 *
 * @author Eric Rios Hamilton
 * @since May 1, 2025
 * @description Converts a point to its canvas coordinates.
 *
 */

import { Point } from '../model/point.ts';
import { RenderInformation } from './render-information.ts';



export class PointScaler {
  /**
   * Converts a point to its canvas coordinates.
   * @param point The point to convert
   * @param information The information needed for the conversion
   * @returns The point in canvas coordinates
   */
  public static convertPointToCanvasCoordinates(point: Point, information: RenderInformation): Point {
    const xPosition = (point.xPosition - information.minX) * information.scaleX + information.leftMargin;
    const yPosition = (-point.yPosition + information.minY) * information.scaleY + (information.canvasHeight - information.bottomMargin);
    return { xPosition, yPosition };
  }
}
