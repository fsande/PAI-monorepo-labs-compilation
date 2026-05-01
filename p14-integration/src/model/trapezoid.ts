/**
 * Universidad de La Laguna
 * Escuela Superior de Ingeniería y Tecnología
 * Grado en Ingeniería Informática
 * Programación de Aplicaciones Interactivas 2024-2025
 *
 * @author Eric Rios Hamilton
 * @since May 1, 2025
 * @description Trapezoid class representing a trapezoid in 2D space.
 *
 */

import { Point } from './point.ts';

export class Trapezoid {
  private static readonly decimals = 3;
  public readonly area: number
  public readonly points: Point[] = [];
  constructor(
    public readonly dynamicLeft: Point,
    public readonly dynamicRight: Point,
    public readonly fixedLeft: Point,
    public readonly fixedRight: Point,
  ) {
    this.area = this.calculateArea();
    this.points.push(this.dynamicLeft, this.dynamicRight, this.fixedLeft, this.fixedRight);
  }

  /**
   * Calculates the area of the trapezoid using the formula:
   * @returns The area of the trapezoid, rounded to a specified number of decimal places.
   */
  private calculateArea(): number {
    const height1 = this.dynamicLeft.yPosition - this.fixedLeft.yPosition;
    const height2 = this.dynamicRight.yPosition - this.fixedRight.yPosition;
    const width = this.dynamicRight.xPosition - this.dynamicLeft.xPosition;
    const precisionFactor = Math.pow(10, Trapezoid.decimals);
    return Math.sign(0.5 * (height1 + height2) * width) * 
         Math.round(Math.abs(0.5 * (height1 + height2) * width) * precisionFactor) / precisionFactor;
  }
}