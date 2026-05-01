/**
 * Universidad de La Laguna
 * Escuela Superior de Ingeniería y Tecnología
 * Grado en Ingeniería Informática
 * Programación de Aplicaciones Interactivas 2024-2025
 *
 * @author Eric Ríos Hamilton
 * @since Mar 28 2025
 * @desc MathJsFunction class
 *
 */

import { MathFunction } from './math-function.ts';
import { create, all, EvalFunction } from 'mathjs';

const math = create(all);

export class MathJsFunction implements MathFunction {
  private compiledExpression: EvalFunction;

  constructor(expression: string) {
    this.compiledExpression = math.compile(expression);
  }
  
  /**
   * Evaluates the expression with the given value of x.
   * @param xValue The value of x to evaluate the expression with.
   * @returns The evaluated result of the expression.
   */
  evaluate(xValue: number): number {
    return this.compiledExpression.evaluate({ x: xValue });
  }
}