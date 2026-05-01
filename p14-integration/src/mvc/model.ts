/**
 * Universidad de La Laguna
 * Escuela Superior de Ingeniería y Tecnología
 * Grado en Ingeniería Informática
 * Programación de Aplicaciones Interactivas 2024-2025
 *
 * @author Eric Rios Hamilton
 * @since Apr 15 2025
 *  Model interface
 *
 */

export interface Model<Data, ActionPayload = unknown, ActionInfo = unknown> {
  /**
   * Gets the current state of the model.
   * @returns The current state.
   */
  getState(): Data;

  /**
   * Initializes the model with an initial state.
   */
  initialize(initialValue: ActionPayload): void;

  /**
   * Subscribes to state changes in the model.
   * @param listener - A callback function invoked when the state changes.
   *                   Optionally includes metadata about the update.
   */
  subscribe(listener: (state: Data, eventInfo?: ActionInfo) => void): void;

  /**
   * Updates the model by performing an action.
   * @param action - The action to perform.
   * @param payload - Optional data required to perform the action.
   * @returns True if the action was successfully performed, false otherwise.
   */
  update(action: string, payload?: ActionPayload): void;
}