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
 * @desc Coordinates the game flow between model and view, handling input, 
 * animation frames, level progression, and sound playback.
 */

import {Actor, GameModel, KeyMap} from '../model/GameModel.js';
import {ActorView} from '../view/ActorView.js';
import {PlayerView} from '../view/PlayerView.js';
import {AudioManager, SoundType} from '../view/AudioManager.js';
import {GameView} from '../view/GameView.js';

/** @classdesc Acts as the central controller in an MVC architecture. */
export class GameController {
  private readonly model: GameModel;
  private readonly view: GameView;
  private lastTime: number | null = null;
  private animationFrameId: number | null = null;
  private readonly keys: KeyMap = Object.create(null);
  private keyHandlerCleanup: (() => void) | null = null;
  private static readonly KEY_MAP: Record<string, string> = {
    'Escape': 'esc',       // Escape key
    'ArrowLeft': 'left',   // Left arrow key
    'ArrowUp': 'up',       // Up arrow key
    'ArrowRight': 'right', // Right arrow key
  };
  private readonly audioManager: AudioManager;

  /**
   * @desc Creates a new game controller instance.
   * @param model - Game model instance
   * @param view - Game view instance
   */
  constructor(model: GameModel, view: GameView) {
    this.model = model;
    this.view = view;

    this.setupKeyTracking();

    this.audioManager = new AudioManager();
    globalThis.addEventListener('keydown', () => {
      this.audioManager.playBackground();
    }, {once: true});
  }

  /** @desc Starts the game from level 0 with initial lives. */
  start(): void {
    this.startLevel(0, 3);
  }

  /** @desc Tears down the game controller and releases resources. */
  destroy(): void {
    this.stopAnimation();
    this.view.unmount();
    this.keyHandlerCleanup?.();
  }

  /**
   * @desc Starts a specific level with the given number of lives.
   * @param index - Level index to start (0-based)
   * @param lives - Number of lives to start with
   */
  private startLevel(index: number, lives: number): void {
    this.stopAnimation();
    const level = this.model.reset(lives); // resets lives counter to `lives`
    // reset() always goes to index 0; for other indices use loadLevel directly
    const currentLevel = index === 0 ? level : this.model.loadLevel(index);
    this.model.bindSoundEvent((soundType: SoundType) => {
      this.audioManager.play(soundType);
    });
    this.view.mount(currentLevel.getWidth(), currentLevel.getHeight());
    this.runAnimation();
  }

  /**
   * @desc Handles level completion (win or loss).
   * @param status - Completion status ('won' or 'lost')
   */
  private onLevelFinished(status: string): void {
    this.view.unmount();
    if (status === 'lost') {
      this.model.loseLife();
      if (!this.model.getHasLivesRemaining()) {
        this.audioManager.play('gameOver');
        // Game over → restart from level 0 with 3 lives
        setTimeout(() => this.startLevel(0, 3), 0);
        return;
      }
      // Retry same level with one fewer life
      const level = this.model.reloadCurrentLevel();
      level.setLives(this.model.getLives());
      this.view.mount(level.getWidth(), level.getHeight());
      this.runAnimation();
      return;
    }
    if (this.model.getIsLastLevel()) {
      this.audioManager.play('levelClear');
      setTimeout(() => this.startLevel(0, 3), 0);
      return;
    }
    const level = this.model.loadNextLevel();
    this.view.mount(level.getWidth(), level.getHeight());
    this.runAnimation();
  }

  /** @desc Starts the main animation loop using requestAnimationFrame. */
  private runAnimation(): void {
    this.lastTime = null;

    const frame = (time: number) => {
      if (this.lastTime === null) {
          this.lastTime = time;
          this.animationFrameId = requestAnimationFrame(frame);
          return;
      }
      const step = Math.min(time - this.lastTime, 100) / 1000;

      if (this.keys['esc']) {
        this.lastTime = time; 
        this.animationFrameId = requestAnimationFrame(frame);
        return;
      }

      this.model.animate(step, this.keys);
      const currentLevel = this.model.getCurrentLevel();

      const actorsView: ActorView[] = currentLevel.getActors()
          .map((actor: Actor) => ({
            type: actor.getType(),
            position: actor.getPosition(),
            size: actor.getSize(),
          }));

      const uiElementsView: ActorView[] = currentLevel.getUiElements()
          .map((actor: Actor) => ({
            type: actor.getType(),
            position: actor.getPosition(),
            size: actor.getSize(),
          }));
      const playerView: PlayerView = {
        position: currentLevel.getPlayer().getPosition(),
        size: currentLevel.getPlayer().getSize(),
        speed: currentLevel.getPlayer().getSpeed(),
      };
      this.view.drawFrame({
        step,
        center: currentLevel.getPlayer().getPosition(),
        actors: actorsView,
        uiElements: uiElementsView,
        playerView,
        worldWidth: currentLevel.getWidth(),
        worldHeight: currentLevel.getHeight(),
        numberOfCoins: currentLevel.getNumberOfCoins(),
        numberOfCollectedCoins: currentLevel.getNumberOfCollectedCoins(),
        status: currentLevel.getStatus(),
        grid: currentLevel.getGrid(),
      });

      const status = currentLevel.getStatus();
      if (currentLevel.isFinished() && status) {
        this.onLevelFinished(status);
        return; // stop this animation loop; a new one starts in onLevelFinished
      }

      this.lastTime = time;
      this.animationFrameId = requestAnimationFrame(frame);
    };

    this.animationFrameId = requestAnimationFrame(frame);
  }

  /** @desc Stops the current animation loop. */
  private stopAnimation(): void {
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
  }

  /** @desc Sets up keyboard event tracking for game controls. */
  private setupKeyTracking(): void {
    const handler = (event: KeyboardEvent) => {
      const action = GameController.KEY_MAP[event.code];
      if (!action) return;

      const down = event.type === 'keydown';
      if (action === 'esc') {
        if (!down) {
          this.keys['esc'] = !this.keys['esc'];
        }
      } else {
        this.keys[action] = down;
      }
      event.preventDefault();
    };

    globalThis.addEventListener('keydown', handler);
    globalThis.addEventListener('keyup', handler);
    this.keyHandlerCleanup = () => {
      globalThis.removeEventListener('keydown', handler);
      globalThis.removeEventListener('keyup', handler);
    };
  }
}
