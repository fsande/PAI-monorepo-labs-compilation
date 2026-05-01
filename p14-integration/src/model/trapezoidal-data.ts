/**
 * Universidad de La Laguna
 * Escuela Superior de Ingeniería y Tecnología
 * Grado en Ingeniería Informática
 * Programación de Aplicaciones Interactivas 2024-2025
 *
 * @author Eric Rios Hamilton
 * @since May 1, 2025
 * @description TrapezoidalData interface for the Trapezoidal Rule Calculator
 *
 */

import { Point } from './point.ts';
import { Trapezoid } from './trapezoid.ts';
import { TrapezoidalUpdate } from './trapezoidal-update.ts';

export interface TrapezoidalData {
  curvePoints: Point[];
  trapezoids: Trapezoid[];
  update: TrapezoidalUpdate;
}