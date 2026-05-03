/**
 * Universidad de La Laguna
 * Escuela Superior de Ingeniería y Tecnología
 * Grado en Ingeniería Informática
 * Programación de Aplicaciones Interactivas 2025-2026
 *
 * @author Adrián Pérez Poleo <adrian.perez.46@ull.edu.es>
 * @author Enrique Gómez Díaz <enrique.gomez.13@ull.edu.es>
 * @author Manuel Cadenas García <manuel.cadenas.25@ull.edu.es>
 * @since Mar 30 2026
 * @desc Definition of the Event class, that models 
 */

/**
 * Type definition for a callback function that reacts to an event.
 * @template Type The type of the data passed to the listener.
 */
type Listener<Type> = (params: Type) => void;

/**
 * Generic class that models an event using the Observer pattern.
 * @template Type The type of data emitted by the event.
 */
export class Event<Type> {
  /**
   * Array of registered listener callbacks.
   */
  private listeners: Listener<Type>[] = [];

  /**
   * Subscribes a new listener to the event.
   * @param listener The callback function to execute when the event triggers.
   */
  addListener(listener: Listener<Type>): void {
    this.listeners.push(listener);
  }

  /**
   * Executes all registered listeners with the provided data.
   * @param params The data payload to pass to each listener.
   */
  trigger(params: Type): void {
    this.listeners.forEach(listener => {
      listener(params); 
    });
  }
}
