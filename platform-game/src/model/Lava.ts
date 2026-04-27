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
 * @desc Defines the lava enemy/hazard logic with pattern-based movement and 
 * obstacle collision handling.
 */

import {Actor} from './Actor.js';
import type {KeyMap} from './Actor.js';
import {Level} from './Level.js';
import {Vector} from '../Vector.js';

/** @classdesc Represents a hazardous lava element in the game world. */
export class Lava extends Actor {
  private speed: Vector;
  private readonly repeatPosition: Vector;

  /**
   * @desc Creates a new Lava instance at the specified position with the 
   * given type.
   * @param position - The initial position of the lava
   * @param char - The character representing lava type
   */
  constructor(position: Vector, char: string) {
    super();
    this.position = position;
    this.size = new Vector(1, 1);
    if (char === '=') {
      this.speed = new Vector(2, 0);
      this.repeatPosition = new Vector(0, 0);
    } else if (char === '|') {
      this.speed = new Vector(0, 2);
      this.repeatPosition = new Vector(0, 0);
    } else if (char === 'v') {
      this.speed = new Vector(0, 3);
      this.repeatPosition = this.getPosition();
    } else {
      this.speed = new Vector(0, 0);
      this.repeatPosition = new Vector(0, 0);
    }
    this.setType('lava');
  }

  /**
   * @desc Updates the lava's position based on its movement pattern.
   * @param step - Optional time step in seconds since the last frame
   * @param level - Optional level reference for collision detection
   * @param keys - Optional keyboard state map (unused by lava)
   */
  act(step?: number, level?: Level, _keys?: KeyMap) {
    if (step === undefined || level === undefined) return;
    const newPos = this.getPosition().plus(this.speed.times(step));
    if (!level.obstacleAt(newPos, this.getSize())) {
      this.position = newPos;
    } else if (this.repeatPosition && this.speed.y > 0) {
      this.position = this.repeatPosition;
    } else {
      this.speed = this.speed.times(-1);
    }
  }
}
