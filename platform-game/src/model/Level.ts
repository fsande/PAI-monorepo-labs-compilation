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
 * @desc Levels
 */

import {Lava} from './Lava.js';
import {Coin} from './Coin.js';
import {Lives} from './Lives.js';
import {Score} from './Score.js';
import {Player} from './Player.js';
import {Vector} from '../Vector.js';
import type {SoundType} from '../view/AudioManager.js';
import {Actor} from './Actor.js';
import type {ActorType} from './Actor.js';

export type Status = 'lost' | 'won' | null;

/** 
 * @classdesc Represents a single game level containing the game world, actors,
 * and game state. 
 */
export class Level {
  private readonly width: number;
  private readonly height: number;
  private readonly grid: ActorType[][] = [];
  private actors: Actor[] = [];
  private uiElements: Actor[] = [];
  private status: Status = null;
  private finishDelay = 0;
  private readonly player: Player;
  private readonly numberOfCoins: number;
  private numberOfCollectedCoins: number;
  onSoundCallback?: (soundType: SoundType) => void;

  private readonly ACTOR_CHARS: { [key: string]: any } = {
    '@': Player, // Player character
    'o': Coin, // Collectible coin
    '=': Lava, // Horizontal moving lava
    '|': Lava, // Vertical moving lava
    'v': Lava, // Dripping lava
  };

  /**
   * @desc Creates a new Level instance from a level plan.
   * @param levelString - Array of strings representing the level layout
   * @param lives - Number of lives the player has for this level
   */
  constructor(levelString: string[], private lives: number) {
    this.width = levelString[0].length;
    this.height = levelString.length;
    this.grid = [];
    this.actors = [];
    this.uiElements = [];
    this.status = null;

    this.fillGrid(levelString);

    this.player = this.actors
        .find((actor) => actor.getType() === 'player') as Player;
    this.numberOfCoins = this.actors
        .filter((actor) => actor.getType() === 'coin').length;
    this.numberOfCollectedCoins = 0;

    // Create lives display UI elements
    for (let i = 0, x = 0; i < this.lives; i++, x += 1.2) {
      this.uiElements.push(new Lives(new Vector(x + 1, 1)));
    }

    // Create score display UI element
    this.uiElements.push(new Score(new Vector(0, 1)));
  }

  /**
   * @desc Gets the player actor from the level.
   * @returns The player actor instance
   */
  getPlayer() {
    return this.player;
  }

  /**
   * @desc Gets the width of the level.
   * @returns Level width in grid units
   */
  getWidth() {
    return this.width;
  }

  /**
   * @desc Gets the height of the level.
   * @returns Level height in grid units
   */
  getHeight() {
    return this.height;
  }

  /**
   * @desc Gets the static grid of the level.
   * @returns 2D array representing walls and lava tiles
   */
  getGrid() {
    return this.grid;
  }

  /**
   * @desc Gets all dynamic actors in the level.
   * @returns Array of actors (player, coins, lava)
   */
  getActors() {
    return this.actors;
  }

  /**
   * @desc Gets all UI elements in the level.
   * @returns Array of UI actors (score display, lives indicators)
   */
  getUiElements() {
    return this.uiElements;
  }

  /**
   * @desc Gets the current level completion status.
   * @returns Current status (`'won'`, `'lost'`, or `null`)
   */
  getStatus() {
    return this.status;
  }

  /**
   * @desc Gets the total number of coins in the level.
   * @returns Total coin count
   */
  getNumberOfCoins() {
    return this.numberOfCoins;
  }

  /**
   * @desc Gets the number of coins collected so far.
   * @returns Collected coin count
   */
  getNumberOfCollectedCoins() {
    return this.numberOfCollectedCoins;
  }

  /**
   * @desc Gets the current number of lives.
   * @returns Current life count
   */
  getLives(): number {
    return this.lives;
  }

  /**
   * @desc Sets the current number of lives and updates the display.
   * @param newLives - New life count to set
   */
  setLives(newLives: number): void {
    this.lives = newLives;
    this.updateLivesDisplay(newLives);
  }

  /**
   * @desc Parses the level string and builds the grid and actors.
   * @param levelString - Array of strings representing the level layout
   */
  private fillGrid(levelString: string[]) {
    for (let y = 0; y < this.height; y++) {
      const line = levelString[y];
      const gridLine: ActorType[] = [] as ActorType[];
      for (let x = 0; x < this.width; x++) {
        const ch = line[x];
        let fieldType = null;
        const Actor = this.ACTOR_CHARS[ch];
        if (Actor) {
          this.actors.push(new Actor(new Vector(x, y), ch));
        } else if (ch === 'x') {
          fieldType = 'wall';
        } else if (ch === '!') {
          fieldType = 'lava';
        }
        gridLine.push(fieldType as ActorType);
      }
      this.grid.push(gridLine);
    }
  }

  /**
   * @desc Checks if a bounding box overlaps with any obstacle.
   * @param position - Position vector of the bounding box
   * @param size - Size vector of the bounding box
   * @returns The type of obstacle encountered, or empty string if none
   */
  obstacleAt(position: Vector, size: Vector): string | undefined {
    const xStart = Math.floor(position.x);
    const xEnd = Math.ceil(position.x + size.x);
    const yStart = Math.floor(position.y);
    const yEnd = Math.ceil(position.y + size.y);

    if (xStart < 0 || xEnd > this.width || yStart < 0) return 'wall';
    if (yEnd > this.height) return 'lava';

    for (let y = yStart; y < yEnd; y++) {
      for (let x = xStart; x < xEnd; x++) {
        const fieldType = this.grid[y][x];
        if (fieldType) return fieldType;
      }
    }
    return '';
  }

  /**
   * @desc Finds an actor that overlaps with the given actor.
   * @param actor - The actor to check collisions for
   * @returns The first overlapping actor, or `undefined` if none
   */
  actorAt(actor: Actor) {
    return this.actors.find((other) =>
      other !== actor && actor.overlaps(other),
    );
  }

  /**
   * @desc Updates the lives display UI elements based on current lives count.
   * @param currentLives - The current number of lives the player has
   */
  updateLivesDisplay(currentLives: number): void {
    // Remove all existing lives UI elements
    this.uiElements = this.uiElements
        .filter((element) => element.getType() !== 'lives');

    // Create new lives display UI elements
    for (let i = 0, x = 0; i < currentLives; i++, x += 1.2) {
      this.uiElements.push(new Lives(new Vector(x + 1, 1)));
    }
  }

  /**
   * @desc Updates all actors in the level for one animation frame.
   * @param step - Time step in seconds since the last frame
   * @param keys - Current state of keyboard keys being pressed
   */
  animate(step: number, keys: { [key: string]: boolean }) {
    const maxStep = 0.05;
    if (this.status !== null) {
      this.finishDelay -= step;
    }
    while (step > 0) {
      const thisStep = Math.min(step, maxStep);
      this.actors.forEach((actor) => actor.act(thisStep, this, keys));
      this.uiElements.forEach((element) => element.act(thisStep, this, keys));
      step -= thisStep;
    }
  }

  /**
   * @desc Handles player collision with other actors.
   * @param type - Type of actor touched ('lava', 'coin', etc.)
   * @param actor - Optional reference to the touched actor
   */
  playerTouched(type: string, actor?: Actor) {
    if (type === 'lava' && this.status === null) {
      this.onSoundCallback?.('die');
      this.status = 'lost';
      this.finishDelay = 1;
    } else if (type === 'coin') {
      this.onSoundCallback?.('coin');

      this.numberOfCollectedCoins += 1;
      this.actors = this.actors.filter((other) => other !== actor);
      if (this.numberOfCoins === this.numberOfCollectedCoins) {
        this.onSoundCallback?.('levelClear');
        this.status = 'won';
        this.finishDelay = 1;
      }
    }
  }

  /**
   * @desc Checks if the level has finished and is ready to transition.
   * @returns `true` if level is finished and delay has elapsed, `false` 
   * otherwise
   */
  isFinished() {
    return this.status !== null && this.finishDelay < 0;
  }
}
