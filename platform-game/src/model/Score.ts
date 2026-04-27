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
 * @desc Defines the UI score actor, including update logic for score-increase
 * animation feedback.
 */

import {Actor} from './Actor.js';
import type {KeyMap} from './Actor.js';
import {Vector} from '../Vector.js';
import {Level} from './Level.js';

/** 
 * @classdesc Represents a UI element that displays the player's current 
 * score. 
 */
export class Score extends Actor {
  private animationTimer = 0;
  private isAnimating = false;

  /**
   * @desc Creates a new Score UI element at the specified position.
   * @param position - The position vector where the score display should be
   * placed.
   */
  constructor(position: Vector) {
    super();
    this.position = position;
    this.size = new Vector(1, 1);
    this.type = 'score';
  }

  /**
   * @desc Updates the Score UI element's animation state.
   * @param step - Optional time step in seconds since the last frame
   * @param level - Optional level reference (unused by score)
   * @param keys - Optional keyboard state map (unused by score)
   */
  act(step?: number, _level?: Level, _keys?: KeyMap): void {
    if (this.isAnimating && step) {
      this.animationTimer += step;
      if (this.animationTimer >= 0.3) {
        this.isAnimating = false;
        this.animationTimer = 0;
      }
    }
  }

  /** @desc Triggers a visual effect when the score increases. */
  onScoreIncrease(): void {
    this.isAnimating = true;
    this.animationTimer = 0;
  }

  /**
   * @desc Checks if the score increase animation is currently playing.
   * @returns `true` if animation is active, `false` otherwise
   */
  isAnimatingScore(): boolean {
    return this.isAnimating;
  }

  /**
   * @desc Gets the animation progress (0 to 1).
   * @returns Animation progress where 0 = start, 1 = complete
   */
  getAnimationProgress(): number {
    if (!this.isAnimating) return 0;
    return Math.min(1, this.animationTimer / 0.3);
  }
}
