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
 * @desc Defines the UI actor that represents remaining lives with a 
 * lightweight wobble animation.
 */

import {Actor} from './Actor.js';
import type {KeyMap} from './Actor.js';
import {Level} from './Level.js';
import {Vector} from '../Vector.js';

/** 
 * @classdesc Represents a UI element that displays the player's remaining 
 * lives. 
 */
export class Lives extends Actor {
  private readonly basePosition: Vector;
  private wobble: number;

  /**
   * @desc Creates a new Lives UI element at the specified position.
   * @param position - The position vector where the life indicator should be 
   * placed
   */
  constructor(position: Vector) {
    super();
    this.basePosition = position;
    this.position = position;
    this.size = new Vector(1, 1);
    this.type = 'lives';
    this.wobble = (this.basePosition.x + this.basePosition.y) % (Math.PI * 2);
  }

  /**
   * @desc Updates the Lives UI element with a subtle floating animation.
   * @param step - Optional time step in seconds since the last frame
   * @param level - Optional level reference (unused by lives)
   * @param keys - Optional keyboard state map (unused by lives)
   */
  act(step?: number, _level?: Level, _keys?: KeyMap): void {
    if (step === undefined) return;
    const wobbleSpeed = 5;
    const wobbleDist = 0.04;
    this.wobble += step * wobbleSpeed;
    const wobbleOffset = Math.sin(this.wobble) * wobbleDist;
    this.setPosition(this.basePosition.plus(new Vector(0, wobbleOffset)));
  }
}
