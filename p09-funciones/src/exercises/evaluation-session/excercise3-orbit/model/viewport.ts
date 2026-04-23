/**
 * Universidad de La Laguna
 * Escuela Superior de Ingeniería y Tecnología
 * Grado en Ingeniería Informática
 * Programación de Aplicaciones Interactivas
 *
 * @author Daniel Martínez
 * @since Apr 07 2026
 * @description Class representing the visible mathematical region of the plane.
 */

/**
 * Represents the mathematical region visible on the canvas.
 */
export class Viewport {
  /**
   * Creates a viewport with its horizontal and vertical bounds.
   * @param minimumHorizontalValue Minimum visible horizontal value.
   * @param maximumHorizontalValue Maximum visible horizontal value.
   * @param minimumVerticalValue Minimum visible vertical value.
   * @param maximumVerticalValue Maximum visible vertical value.
   */
  constructor(
    private readonly minimumHorizontalValue: number,
    private readonly maximumHorizontalValue: number,
    private readonly minimumVerticalValue: number,
    private readonly maximumVerticalValue: number,
  ) {}

  /**
   * Returns the minimum visible horizontal value.
   * @returns Minimum visible horizontal value.
   */
  getMinimumHorizontalValue(): number {
    return this.minimumHorizontalValue;
  }

  /**
   * Returns the maximum visible horizontal value.
   * @returns Maximum visible horizontal value.
   */
  getMaximumHorizontalValue(): number {
    return this.maximumHorizontalValue;
  }

  /**
   * Returns the minimum visible vertical value.
   * @returns Minimum visible vertical value.
   */
  getMinimumVerticalValue(): number {
    return this.minimumVerticalValue;
  }

  /**
   * Returns the maximum visible vertical value.
   * @returns Maximum visible vertical value.
   */
  getMaximumVerticalValue(): number {
    return this.maximumVerticalValue;
  }

  /**
   * Returns the visible mathematical width.
   * @returns Difference between maximum and minimum horizontal values.
   */
  getHorizontalRange(): number {
    return this.maximumHorizontalValue - this.minimumHorizontalValue;
  }

  /**
   * Returns the visible mathematical height.
   * @returns Difference between maximum and minimum vertical values.
   */
  getVerticalRange(): number {
    return this.maximumVerticalValue - this.minimumVerticalValue;
  }
}