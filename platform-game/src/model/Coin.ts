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
 * @desc Defines the coin entity as a collectible actor with a sinusoidal 
 * floating animation.
 */

import {Actor, KeyMap} from './Actor.js';
import {Vector} from '../Vector.js';
import {Level} from './Level.js';

/** @classdesc Represents a collectible coin in the game world. */
export class Coin extends Actor {
  private readonly basePosition: Vector;
  private wobble: number;
  /**
   * @desc Creates a new Coin instance at the specified position.
   * @param position - The base position where the coin should be placed
   */
  constructor(position: Vector) {
    super();
    this.basePosition = position.plus(new Vector(0.2, 0.1));
    this.position = this.basePosition;
    this.size = new Vector(0.6, 0.6);
    this.wobble = (this.basePosition.x + this.basePosition.y) % (Math.PI * 2);
    this.setType('coin');
  }

  /**
   * @desc Updates the coin's animation state for the current frame.
   * @param step - Optional time step in seconds since the last frame
   * @param level - Optional level reference (unused by coins)
   * @param keys - Optional keyboard state map (unused by coins)
   */
  act(step?: number, level?: Level, keys?: KeyMap) {
    if (step === undefined) return;
    const wobbleSpeed = 8;
    const wobbleDist = 0.07;
    this.wobble += step * wobbleSpeed;
    const wobblePosition = Math.sin(this.wobble) * wobbleDist;
    this.setPosition(this.basePosition.plus(new Vector(0, wobblePosition)));
  }
}
