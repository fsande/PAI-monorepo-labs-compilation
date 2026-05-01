/**
 * Universidad de La Laguna
 * Escuela Superior de Ingeniería y Tecnología
 * Grado en Ingeniería Informática
 * Programación de Aplicaciones Interactivas 2024-2025
 *
 * @author Eric Ríos Hamilton
 * @since Mar 28 2025
 * @desc GraphComputer class that computes the points of a graph
 *
 */

import { MathFunction } from './math-function.js';
import { Point } from './point.js';

export class CurveComputer {
  private points: Point[] | null = null;

  constructor(
    private mathFunction: MathFunction,
    private domainStart: number,
    private domainEnd: number,
    private numberOfSamples: number = 100
  ) {
    if (domainStart >= domainEnd) {
      throw new Error('domainStart must be less than domainEnd');
    }
    if (numberOfSamples < 2) {
      throw new Error('numSamples must be at least 2');
    }
  }

  /**
   * Returns the computed points of the graph.
   * @returns An array of points, each represented as an object with x and y properties.
   */
  public getPoints(): Point[] {
    if (this.points === null) {
      this.computePoints();
    }
    console.log("Points computed:", this.points);
    return this.points!;
  }

  /**
   * Computes the points of the graph using the given math function.
   * The points are stored in the `points` property.
   */
  private computePoints(): void {
    if (this.points !== null) return; // Avoid recomputation
    this.points = [];
    const step = (this.domainEnd - this.domainStart) / (this.numberOfSamples - 1);
    for (let i = 0; i < this.numberOfSamples; i++) {
      const x = this.domainStart + i * step;
      const y = this.mathFunction.evaluate(x);
      this.points.push({ xPosition: x, yPosition: y });
    }
  }
}