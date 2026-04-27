/**
 * Universidad de La Laguna
 * Escuela Superior de Ingeniería y Tecnología
 * Grado en Ingeniería Informática
 * Programación de Aplicaciones Interactivas
 *
 * @author Adrián Castro Rodríguez <adrian.castro.46@ull.edu.es>
 * @author Bruno Morales Hernández <morales.hernandez.28@ull.edu.es>
 * @author Ezequiel Juan Canale Oliva <ezequiel.juan.11@ull.edu.es>
 * @since Apr 27 2026
 * @desc Defines the game’s view entry point, responsible for initializing the
 * display and forwarding frame rendering calls.
 */

import {CanvasDisplay} from './CanvasDisplay.js';
import type {DrawFrameData} from './CanvasDisplay.js';

// Re-export display types for convenience
export {CanvasDisplay} from './CanvasDisplay.js';

export type DisplayType = 'canvas' | 'dom';

/** @classdesc Single entry-point to the view layer. */
export class GameView {
  private canvasDisplay: CanvasDisplay | undefined;
  private readonly canvas: HTMLCanvasElement;
  private readonly displayType: DisplayType;

  /** 
   * @desc Creates a new GameView instance with injected rendering 
   * dependencies. 
   */
  constructor(canvas: HTMLCanvasElement, displayType: DisplayType = 'canvas') {
    this.canvas = canvas;
    this.displayType = displayType;
  }

  /**
   * @desc Creates (or recreates) the display for a given level.
   * @param width - Width of the level in grid units
   * @param height - Height of the level in grid units
   */
  mount(width: number, height: number): void {
    if (this.displayType !== 'canvas') {
      throw new Error(
        `GameView: unsupported display type "${this.displayType}"`);
    }
    this.unmount();
    this.canvasDisplay = new CanvasDisplay(this.canvas, width, height);
  }

  /** @desc Removes the current display and cleans up resources. */
  unmount(): void {
    this.canvasDisplay = undefined;
  }

  /**
   * @desc Renders one complete frame of the game.
    * @param frameData - Aggregated frame rendering data
   * @throws {Error} If no display is mounted before calling drawFrame
   */
  drawFrame(frameData: DrawFrameData): void {
    if (!this.canvasDisplay) throw new Error('GameView: no display mounted');
    this.canvasDisplay.drawFrame(frameData);
  }
}
