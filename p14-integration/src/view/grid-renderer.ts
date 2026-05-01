/**
 * Universidad de La Laguna
 * Escuela Superior de Ingeniería y Tecnología
 * Grado en Ingeniería Informática
 * Programación de Aplicaciones Interactivas 2024-2025
 *
 * @author Eric Rios Hamilton
 * @since May 1, 2025
 * @description GridRenderer class for rendering a grid in the Trapezoidal Rule Calculator.
 *
 */

import { RenderInformation } from './render-information.ts';
import { PointScaler } from './point-scaler.ts';

export class GridRenderer {
  private static readonly xSegments = 10;
  private static readonly ySegments = 10;
  private static readonly config = {
    strokeStyle: 'lightgrey',
    borderStrokeStyle: 'grey',
    lineWidth: 1,
    font: '10px Arial',
    textAlign: 'center' as CanvasTextAlign,
    textOffsetX: 0,
    textOffsetY: 2,
    labelOffset: 15,
  };

  private context: CanvasRenderingContext2D;

  constructor(private readonly canvas: HTMLCanvasElement) {
    const context = this.canvas.getContext('2d');
    if (!context) {
      throw new Error('Failed to get canvas context');
    }
    this.context = context;
  }

  /**
   * Renders a grid on the canvas.
   * @param information The settings for the grid
   */
  public render(information: RenderInformation): void {
    this.drawGrid(information);
  }

  /**
   * Draws the grid lines and labels on the canvas.
   * @param information The settings for the grid
   */
  private drawGrid(information: RenderInformation): void {
    this.context.strokeStyle = GridRenderer.config.strokeStyle;
    this.context.lineWidth = GridRenderer.config.lineWidth;
    this.context.font = GridRenderer.config.font;
    this.context.textAlign = GridRenderer.config.textAlign;
    this.drawHorizontalGridLines(information);
    this.drawVerticalGridLines(information);
  }

  /**
   * Draws a grid line on the canvas.
   * @param startX The starting x-coordinate of the line.
   * @param startY The starting y-coordinate of the line.
   * @param endX The ending x-coordinate of the line.
   * @param endY The ending y-coordinate of the line.
   * @param label Optional label to display near the line.
   * @param labelX The x-coordinate for the label.
   * @param labelY The y-coordinate for the label.
   */
  private drawGridLine(
    startX: number,
    startY: number,
    endX: number,
    endY: number,
    label?: string,
    labelX?: number,
    labelY?: number
  ): void {
    this.context.beginPath();
    this.context.moveTo(startX, startY);
    this.context.lineTo(endX, endY);
    this.context.stroke();
    if (label && labelX !== undefined && labelY !== undefined) {
      this.context.fillText(label, labelX, labelY);
    }
  }

  /**
   * @description Draws the vertical grid lines on the canvas.
   * @param information The settings for the grid
   */
  private drawVerticalGridLines(information: RenderInformation): void {
    const verticalIncrement = information.verticalIncrement;
    const totalLines = GridRenderer.ySegments;
    for (let i = -totalLines; i <= totalLines; i++) {
      const yValue = i * verticalIncrement;
      if (yValue < information.minY || yValue > information.maxY) {
        continue;
      }
      const canvasPoint = PointScaler.convertPointToCanvasCoordinates(
        { xPosition: 0, yPosition: yValue },
        information
      );
      this.drawGridLine(
        information.leftMargin,
        canvasPoint.yPosition,
        this.canvas.width - information.rightMargin,
        canvasPoint.yPosition,
        yValue.toFixed(1),
        information.leftMargin - GridRenderer.config.labelOffset,
        canvasPoint.yPosition + GridRenderer.config.textOffsetY
      );
    }
    [information.minY, information.maxY].forEach((yValue) => {
      if (yValue % verticalIncrement !== 0) {
        const canvasPoint = PointScaler.convertPointToCanvasCoordinates(
          { xPosition: 0, yPosition: yValue },
          information
        );
        this.drawGridLine(
          information.leftMargin,
          canvasPoint.yPosition,
          this.canvas.width - information.rightMargin,
          canvasPoint.yPosition,
          yValue.toFixed(1),
          information.leftMargin - GridRenderer.config.labelOffset,
          canvasPoint.yPosition + GridRenderer.config.textOffsetY
        );
      }
    });
  }

  /**
   * @description Draws the horizontal grid lines on the canvas.
   * @param information The settings for the grid
   */
  private drawHorizontalGridLines(information: RenderInformation): void {
    for (let i = 0; i <= GridRenderer.xSegments; i++) {
      const xValue = information.minX + (i * (information.maxX - information.minX)) / GridRenderer.xSegments;
      const canvasPoint = PointScaler.convertPointToCanvasCoordinates(
        { xPosition: xValue, yPosition: 0 },
        information
      );
      this.drawGridLine(
        canvasPoint.xPosition,
        information.topMargin,
        canvasPoint.xPosition,
        this.canvas.height - information.bottomMargin,
        xValue.toFixed(1),
        canvasPoint.xPosition + GridRenderer.config.textOffsetX,
        this.canvas.height - information.bottomMargin + GridRenderer.config.labelOffset
      );
    }
  }
}