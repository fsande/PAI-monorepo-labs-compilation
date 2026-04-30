/**
 * Universidad de La Laguna
 * Escuela Superior de Ingenieria y Tecnologia
 * Grado en Ingenieria Informatica
 * Programacion de Aplicaciones Interactivas
 *
 * @author Pablo Hernandez Jimenez
 * @since Apr 29, 2026
 * @description Composes the Monte Carlo integral MVC application.
 */

import { MonteCarloIntegralController } from './controller';
import { MonteCarloIntegralModel } from './model';
import { MonteCarloIntegralView } from './view';

/**
 * Composes the Monte Carlo integral assignment from model, view, and controller.
 */
export class MonteCarloIntegralApplication {
  private isRunning = false;
  private readonly controller: MonteCarloIntegralController;

  /**
   * Creates the application from one document.
   *
   * @param documentRef - Document that contains the assignment page.
   */
  private constructor(documentRef: Document) {
    this.controller = new MonteCarloIntegralController(
      new MonteCarloIntegralModel(),
      new MonteCarloIntegralView(documentRef),
    );
  }

  /**
   * Builds a stopped application ready to initialize.
   *
   * @param documentRef - Document that contains the assignment page.
   * @returns A stopped application instance.
   */
  static fromDocument(documentRef: Document): MonteCarloIntegralApplication {
    return new MonteCarloIntegralApplication(documentRef);
  }

  /**
   * Starts the MVC application once.
   *
   * @returns The running application instance.
   */
  start(): MonteCarloIntegralApplication {
    if (this.isRunning) {
      return this;
    }

    this.controller.initialize();
    this.isRunning = true;

    return this;
  }

  /**
   * Stops the application and detaches listeners.
   */
  stop(): void {
    if (!this.isRunning) {
      return;
    }

    this.controller.destroy();
    this.isRunning = false;
  }
}
