/**
 * Universidad de La Laguna
 * Escuela Superior de Ingeniería y Tecnología
 * Grado en Ingeniería Informática
 * Programación de Aplicaciones Interactivas 2025-2026
 *
 * @author Sergio Rosales Calzadilla alu010635590@ull.edu.es
 * @since Apr 19 2026
 * @desc LissajousCurveModel class.
 * Manages the state of the simulation.
 */

import { LissajousCurve } from './lissajous-curve.js';

export class LissajousCurveModel {
  private readonly DEFAULT_A: number = 7;
  private readonly DEFAULT_B: number = 6;
  private readonly DEFAULT_AMP_A: number = 100;
  private readonly DEFAULT_AMP_B: number = 100;
  private readonly DEFAULT_PHASE: number = 0.66;
  private readonly PHASE_SPEED: number = 0.5;
  private readonly PHASE_LIMIT: number = 2.0;

  private curve: LissajousCurve;
  private isAnimating: boolean = false;

  constructor() {
    this.curve = new LissajousCurve( this.DEFAULT_A, this.DEFAULT_B, this.DEFAULT_AMP_A, this.DEFAULT_AMP_B, this.DEFAULT_PHASE);
  }

  /**
   * @description Updates the phase of the curve if animation is active.
   * @param deltaTime Elapsed time.
   */
  update(deltaTime: number): void {
    if (this.isAnimating) {
      const nextPhase = this.curve.getPhase() + (this.PHASE_SPEED * deltaTime);
      this.curve.setPhase(nextPhase % this.PHASE_LIMIT);
    }
  }

  getCurve(): LissajousCurve { return this.curve; }
  
  setAnimationState(state: boolean): void { this.isAnimating = state; }
  
  getAnimationState(): boolean { return this.isAnimating; }
}