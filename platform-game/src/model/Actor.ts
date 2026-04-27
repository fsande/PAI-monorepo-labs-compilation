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
 * @desc Provides the core actor abstraction with shared state, collision 
 * checks, and the update interface for all game entities.
 */

import {Level} from './Level.js';
import {Vector} from '../Vector.js';


export type ActorType = 'player' | 'coin' | 'lava' | 'score' | 'lives' | '';
export type KeyMap = { [key: string]: boolean };

/** @classdesc Provides common functionality for all game actors. */
export abstract class Actor {
  protected position: Vector = new Vector(0, 0);
  protected size: Vector = new Vector(0, 0);
  protected type: ActorType = '';

  /**
   * @desc Updates the actor's behavior for the current animation frame.
    * @param step - Optional time step in seconds since the last frame
    * @param level - Optional reference to the current level containing game 
    * state
    * @param keys - Optional current state of keyboard keys being pressed
   */
  abstract act(step?: number, level?: Level, keys?: KeyMap): void;

  /**
   * @desc Gets the type of this actor.
   * @returns The actor's type (e.g., 'player', 'coin', 'lava')
   */
  getType(): ActorType {
    return this.type;
  }

  /**
   * @desc ets the position of the actor.
   * @param pos - The new position vector
   */
  protected setPosition(pos: Vector): void {
    this.position = pos;
  }

  /**
   * @desc Sets the size (dimensions) of the actor.
   * @param size - The new size vector
   */
  protected setSize(size: Vector): void {
    this.size = size;
  }

  /**
   * @desc Sets the type of the actor.
   * @param type - The new actor type
   */
  protected setType(type: ActorType): void {
    this.type = type;
  }

  /**
   * @desc Checks if this actor overlaps with another actor.
   * @param other - The other actor to check collision against
   * @returns `true` if the actors' bounding boxes intersect, `false` otherwise
   */
  overlaps(other: Actor): boolean {
    return (
      this.position.x + this.size.x > other.getPosition().x &&
      this.position.x < other.getPosition().x + other.getSize().x &&
      this.position.y + this.size.y > other.getPosition().y &&
      this.position.y < other.getPosition().y + other.getSize().y
    );
  }

  /**
   * @desc Gets the current position of the actor.
   * @returns The position vector of the actor
   */
  getPosition() {
    return this.position;
  }

  /**
   * @desc Gets the current size (dimensions) of the actor.
   * @returns The size vector of the actor
   */
  getSize() {
    return this.size;
  }
}
