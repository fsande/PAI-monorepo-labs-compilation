/**
 * Universidad de La Laguna
 * Escuela Superior de Ingeniería y Tecnología
 * Grado en Ingeniería Informática
 * Programación de Aplicaciones Interactivas 2024-2025
 *
 * @author Eric Rios Hamilton
 * @since Apr 15 2025
 *  Interface for view
 *
 */

import { Controller } from './controller.ts';

export interface View<Data, EventInfo = unknown, EventPayload = unknown> {
  /**
   * Renders the view with the given state.
   * @param state - The state to render.
   */
  render(state: Data): void;

  /**
   *  attaches event listeners to UI elements
   * @param controller Controller to bind events to
   */
  bindEvents(controller: Controller<EventInfo, EventPayload>): void;
}
