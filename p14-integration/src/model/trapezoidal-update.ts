/**
 * Universidad de La Laguna
 * Escuela Superior de Ingeniería y Tecnología
 * Grado en Ingeniería Informática
 * Programación de Aplicaciones Interactivas 2024-2025
 *
 * @author Eric Rios Hamilton
 * @since May 1, 2025
 * @description TrapezoidalUpdate interface for the Trapezoidal Rule Calculator
 *
 */

export interface TrapezoidalUpdate {
  expression: string;
  numberOfTrapezoids: number;
  xStart: number;
  xEnd: number;
}
