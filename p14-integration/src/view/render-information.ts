/**
 * Universidad de La Laguna
 * Escuela Superior de Ingeniería y Tecnología
 * Grado en Ingeniería Informática
 * Programación de Aplicaciones Interactivas 2024-2025
 *
 * @author Eric Rios Hamilton
 * @since May 1, 2025
 * @description GridInformation needed for the grid renderer.
 *
 */

export interface RenderInformation {
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
  scaleX: number;
  scaleY: number;
  leftMargin: number;
  rightMargin: number;
  bottomMargin: number;
  topMargin: number;
  canvasWidth: number;
  canvasHeight: number;
  verticalIncrement: number;
}