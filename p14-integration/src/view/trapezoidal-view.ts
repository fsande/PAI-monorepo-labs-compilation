/**
 * Universidad de La Laguna
 * Escuela Superior de Ingeniería y Tecnología
 * Grado en Ingeniería Informática
 * Programación de Aplicaciones Interactivas 2024-2025
 *
 * @author Eric Rios Hamilton
 * @since May 1, 2025
 * @description TrapezoidalView class for the Trapezoidal Rule Calculator
 *
 */

import { View } from '../mvc/view.ts';
import { TrapezoidalData } from '../model/trapezoidal-data.ts';
import { TrapezoidalUpdate } from '../model/trapezoidal-update.ts';
import { Controller } from '../mvc/controller.ts';
import { TrapezoidRenderer } from './trapezoid-renderer.ts';
import { CurveRenderer } from './curve-renderer.ts';
import { GridRenderer } from './grid-renderer.ts';
import { RenderInformation } from './render-information.ts';

export class TrapezoidalView implements View<TrapezoidalData, string, TrapezoidalUpdate> {
  private trapezoidRenderer: TrapezoidRenderer;
  private curveRenderer: CurveRenderer;
  private gridRenderer: GridRenderer;
  private scaleX: number = 1;
  private scaleY: number = 1;
  private canvas: HTMLCanvasElement;
  private readonly leftMargin = 35;
  private readonly rightMargin = 15;
  private readonly bottomMargin = 35;
  private readonly topMargin = 15;
  private expressionInput = document.getElementById('expression-input') as HTMLInputElement;      
  private numberOfTrapezoidsInput = document.getElementById('trapezoids-input') as HTMLInputElement;
  private startInput = document.getElementById('start-input') as HTMLInputElement;
  private endInput = document.getElementById('end-input') as HTMLInputElement;
  private updateButton = document.getElementById('update-button') as HTMLButtonElement;
  private areaOutput = document.getElementById('result-value') as HTMLSpanElement;

  constructor(canvasName: string) {
    this.canvas = this.initializeCanvas(canvasName);
    this.trapezoidRenderer = new TrapezoidRenderer(this.canvas);
    this.curveRenderer = new CurveRenderer(this.canvas);
    this.gridRenderer = new GridRenderer(this.canvas);
  }

  /**
   * @description Render the trapezoidal view
   * @param state The information to be rendered
   */
  public render(state: TrapezoidalData): void {
    const context = this.canvas.getContext('2d');
    if (!context) {
      throw new Error('Failed to get canvas context');
    }
    context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    const renderInformation = this.computeRenderInformation(state);
    this.gridRenderer.render(renderInformation);
    this.trapezoidRenderer.render(state.trapezoids, renderInformation);
    this.curveRenderer.render(state.curvePoints, renderInformation);
    this.updateInputUI(state.update);
    this.updateOutputUI(state);
  }

  /**
   * @description Binds UI events to the controller
   * @param controller The controller to bind events to
   */
  public bindEvents(controller: Controller<string, TrapezoidalUpdate>): void {
    const updateController = () => {
      const expression = this.expressionInput.value;
      const numberOfTrapezoids = parseInt(this.numberOfTrapezoidsInput.value);
      const start = parseFloat(this.startInput.value);
      const end = parseFloat(this.endInput.value);
      if (isNaN(numberOfTrapezoids) || isNaN(start) || isNaN(end) || !expression) {
        alert('Please enter valid numbers for the trapezoids, start, and end values.');
        return;
      }
      controller.onUpdate("UPDATE", {
        expression: expression,
        numberOfTrapezoids: numberOfTrapezoids,
        xStart: start,
        xEnd: end,
      });
    };
    this.updateButton.addEventListener('click', updateController);
    this.numberOfTrapezoidsInput.addEventListener('blur', updateController);
    this.startInput.addEventListener('blur', updateController);
    this.endInput.addEventListener('blur', updateController);
  }

  /**
   * @description Updates the output UI with the given state information
   * @param state The state information to be displayed
   */
  private updateOutputUI(state: TrapezoidalData): void {
    const area = state.trapezoids.reduce((acc, trapezoid) => acc + trapezoid.area, 0);
    this.areaOutput.innerText = area.toFixed(4);
  }

  /**
   * @description Updates the input UI with the given update information
   * @param update The update information to be displayed
   */
  private updateInputUI(update: TrapezoidalUpdate): void {
    this.expressionInput.value = update.expression;
    this.numberOfTrapezoidsInput.value = update.numberOfTrapezoids.toString();
    this.startInput.value = update.xStart.toString();
    this.endInput.value = update.xEnd.toString();
  }

  /**
   * @description Computes the render information for the canvas
   * @returns The render information for the canvas
   */
  private computeRenderInformation(state: TrapezoidalData): RenderInformation {
    let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
    const trapezoidPoints = state.trapezoids.map((trapezoid) => trapezoid.points).flat();
    for (const point of trapezoidPoints) {
      if (point.xPosition < minX) minX = point.xPosition;
      if (point.xPosition > maxX) maxX = point.xPosition;
      if (point.yPosition < minY) minY = point.yPosition;
      if (point.yPosition > maxY) maxY = point.yPosition;
    }
    const length = maxX - minX;
    const magnitude = Math.pow(10, Math.floor(Math.log10(length)));
    minX = this.roundToPrettyNumber(minX, magnitude);
    maxX = this.roundToPrettyNumber(maxX, magnitude);
    this.scaleX = (this.canvas.width - this.leftMargin - this.rightMargin) / (maxX - minX);
    this.scaleY = (this.canvas.height - this.topMargin - this.bottomMargin) / (maxY - minY);
    const yRange = maxY - minY;
    const verticalIncrement = this.roundToPrettyNumber(yRange / 10, Math.pow(10, Math.floor(Math.log10(yRange))));
      return {
      minX: minX,
      minY: minY,
      maxX: maxX,
      maxY: maxY,
      scaleX: this.scaleX,
      scaleY: this.scaleY,
      leftMargin: this.leftMargin,
      rightMargin: this.rightMargin,
      bottomMargin: this.bottomMargin,
      topMargin: this.topMargin,
      canvasWidth: this.canvas.width,
      canvasHeight: this.canvas.height,
      verticalIncrement: verticalIncrement,
    }
  }

  /**
   * Rounds a number to the nearest "pretty" number, either up or down.
   * @param value The number to round.
   * @param roundUp Whether to round up (true) or down (false).
   * @returns The rounded number.
   */
  private roundToPrettyNumber(value: number, magnitude: number): number {
    const normalized = Math.abs(value) / magnitude;
    const rest = normalized % 1;
    if (rest === 0) {
      return value;
    }
    const prettyNumbers = [0.2, 0.5, 1];
    let prettyNumber = 0;
    for (const number of prettyNumbers) {
      if (rest < number) {
        prettyNumber = number;
        break;
      }    
    }
    const roundedValue = Math.floor(normalized) + prettyNumber;
    return (value < 0 ? -roundedValue : roundedValue) * magnitude;
  }

  /**
   * Initializes the canvas element with the given name and calculates scaling factors.
   * Ensures the canvas maintains a 16:9 aspect ratio.
   * @param canvasName - The name of the canvas element to initialize.
   * @returns The initialized canvas element or null if not found.
   */
  private initializeCanvas(canvasName: string): HTMLCanvasElement {
    const canvas = document.getElementById(canvasName) as HTMLCanvasElement;
    if (canvas) {
      const cssWidth = canvas.offsetWidth;
      const cssHeight = canvas.offsetHeight;
      canvas.width = cssWidth;
      canvas.height = cssHeight;
      return canvas;
    }
    throw new Error(`Canvas with name ${canvasName} not found`);
  }
}