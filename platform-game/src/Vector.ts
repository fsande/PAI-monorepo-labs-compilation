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
 * @desc Provides a basic 2D vector math helper for positions, velocities, and
 * scaling.
 */

/** @classdesc Represents a 2D vector with x and y components. */
export class Vector {
  /**
   * @desc Creates a new Vector instance.
   * @param x - The x-coordinate (horizontal component)
   * @param y - The y-coordinate (vertical component)
   */
  constructor(public x: number, public y: number) {}

  /**
   * @desc Adds another vector to this vector.
   * @param other - The vector to add to this one
   * @returns A new Vector representing the sum
   */
  plus(other: Vector): Vector {
    return new Vector(this.x + other.x, this.y + other.y);
  }

  /**
   * @desc Multiplies this vector by a scalar factor.
   * @param factor - The scalar value to multiply by
   * @returns A new Vector with each component multiplied by the factor
   */
  times(factor: number): Vector {
    return new Vector(this.x * factor, this.y * factor);
  }
}
