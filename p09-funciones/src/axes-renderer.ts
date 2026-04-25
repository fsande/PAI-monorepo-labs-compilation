/**
 * Universidad de La Laguna
 * Escuela Superior de Ingeniería y Tecnología
 * Grado en Ingeniería Informática
 * Programación de Aplicaciones Interactivas
 *
 * @author Daniel Martínez
 * @since Apr 07 2026
 * @description Class responsible for drawing the Cartesian axes and their labels.
 */

import { Viewport } from './viewport.js';

/**
 * Draws the Cartesian axes, arrowheads and numeric labels.
 */
export class AxesRenderer {
  /**
   * Creates an axes renderer.
   * @param context Canvas rendering context.
   * @param viewport Visible mathematical region.
   */
  constructor(
    private readonly context: CanvasRenderingContext2D,
    private readonly viewport: Viewport,
  ) {}

  /**
   * Draws the axes, their arrowheads and numeric labels.
   */
  draw(): void {
    this.context.save();
    this.context.strokeStyle = 'black';
    this.context.fillStyle = 'black';
    this.context.lineWidth = 2;
    this.context.font = '14px Arial';

    this.drawHorizontalAxis();
    this.drawVerticalAxis();
    this.drawHorizontalAxisLabels();
    this.drawVerticalAxisLabels();
    this.drawOriginLabel();

    this.context.restore();
  }

  /**
   * Draws the horizontal axis.
   */
  private drawHorizontalAxis(): void {
    const horizontalAxisCanvasCoordinate =
      this.mapVerticalValueToCanvas(0);

    this.context.beginPath();
    this.context.moveTo(0, horizontalAxisCanvasCoordinate);
    this.context.lineTo(
      this.context.canvas.width,
      horizontalAxisCanvasCoordinate,
    );
    this.context.stroke();

    this.drawRightArrowhead(
      this.context.canvas.width - 1,
      horizontalAxisCanvasCoordinate,
    );
  }

  /**
   * Draws the vertical axis.
   */
  private drawVerticalAxis(): void {
    const verticalAxisCanvasCoordinate =
      this.mapHorizontalValueToCanvas(0);

    this.context.beginPath();
    this.context.moveTo(verticalAxisCanvasCoordinate, 0);
    this.context.lineTo(
      verticalAxisCanvasCoordinate,
      this.context.canvas.height,
    );
    this.context.stroke();

    this.drawUpArrowhead(verticalAxisCanvasCoordinate, 1);
  }

  /**
   * Draws numeric labels on the horizontal axis.
   */
  private drawHorizontalAxisLabels(): void {
    const firstVisibleHorizontalValue = Math.ceil(
      this.viewport.getMinimumHorizontalValue(),
    );
    const lastVisibleHorizontalValue = Math.floor(
      this.viewport.getMaximumHorizontalValue(),
    );
    const horizontalAxisCanvasCoordinate =
      this.mapVerticalValueToCanvas(0);

    for (
      let horizontalValue = firstVisibleHorizontalValue;
      horizontalValue <= lastVisibleHorizontalValue;
      horizontalValue++
    ) {
      if (horizontalValue === 0) {
        continue;
      }

      const horizontalLabel = `${horizontalValue}`;
      const canvasHorizontalCoordinate =
        this.mapHorizontalValueToCanvas(horizontalValue);
      const horizontalLabelWidth =
        this.context.measureText(horizontalLabel).width;
      const centeredHorizontalPosition =
        canvasHorizontalCoordinate - horizontalLabelWidth / 2;
      const adjustedHorizontalPosition =
        this.adjustHorizontalLabelPosition(
          centeredHorizontalPosition,
          horizontalLabelWidth,
        );

      this.context.fillText(
        horizontalLabel,
        adjustedHorizontalPosition,
        horizontalAxisCanvasCoordinate + 18,
      );
    }
  }

  /**
   * Draws numeric labels on the vertical axis.
   */
  private drawVerticalAxisLabels(): void {
    const firstVisibleVerticalValue = Math.ceil(
      this.viewport.getMinimumVerticalValue(),
    );
    const lastVisibleVerticalValue = Math.floor(
      this.viewport.getMaximumVerticalValue(),
    );
    const verticalAxisCanvasCoordinate =
      this.mapHorizontalValueToCanvas(0);

    for (
      let verticalValue = firstVisibleVerticalValue;
      verticalValue <= lastVisibleVerticalValue;
      verticalValue++
    ) {
      if (verticalValue === 0) {
        continue;
      }

      const verticalLabel = `${verticalValue}`;
      const canvasVerticalCoordinate =
        this.mapVerticalValueToCanvas(verticalValue);
      const verticalLabelWidth =
        this.context.measureText(verticalLabel).width;

      this.context.fillText(
        verticalLabel,
        verticalAxisCanvasCoordinate - verticalLabelWidth - 8,
        canvasVerticalCoordinate + 5,
      );
    }
  }

  /**
   * Draws the label for the origin.
   */
  private drawOriginLabel(): void {
    const originCanvasHorizontalCoordinate =
      this.mapHorizontalValueToCanvas(0);
    const originCanvasVerticalCoordinate =
      this.mapVerticalValueToCanvas(0);

    this.context.fillText(
      '0',
      originCanvasHorizontalCoordinate + 6,
      originCanvasVerticalCoordinate + 18,
    );
  }

  /**
   * Adjusts the horizontal position of a label so that it stays inside the canvas.
   * @param horizontalPosition Proposed horizontal position for the label.
   * @param labelWidth Width of the label text.
   * @returns Corrected horizontal position.
   */
  private adjustHorizontalLabelPosition(
    horizontalPosition: number,
    labelWidth: number,
  ): number {
    const minimumAllowedHorizontalPosition = 4;
    const maximumAllowedHorizontalPosition =
      this.context.canvas.width - labelWidth - 4;

    if (horizontalPosition < minimumAllowedHorizontalPosition) {
      return minimumAllowedHorizontalPosition;
    }

    if (horizontalPosition > maximumAllowedHorizontalPosition) {
      return maximumAllowedHorizontalPosition;
    }

    return horizontalPosition;
  }

  /**
   * Draws the arrowhead at the end of the horizontal axis.
   * @param canvasHorizontalCoordinate Horizontal coordinate of the arrow tip.
   * @param canvasVerticalCoordinate Vertical coordinate of the arrow tip.
   */
  private drawRightArrowhead(
    canvasHorizontalCoordinate: number,
    canvasVerticalCoordinate: number,
  ): void {
    this.context.beginPath();
    this.context.moveTo(
      canvasHorizontalCoordinate,
      canvasVerticalCoordinate,
    );
    this.context.lineTo(
      canvasHorizontalCoordinate - 10,
      canvasVerticalCoordinate - 6,
    );
    this.context.moveTo(
      canvasHorizontalCoordinate,
      canvasVerticalCoordinate,
    );
    this.context.lineTo(
      canvasHorizontalCoordinate - 10,
      canvasVerticalCoordinate + 6,
    );
    this.context.stroke();
  }

  /**
   * Draws the arrowhead at the top of the vertical axis.
   * @param canvasHorizontalCoordinate Horizontal coordinate of the arrow tip.
   * @param canvasVerticalCoordinate Vertical coordinate of the arrow tip.
   */
  private drawUpArrowhead(
    canvasHorizontalCoordinate: number,
    canvasVerticalCoordinate: number,
  ): void {
    this.context.beginPath();
    this.context.moveTo(
      canvasHorizontalCoordinate,
      canvasVerticalCoordinate,
    );
    this.context.lineTo(
      canvasHorizontalCoordinate - 6,
      canvasVerticalCoordinate + 10,
    );
    this.context.moveTo(
      canvasHorizontalCoordinate,
      canvasVerticalCoordinate,
    );
    this.context.lineTo(
      canvasHorizontalCoordinate + 6,
      canvasVerticalCoordinate + 10,
    );
    this.context.stroke();
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
