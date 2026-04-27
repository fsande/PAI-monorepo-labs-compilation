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
 * @desc Manages the game’s core state, including level loading, lives, frame
 * simulation, and model-level event wiring.
 */

import {Level} from './Level.js';
import {SoundType} from '../view/AudioManager.js';
import type {KeyMap} from './Actor.js';

/**
 * Re-export all model types so the rest of the app only needs to import from 
 * GameModel
 */
export {Level} from './Level.js';
export {Actor, ActorType, KeyMap} from './Actor.js';
export {Vector} from '../Vector.js';
export {Player} from './Player.js';
export {Coin} from './Coin.js';
export {Lava} from './Lava.js';
export {Lives} from './Lives.js';
export {Score} from './Score.js';

/** @classdesc Owns the mutable game state and exposes the minimal surface. */
export class GameModel {
  private readonly plans: string[][];
  private currentLevel: Level | null = null;
  private currentLevelIndex = 0;
  private lives: number;

  /**
   * @desc Creates a new GameModel instance.
   * @param plans - 2D array of strings representing level layouts
   * @param startingLives - Initial number of lives (default: 3)
   */
  constructor(plans: string[][], startingLives = 3) {
    this.plans = plans;
    this.lives = startingLives;
  }

  /**
   * @desc Gets the currently loaded level.
   * @returns The current Level instance
   * @throws {Error} If no level has been loaded yet
   */
  getCurrentLevel(): Level {
    if (!this.currentLevel) throw new Error('No level loaded');
    return this.currentLevel;
  }

  /**
   * @desc Gets the index of the currently loaded level.
   * @returns The current level index (0-based)
   */
  getLevelIndex(): number {
    return this.currentLevelIndex;
  }

  /**
   * @desc Gets the number of lives remaining.
   * @returns Current life count
   */
  getLives(): number {
    return this.lives;
  }

  /**
   * @desc Gets the total number of levels available.
   * @returns Total level count
   */
  getTotalLevels(): number {
    return this.plans.length;
  }

  /**
   * @desc Checks if the current level is the last level in the game.
   * @returns `true` if current level is the last level, `false` otherwise
   */
  getIsLastLevel(): boolean {
    return this.currentLevelIndex >= this.plans.length - 1;
  }

  /**
   * @desc Binds a callback function to be triggered when sound events occur.
   * @param callback - Function to call with sound type when events occur
   */
  bindSoundEvent(callback: (sound: SoundType) => void) {
    this.currentLevel!.onSoundCallback = callback;
  }

  /**
   * @desc Loads (or reloads) the level at the specified index.
   * @param index - The level index to load (0-based)
   * @returns The newly loaded Level instance
   */
  loadLevel(index: number): Level {
    this.currentLevelIndex = index;
    this.currentLevel = new Level(this.plans[index], this.lives);
    return this.currentLevel;
  }

  /**
   * @desc Reloads the current level (used when the player dies but has lives 
   * remaining).
   * @returns The reloaded Level instance
   */
  reloadCurrentLevel(): Level {
    return this.loadLevel(this.currentLevelIndex);
  }

  /**
   * @desc Advances to the next level.
   * @returns The next Level instance
   */
  loadNextLevel(): Level {
    return this.loadLevel(this.currentLevelIndex + 1);
  }

  /**
   * @desc Resets the entire game state to level 0 with full lives.
   * @param lives - Number of lives to reset to (default: 3)
   * @returns The first Level instance
   */
  reset(lives = 3): Level {
    this.lives = lives;
    const level = this.loadLevel(0);
    level.setLives(lives);
    return level;
  }

  /**
   * @desc Advances the game simulation by one frame.
   * @param step - Time step in seconds since the last frame
   * @param keys - Current state of keyboard keys being pressed
   */
  animate(step: number, keys: KeyMap): void {
    this.currentLevel!.animate(step, keys);
  }

  /** @desc Reduces the player's lives by one. */
  loseLife(): void {
    this.lives = Math.max(0, this.lives - 1);
    this.currentLevel?.setLives(this.lives);
  }

  /**
   * @desc Checks if the player has any lives remaining.
   * @returns `true` if lives are greater than 0, `false` otherwise
   */
  getHasLivesRemaining(): boolean {
    return this.lives > 0;
  }
}
