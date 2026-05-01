/**
 * Universidad de La Laguna
 * Escuela Superior de Ingeniería y Tecnología
 * Grado en Ingeniería Informática
 * Programación de Aplicaciones Interactivas 2024-2025
 *
 * @author Eric Rios Hamilton
 * @since Apr 15 2025
 *  Controller interface
 *
 */

export interface Controller<EventInfo = unknown, EventPayload = unknown> {
  /**
   * Starts or initializes the controller.
   */
  initialize(initialValue?: EventPayload): void;

  /**
   * Binds events to the controller.
   */
  onUpdate(eventInfo: EventInfo, payload: EventPayload): void;
}