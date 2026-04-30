/**
 * Universidad de La Laguna
 * Escuela Superior de Ingenieria y Tecnologia
 * Grado en Ingenieria Informatica
 * Programacion de Aplicaciones Interactivas
 *
 * @author Pablo Hernandez Jimenez
 * @since Apr 29, 2026
 * @description Compiles user expressions into mathjs evaluators.
 */

import { compile } from 'mathjs';

/**
 * Defines the function produced by the expression compiler.
 */
export type FunctionEvaluator = (x: number) => number;

/**
 * Compiles one mathematical expression that may reference `x`.
 *
 * @param expression - Raw expression typed by the user.
 * @returns A callable function evaluator.
 * @throws When the expression is empty, invalid, or not finite for a sampled point.
 */
export function compileFunctionExpression(expression: string): FunctionEvaluator {
  const normalizedExpression = normalizeExpression(expression);
  const compiledExpression = compile(normalizedExpression);

  return (x: number): number => {
    const result = compiledExpression.evaluate({ x });

    if (typeof result !== 'number' || !Number.isFinite(result)) {
      throw new Error('The expression must evaluate to a finite numeric value inside the interval.');
    }

    return result;
  };
}

/**
 * Normalizes a user expression before passing it to mathjs.
 *
 * @param expression - Raw expression text.
 * @returns Normalized expression text.
 * @throws When the expression is empty.
 */
function normalizeExpression(expression: string): string {
  const trimmedExpression = expression.trim();

  if (trimmedExpression.length === 0) {
    throw new Error('Write a function expression.');
  }

  return trimmedExpression.replace(/\^/gu, '^');
}
