/**
 * Universidad de La Laguna
 * Escuela Superior de Ingeniería y Tecnología
 * Grado en Ingeniería Informática
 * Programación de Aplicaciones Interactivas 2025-2026
 *
 * @author Sergio Rosales Calzadilla alu010635590@ull.edu.es
 * @since Apr 19 2026
 * @desc LissajousCurve class.
 * Represents the mathematical definition of a Lissajous curve.
 */

export class LissajousCurve {
  private readonly FULL_CIRCLE_RADIANS: number = 2 * Math.PI;
  private readonly RESOLUTION_FACTOR: number = 1000;

  constructor(
    private frequencyA: number,
    private frequencyB: number,
    private amplitudeA: number,
    private amplitudeB: number,
    private phase: number
  ) {}

  /**
   * @description Calculates the (x, y) coordinates for a given time t.
   * @param time The parameter t for the parametric equations.
   * @returns An object containing the x and y coordinates.
   */
  getPointAt(time: number): { x: number; y: number } {
    const positionX = this.amplitudeA * Math.sin(this.frequencyA * time + this.phase);
    const positionY = this.amplitudeB * Math.sin(this.frequencyB * time);
    return { x: positionX, y: positionY };
  }

  /**
   * @description Generates a list of points to draw the complete curve.
   * @returns Array of coordinate objects.
   */
  generatePoints(): { x: number; y: number }[] {
    const points: { x: number; y: number }[] = [];
    const step = this.FULL_CIRCLE_RADIANS / this.RESOLUTION_FACTOR;
    for (let time = 0; time <= this.FULL_CIRCLE_RADIANS; time += step) {
      points.push(this.getPointAt(time));
    }
    return points;
  }

  setFrequencyA(value: number): void { this.frequencyA = value; }
  setFrequencyB(value: number): void { this.frequencyB = value; }
  setAmplitudeA(value: number): void { this.amplitudeA = value; }
  setAmplitudeB(value: number): void { this.amplitudeB = value; }
  setPhase(value: number): void { this.phase = value; }
  getPhase(): number { return this.phase; }
}