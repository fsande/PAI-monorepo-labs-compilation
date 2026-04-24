/**
 * Universidad de La Laguna
 * Escuela Superior de Ingeniería y Tecnología
 * Grado en Ingeniería Informática
 * Programación de Aplicaciones Interactivas
 *
 * @author Daniel Martínez
 * @since Apr 07 2026
 * @description Class responsible for drawing the background Cartesian grid.
 */

import { Viewport } from '../model/viewport.ts';

/**
 * Draws the background grid of the Cartesian plane.
 */
export class GridRenderer {
  /**
   * Creates a grid renderer.
   * @param context Canvas rendering context.
   * @param viewport Visible mathematical region.
   */
  constructor(
    private readonly context: CanvasRenderingContext2D,
    private readonly viewport: Viewport,
  ) {}

  /**
   * Draws the complete grid.
   */
  draw(): void {
    this.context.save();
    this.context.strokeStyle = 'lightgray';
    this.context.lineWidth = 1;
    this.context.setLineDash([6, 4]);

    this.drawVerticalLines();
    this.drawHorizontalLines();

    this.context.restore();
  }

  /**
   * Draws all visible vertical grid lines except the vertical axis.
   */
  private drawVerticalLines(): void {
    const firstVisibleHorizontalValue = Math.ceil(
      this.viewport.getMinimumHorizontalValue(),
    );
    const lastVisibleHorizontalValue = Math.floor(
      this.viewport.getMaximumHorizontalValue(),
    );

    for (
      let horizontalValue = firstVisibleHorizontalValue;
      horizontalValue <= lastVisibleHorizontalValue;
      horizontalValue++
    ) {
      if (horizontalValue === 0) {
        continue;
      }

      const canvasHorizontalCoordinate =
        this.mapHorizontalValueToCanvas(horizontalValue);

      this.context.beginPath();
      this.context.moveTo(canvasHorizontalCoordinate, 0);
      this.context.lineTo(
        canvasHorizontalCoordinate,
        this.context.canvas.height,
      );
      this.context.stroke();
    }
  }

  /**
   * Draws all visible horizontal grid lines except the horizontal axis.
   */
  private drawHorizontalLines(): void {
    const firstVisibleVerticalValue = Math.ceil(
      this.viewport.getMinimumVerticalValue(),
    );
    const lastVisibleVerticalValue = Math.floor(
      this.viewport.getMaximumVerticalValue(),
    );

    for (
      let verticalValue = firstVisibleVerticalValue;
      verticalValue <= lastVisibleVerticalValue;
      verticalValue++
    ) {
      if (verticalValue === 0) {
        continue;
      }

      const canvasVerticalCoordinate =
        this.mapVerticalValueToCanvas(verticalValue);

      this.context.beginPath();
      this.context.moveTo(0, canvasVerticalCoordinate);
      this.context.lineTo(
        this.context.canvas.width,
        canvasVerticalCoordinate,
      );
      this.context.stroke();
    }
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
