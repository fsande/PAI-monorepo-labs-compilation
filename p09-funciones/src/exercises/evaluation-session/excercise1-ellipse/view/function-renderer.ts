/**
 * Universidad de La Laguna
 * Escuela Superior de Ingeniería y Tecnología
 * Grado en Ingeniería Informática
 * Programación de Aplicaciones Interactivas
 *
 * @author Daniel Martínez
 * @since Apr 07 2026
 * @description Class responsible for drawing a mathematical function with a specific color.
 */

import { Viewport } from '../model/viewport.js';

/**
 * Draws a mathematical function inside the visible Cartesian plane.
 */
export class FunctionRenderer {
  /**
   * Creates a function renderer.
   * @param context Canvas rendering context.
   * @param viewport Visible mathematical region.
   * @param functionToPlot Mathematical function to be represented.
   */
  constructor(
    private readonly context: CanvasRenderingContext2D,
    private readonly viewport: Viewport,
    private readonly functionToPlot: (horizontalValue: number) => number,
  ) {}

  /**
   * Draws the function curve using the specified color.
   * @param color Name of the color to use (e.g., 'blue', 'red').
   */
  draw(color: string): void {
    const horizontalStep = this.calculateHorizontalStep();

    this.context.save();
    this.context.strokeStyle = color; // Directriz 8: Usamos el nombre del color
    this.context.lineWidth = 2;
    this.context.beginPath();

    let firstPointOfCurrentSegment = true;

    for (
      let horizontalValue = this.viewport.getMinimumHorizontalValue();
      horizontalValue <= this.viewport.getMaximumHorizontalValue();
      horizontalValue += horizontalStep
    ) {
      const verticalValue = this.functionToPlot(horizontalValue);

      if (!Number.isFinite(verticalValue)) {
        firstPointOfCurrentSegment = true;
        continue;
      }

      if (this.isOutsideVisibleVerticalRange(verticalValue)) {
        firstPointOfCurrentSegment = true;
        continue;
      }

      const canvasHorizontalCoordinate = this.mapHorizontalValueToCanvas(horizontalValue);
      const canvasVerticalCoordinate = this.mapVerticalValueToCanvas(verticalValue);

      if (firstPointOfCurrentSegment) {
        this.context.moveTo(canvasHorizontalCoordinate, canvasVerticalCoordinate);
        firstPointOfCurrentSegment = false;
      } else {
        this.context.lineTo(canvasHorizontalCoordinate, canvasVerticalCoordinate);
      }
    }

    this.context.stroke();
    this.context.restore();
  }

  /**
   * Calculates the horizontal increment used to sample the function.
   * @returns Horizontal sampling step in mathematical coordinates.
   */
  private calculateHorizontalStep(): number {
    return this.viewport.getHorizontalRange() / this.context.canvas.width;
  }

  /**
   * Checks whether a vertical value is outside the visible mathematical range.
   * @param verticalValue Mathematical vertical value.
   * @returns True if the value is outside the visible range, false otherwise.
   */
  private isOutsideVisibleVerticalRange(verticalValue: number): boolean {
    return (
      verticalValue < this.viewport.getMinimumVerticalValue() ||
      verticalValue > this.viewport.getMaximumVerticalValue()
    );
  }

  /**
   * Maps a mathematical horizontal value to a canvas horizontal coordinate.
   * @param horizontalValue Mathematical horizontal value.
   * @returns Horizontal coordinate on the canvas.
   */
  private mapHorizontalValueToCanvas(horizontalValue: number): number {
    return (
      (horizontalValue - this.viewport.getMinimumHorizontalValue()) *
      this.context.canvas.width /
      this.viewport.getHorizontalRange()
    );
  }

  /**
   * Maps a mathematical vertical value to a canvas vertical coordinate.
   * @param verticalValue Mathematical vertical value.
   * @returns Vertical coordinate on the canvas.
   */
  private mapVerticalValueToCanvas(verticalValue: number): number {
    return (
      this.context.canvas.height -
      ((verticalValue - this.viewport.getMinimumVerticalValue()) *
        this.context.canvas.height /
        this.viewport.getVerticalRange())
    );
  }
}