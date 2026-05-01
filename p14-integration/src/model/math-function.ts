/**
 * Universidad de La Laguna
 * Escuela Superior de Ingeniería y Tecnología
 * Grado en Ingeniería Informática
 * Programación de Aplicaciones Interactivas 2024-2025
 *
 * @author Eric Ríos Hamilton
 * @since Mar 28 2025
 * @desc MathFunction interface
 *
 */

export interface MathFunction {
  evaluate: (xValue: number) => number;
}