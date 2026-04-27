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
 * @desc Defines the player entity logic: movement, gravity, jumping, 
 * collisions, and frame-by-frame behavior updates.
 */

import {Level} from './Level.js';
import {Actor} from './Actor.js';
import type {KeyMap} from './Actor.js';
import {Vector} from '../Vector.js';

/** @classdesc Represents the playable character in the game. */
export class Player extends Actor {
  private readonly speed: Vector;

  /**
   * @desc Creates a new Player instance at the specified tile position.
   * @param position - The tile position where the player should be placed
   */
  constructor(position: Vector) {
    super();
    this.position = position.plus(new Vector(0, -0.5));
    this.size = new Vector(0.8, 1.5);
    this.speed = new Vector(0, 0);
    this.type = 'player';
  }

  /**
   * @desc Handles horizontal movement and collision detection.
   * @param step - Time step in seconds since the last frame
   * @param level - Reference to the current level for collision detection
   * @param keys - Current state of keyboard keys (left/right arrows)
   */
  moveX(step: number, level: Level, keys: { [key: string]: boolean }) {
    const playerXSpeed = 7;
    this.speed.x = 0;
    if (keys.left) this.speed.x -= playerXSpeed;
    if (keys.right) this.speed.x += playerXSpeed;
    const motion = new Vector(this.speed.x * step, 0);
    const newPosition = this.getPosition().plus(motion);
    const obstacle = level.obstacleAt(newPosition, this.getSize());
    if (obstacle) {
      level.playerTouched(obstacle);
    } else {
      this.setPosition(newPosition);
    }
  }

  /**
   * @desc Handles vertical movement, gravity, jumping, and collision detection.
   * @param step - Time step in seconds since the last frame
   * @param level - Reference to the current level for collision detection
   * @param keys - Current state of keyboard keys (up arrow for jumping)
   */
  moveY(step: number, level: Level, keys: { [key: string]: boolean }) {
    const gravity = 30;
    const jumpSpeed = 17;
    this.speed.y += step * gravity;
    const motion = new Vector(0, this.speed.y * step);
    const newPosition = this.getPosition().plus(motion);
    const obstacle = level.obstacleAt(newPosition, this.getSize());
    if (obstacle) {
      level.playerTouched(obstacle);
      if (keys.up && this.speed.y > 0) {
        this.speed.y -= jumpSpeed;
        level.onSoundCallback?.('jump');
      } else {
        this.speed.y = 0;
      }
    } else {
      this.position = newPosition;
    }
  }

  /**
   * @desc Updates the player's state for one animation frame.
    * @param step - Optional time step in seconds since the last frame
    * @param level - Optional reference to the current level
    * @param keys - Optional current state of keyboard keys being pressed
   */
  act(step?: number, level?: Level, keys?: KeyMap) {
    if (step === undefined || level === undefined || keys === undefined) return;
    this.moveX(step, level, keys);
    this.moveY(step, level, keys);

    const otherActor = level.actorAt(this);
    if (otherActor) {
      level.playerTouched(otherActor.getType(), otherActor);
    }

    // Losing animation
    if (level.getStatus() === 'lost') {
      const position = this.getPosition();
      position.y += step;
      this.setPosition(position);

      const size = this.getSize();
      size.y = Math.max(0, size.y - step);
      this.setSize(size);
    }
  }

  /**
   * @desc Gets the player's current velocity vector.
   * @returns The player's speed vector (x = horizontal velocity, y = vertical
   * velocity)
   */
  getSpeed() {
    return this.speed;
  }
}
