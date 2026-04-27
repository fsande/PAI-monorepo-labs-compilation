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
 * @desc Handles full-frame game rendering on HTML5 Canvas, including viewport
 * updates, tile/background drawing, actor and player animation, and UI 
 * rendering.
 */

import {Vector} from '../Vector.js';
import type {Status} from '../model/Level.js';
import type {ActorView} from './ActorView.js';
import type {PlayerView} from './PlayerView.js';
import type {ActorType} from '../model/Actor.js';

/**
 * @desc Aggregated frame rendering data containing all information required to
 * render a single game frame.
 * Used to reduce method parameter count and improve code clarity in the 
 * rendering pipeline.
 */
export interface DrawFrameData {
  step: number;
  center: Vector;
  worldWidth: number;
  worldHeight: number;
  actors: ActorView[];
  uiElements: ActorView[];
  playerView: PlayerView;
  numberOfCoins: number;
  numberOfCollectedCoins: number;
  status: Status;
  grid: ActorType[][];
}

/** 
 * @classdesc Handles all canvas-based rendering for the game using the HTML5 
 * Canvas API.
 */
export class CanvasDisplay {
  private readonly scale = 20;
  private animationTime = 0;
  private flipPlayer = false;
  private readonly context;
  private readonly viewport;
  private readonly otherSprites;
  private readonly playerSprite;
  private readonly livesSprite;

  /**
   * @desc Creates a new CanvasDisplay instance.
   * @param canvas - The HTML canvas element to render on
   * @param width - World width in grid units
   * @param height - World height in grid units
   */
  constructor(private readonly canvas: HTMLCanvasElement, width: number, height: number) {
    this.context = this.canvas.getContext('2d')!;
    this.canvas.width = Math.min(800, width * this.scale);
    this.canvas.height = Math.min(550, height * this.scale);
    this.viewport = {
      left: 0,
      top: 0,
      width: this.canvas.width / this.scale,
      height: this.canvas.height / this.scale,
    };
    this.otherSprites = document.createElement('img');
    this.otherSprites.src = '/assets/img/sprites.png';
    this.playerSprite = document.createElement('img');
    this.playerSprite.src = '/assets/img/player.png';
    this.livesSprite = document.createElement('img');
    this.livesSprite.src = '/assets/img/lives.png';
  }

  /**
   * @desc Updates the viewport position to follow the player.
   * @param center - The position to center the view on (typically the player)
   * @param worldWidth - Total width of the game world in grid units
   * @param worldHeight - Total height of the game world in grid units
   */
  updateViewport(center: Vector, worldWith: number, worldHeight: number) {
    const viewport = this.viewport;
    const margin = viewport.width / 3;

    if (center.x < viewport.left + margin) {
      viewport.left = Math.max(center.x - margin, 0);
    } else if (center.x > viewport.left + viewport.width - margin) {
      viewport.left = Math.min(
        center.x + margin - viewport.width, 
        worldWith - viewport.width
      );
    }
    if (center.y < viewport.top + margin) {
      viewport.top = Math.max(center.y - margin, 0);
    } else if (center.y > viewport.top + viewport.height - margin) {
      viewport.top = Math.min(
        center.y + margin - viewport.height,
        worldHeight - viewport.height
      );
    }
  }

  /**
   * @desc Clears the canvas and fills with background color based on game
   * status.
   * @param status - Current level status (won, lost, or null)
   */
  clearDisplay(status: Status) {
    if (status === 'won') {
      this.context.fillStyle = 'rgb(68, 191, 255)';
    } else if (status === 'lost') {
      this.context.fillStyle = 'rgb(44, 136, 214)';
    } else {
      this.context.fillStyle = 'rgb(52, 166, 251)';
    }
    this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
  }

  /**
   * @desc Draws the background tiles (walls, lava floors) visible in the
   * viewport.
   * @param grid - 2D array representing the level's static tiles
   */
  drawBackground(grid: ActorType[][]) {
    const xStart = Math.floor(this.viewport.left);
    const xEnd = Math.ceil(this.viewport.left + this.viewport.width);
    const yStart = Math.floor(this.viewport.top);
    const yEnd = Math.ceil(this.viewport.top + this.viewport.height);

    for (let y = yStart; y < yEnd; y++) {
      for (let x = xStart; x < xEnd; x++) {
        const tile = grid[y]?.[x];
        if (!tile) continue;
        const screenPosition = this.worldToCanvas(new Vector(x, y));
        const tileX = tile === 'lava' ? this.scale : 0;
        this.context.drawImage(
            this.otherSprites,
            tileX, 0,
            this.scale, this.scale,
            screenPosition.x,
            screenPosition.y,
            this.scale,
            this.scale,
        );
      }
    }
  }

  /**
   * @desc Converts world coordinates to canvas pixel coordinates.
   * @param position - World position vector (in grid units)
   * @returns Screen position vector (in pixels)
   */
  worldToCanvas(position: Vector): Vector {
    return new Vector(
        (position.x - this.viewport.left) * this.scale,
        (position.y - this.viewport.top) * this.scale,
    );
  }

  /**
   * @desc Flips the canvas context horizontally for mirroring the player 
   * sprite.
   * @param context - Canvas rendering context to transform
   * @param around - X-coordinate (in pixels) to flip around
   */
  flipHorizontally(context: CanvasRenderingContext2D, around: number) {
    context.translate(around, 0);
    context.scale(-1, 1);
    context.translate(-around, 0);
  }

  /**
   * @desc Draws the player character with animation and facing direction.
   * @param player - Player view data containing position, size, and speed
   */
  drawPlayer(player: PlayerView) {
    const playerXOverlap = 4;
    let sprite = 8;

    let x = this.worldToCanvas(player.position).x;
    const y = this.worldToCanvas(player.position).y;

    let width = player.size.x * this.scale;
    const height = player.size.y * this.scale;

    width += playerXOverlap * 2;
    x -= playerXOverlap;

    if (player.speed.x !== 0) this.flipPlayer = player.speed.x < 0;

    if (player.speed.y !== 0) {
      sprite = 9;
    } else if (player.speed.x !== 0) {
      sprite = Math.floor(this.animationTime * 12) % 8;
    }

    this.context.save();

    if (this.flipPlayer) {
      this.flipHorizontally(this.context, x + width / 2);
    }

    this.context.drawImage(
        this.playerSprite,
        sprite * width,
        0,
        width,
        height,
        x,
        y,
        width,
        height,
    );

    this.context.restore();
  }

  /**
   * @desc Draws all dynamic actors (coins, lava) and UI elements (score, 
   * lives).
   * @param actors - Array of dynamic actors to draw
   * @param uiElements - Array of UI elements to draw
   * @param numberOfCoins - Total coins in the level
   * @param numberOfCollectedCoints - Coins collected so far
   */
  drawActors(
      actors: ActorView[],
      uiElements: ActorView[],
      numberOfCoins: number,
      numberOfCollectedCoints: number,
  ) {
    const sprites = this.otherSprites;

    actors.forEach((actor: ActorView) => {
      const width = actor.size.x * this.scale;
      const height = actor.size.y * this.scale;

      const worldPosition = actor.position;
      const screenPosition = this.worldToCanvas(worldPosition);
      const tileX = (actor.type === 'coin' ? 2 : 1) * this.scale;
      if (actor.type === 'player') return;
      this.context.drawImage(
          sprites,
          tileX,
          0,
          width,
          height,
          screenPosition.x,
          screenPosition.y,
          width,
          height,
      );
    });

    uiElements.forEach((actor: ActorView) => {
      const width = actor.size.x * this.scale;
      const height = actor.size.y * this.scale;

      const x = actor.position.x * this.scale;
      const y = actor.position.y * this.scale;

      if (actor.type === 'lives') {
        this.context.drawImage(
          this.livesSprite,
          0,
          0,
          width,
          height,
          x,
          y, 
          width,
          height
        );
      } else if (actor.type === 'score') {
        this.context.font = '24px Monospace';
        this.context.fillStyle = 'white';
        this.context.shadowColor = 'lightgrey';

        this.context.strokeText(
            `${numberOfCollectedCoints}/${numberOfCoins}`,
            x + this.context.canvas.clientWidth - this.scale * 4,
            y + this.scale,
        );

        this.context.fillText(
            `${numberOfCollectedCoints}/${numberOfCoins}`,
            x + this.context.canvas.clientWidth - this.scale * 4,
            y + this.scale,
        );
      }
    });
  }

  /**
   * @desc Renders a complete frame of the game with viewport, actors, UI, and 
   * background.
   * @param frameData - Aggregated frame rendering data containing all 
   * required game state and view information.
   */
  drawFrame(frameData: DrawFrameData) {
    this.animationTime += frameData.step;
    this.updateViewport(
      frameData.center,
      frameData.worldWidth,
      frameData.worldHeight
    );
    this.clearDisplay(frameData.status);
    this.drawBackground(frameData.grid);
    this.drawActors(
      frameData.actors,
      frameData.uiElements,
      frameData.numberOfCoins,
      frameData.numberOfCollectedCoins
    );
    this.drawPlayer(frameData.playerView);
  }
}
