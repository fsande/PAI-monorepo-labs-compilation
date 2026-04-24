/**
 * Universidad de La Laguna
 * Escuela Superior de Ingeniería y Tecnología
 * Grado en Ingeniería Informática
 * Programación de Aplicaciones Interactivas
 *
 * @author Daniel Martínez
 * @since Apr 07 2026
 * @description View class that coordinates the rendering of the coordinate system 
 * and the user-defined function.
 */

import { Viewport } from '../model/viewport.ts';
import { AxesRenderer } from './axes-renderer.ts';
import { FunctionRenderer } from './function-renderer.ts';
import { GridRenderer } from './grid-renderer.ts';

export class View {
  private readonly plotContext: CanvasRenderingContext2D;
  private readonly textContext: CanvasRenderingContext2D;

  /**
   * Initializes the view with the required canvases and viewport.
   * @param plotCanvasId Identifier for the main plotting canvas.
   * @param textCanvasId Identifier for the text information canvas.
   * @param viewport The mathematical region to be displayed.
   */
  constructor(
    private readonly plotCanvasId: string,
    private readonly textCanvasId: string,
    private readonly viewport: Viewport,
  ) {
    this.plotContext = this.initializeContext(this.plotCanvasId);
    this.textContext = this.initializeContext(this.textCanvasId);
  }

  /**
   * Renders the complete scene including the grid, axes, and the function.
   * @param functionToRender The math function to draw.
   * @param functionExpression The string representation of the function.
   */
  render(functionToRender: (x: number) => number, functionExpression: string): void {
    this.clearAllCanvases();

    const grid = new GridRenderer(this.plotContext, this.viewport);
    const axes = new AxesRenderer(this.plotContext, this.viewport);
    const plotter = new FunctionRenderer(this.plotContext, this.viewport, functionToRender);

    grid.draw();
    axes.draw();
    plotter.draw('blue'); // Usamos nombre de color (Directriz 8)

    this.drawFunctionInfo(functionExpression);
  }

  /**
   * Displays the function string on the information canvas.
   * @param expression The text to show.
   */
  private drawFunctionInfo(expression: string): void {
    this.textContext.font = '24px Arial';
    this.textContext.fillStyle = 'black';
    this.textContext.fillText('Función actual:', 20, 50);
    
    this.textContext.fillStyle = 'blue';
    this.textContext.fillText(`f(x) = ${expression}`, 20, 90);
  }

  /**
   * Helper to get and validate canvas contexts.
   * @param canvasId The ID of the HTML element.
   * @returns A valid 2D rendering context.
   */
  private initializeContext(canvasId: string): CanvasRenderingContext2D {
    const canvasElement = document.getElementById(canvasId) as HTMLCanvasElement | null;
    if (!canvasElement) {
      throw new Error(`Canvas element with ID '${canvasId}' not found.`);
    }
    const context = canvasElement.getContext('2d');
    if (!context) {
      throw new Error(`Could not obtain 2D context for canvas '${canvasId}'.`);
    }
    return context;
  }

  /**
   * Resets both canvases to a blank state.
   */
  private clearAllCanvases(): void {
    this.plotContext.clearRect(0, 0, this.plotContext.canvas.width, this.plotContext.canvas.height);
    this.textContext.clearRect(0, 0, this.textContext.canvas.width, this.textContext.canvas.height);
  }
}
