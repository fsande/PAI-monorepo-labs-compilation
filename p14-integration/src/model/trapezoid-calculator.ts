/**
 * Universidad de La Laguna
 * Escuela Superior de Ingeniería y Tecnología
 * Grado en Ingeniería Informática
 * Programación de Aplicaciones Interactivas 2024-2025
 *
 * @author Eric Ríos Hamilton
 * @since May 1, 2025
 * @desc TrapezoidalCalculator class 
 *
 */

import { Point } from './point.ts';
import { Trapezoid } from './trapezoid.ts';
import { TrapezoidalUpdate } from './trapezoidal-update.ts';

export class TrapezoidalCalculator {
  private static readonly decimals = 3;

  /**
   * Calculates the trapezoids based on the given curve and parameters.
   * @param curve The curve points.
   * @param parameters The parameters for trapezoidal calculation.
   * @returns An array of trapezoids.
   */
  public static calculateTrapezoids(curve: Point[], parameters: TrapezoidalUpdate): Trapezoid[] {
    const trapezoids: Trapezoid[] = [];
    const { xStart, xEnd, numberOfTrapezoids } = parameters;
    const deltaX = (xEnd - xStart) / numberOfTrapezoids;
    for (let i = 0; i < numberOfTrapezoids; i++) {
      const precisionFactor = Math.pow(10, this.decimals);
      const x1 = Math.round((xStart + i * deltaX) * precisionFactor) / precisionFactor;
      const x2 = Math.round((xStart + (i + 1) * deltaX) * precisionFactor) / precisionFactor;
      const y1 = Math.round(this.findClosestY(curve, x1) * precisionFactor) / precisionFactor;
      const y2 = Math.round(this.findClosestY(curve, x2) * precisionFactor) / precisionFactor;
      const dynamicLeft = { xPosition: x1, yPosition: y1 };
      const dynamicRight = { xPosition: x2, yPosition: y2 };
      const fixedLeft = { xPosition: x1, yPosition: 0 };
      const fixedRight = { xPosition: x2, yPosition: 0 };
      trapezoids.push(new Trapezoid(dynamicLeft, dynamicRight, fixedLeft, fixedRight));
    }
    return trapezoids;
  }

  /**
   * Finds the closest y-coordinate in the curve to the given x-coordinate using binary search.
   * @param curve The curve points.
   * @param x The x-coordinate to find the closest y-coordinate for.
   * @returns The closest y-coordinate.
   */
  private static findClosestY(curve: Point[], x: number): number {
    if (curve.length === 0) {
      return 0;
    }
    let left = 0;
    let right = curve.length - 1;
    while (left < right) {
      const mid = Math.floor((left + right) / 2);
      if (curve[mid].xPosition < x) {
        left = mid + 1;
      } else {
        right = mid;
      }
    }
    const closestPoint = (left > 0 && Math.abs(curve[left - 1].xPosition - x) < Math.abs(curve[left].xPosition - x))
      ? curve[left - 1]
      : curve[left];
    return closestPoint.yPosition ?? 0;
  }

}