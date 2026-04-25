/**
 * Universidad de La Laguna
 * Escuela Superior de Ingeniería y Tecnología
 * Grado en Ingeniería Informática
 * Programación de Aplicaciones Interactivas 2025-2026
 *
 * @author Sergio Rosales Calzadilla alu010635590@ull.edu.es
 * @since Apr 19 2026
 * @desc Grid class.
 * Draws the background grid on the canvas.
 */

export class Grid {
  private readonly GRID_COLOR: string = 'LightGray';
  private readonly GRID_STEP: number = 20;

  /**
   * @description Draws a coordinate grid.
   * @param context Canvas context.
   * @param width Canvas width.
   * @param height Canvas height.
   */
  draw(context: CanvasRenderingContext2D, width: number, height: number): void {
    context.strokeStyle = this.GRID_COLOR;
    context.lineWidth = 1;
    context.beginPath();
    for (let x = 0; x <= width; x += this.GRID_STEP) {
      context.moveTo(x, 0);
      context.lineTo(x, height);
    }
    for (let y = 0; y <= height; y += this.GRID_STEP) {
      context.moveTo(0, y);
      context.lineTo(width, y);
    }
    context.stroke();
  }
}