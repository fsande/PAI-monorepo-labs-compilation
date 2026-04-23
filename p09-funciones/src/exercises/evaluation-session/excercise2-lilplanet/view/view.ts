/**
 * Universidad de La Laguna
 * Escuela Superior de Ingeniería y Tecnología
 * Grado en Ingeniería Informática
 * Programación de Aplicaciones Interactivas
 *
 * @author Daniel Martínez
 * @since Apr 07 2026
 * @description View class that coordinates the rendering of the coordinate system, 
 * the ellipse, and the planet.
 */

import { Viewport } from '../model/viewport.js';
import { AxesRenderer } from './axes-renderer.js';
import { GridRenderer } from './grid-renderer.js';
import { EllipseRenderer } from './ellipse-renderer.js';

export class View {
  private readonly plotContext: CanvasRenderingContext2D;
  private readonly textContext: CanvasRenderingContext2D;

  /**
   * Initializes the contexts for both canvases.
   * @param plotCanvasId ID for the main plot.
   * @param textCanvasId ID for the text info.
   * @param viewport The visible mathematical region.
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
   * Renders the complete scene including grid, axes, ellipse, and the planet.
   * @param semiAxisA Semi-axis A of the ellipse.
   * @param semiAxisB Semi-axis B of the ellipse.
   * @param centerX Horizontal center coordinate (h).
   * @param centerY Vertical center coordinate (k).
   */
  renderEllipse(semiAxisA: number, semiAxisB: number, centerX: number, centerY: number): void {
    this.clearCanvases();

    new GridRenderer(this.plotContext, this.viewport).draw();
    new AxesRenderer(this.plotContext, this.viewport).draw();
    
    const ellipseRenderer = new EllipseRenderer(this.plotContext, this.viewport);
    // Dibujamos la órbita
    ellipseRenderer.draw(semiAxisA, semiAxisB, centerX, centerY, 'purple');
    
    // Dibujamos el planeta en una posición inmóvil
    // const fixedPosition = Math.PI / 4;

    // Dibujamos el planeta en una posición aleatoria cada vez que se renderiza
    const randomAngle = Math.random() * 2 * Math.PI;

    ellipseRenderer.drawPlanet(semiAxisA, semiAxisB, centerX, centerY, randomAngle);

    this.drawTextInfo(semiAxisA, semiAxisB, centerX, centerY);
  }

  /**
   * Draws information about the current ellipse on the text canvas.
   */
  private drawTextInfo(semiAxisA: number, semiAxisB: number, centerX: number, centerY: number): void {
    this.textContext.font = '20px Arial';
    this.textContext.fillStyle = 'black';
    this.textContext.fillText(`Órbita Elíptica: A=${semiAxisA}, B=${semiAxisB}, Centro=(${centerX}, ${centerY})`, 20, 40);
    this.textContext.fillStyle = 'red';
    this.textContext.fillText('Planeta detectado en órbita.', 20, 70);
  }

  private initializeContext(id: string): CanvasRenderingContext2D {
    const canvas = document.getElementById(id) as HTMLCanvasElement;
    if (!canvas) throw new Error(`Canvas ${id} not found.`);
    const context = canvas.getContext('2d');
    if (!context) throw new Error('Could not get 2D context.');
    return context;
  }

  private clearCanvases(): void {
    this.plotContext.clearRect(0, 0, this.plotContext.canvas.width, this.plotContext.canvas.height);
    this.textContext.clearRect(0, 0, this.textContext.canvas.width, this.textContext.canvas.height);
  }
}