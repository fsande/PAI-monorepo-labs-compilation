/**
 * Universidad de La Laguna
 * Escuela Superior de Ingeniería y Tecnología
 * Grado en Ingeniería Informática
 * Programación de Aplicaciones Interactivas
 * @author Adrián Pérez Poleo
 * @since May 04, 2026
 * @desc Class that stores the information of a level.
 */

/**
 * Interface that defines the elements in a level in the Balatro game.
 */
export interface Level {
  name: string;
  targetScore: number;
  maximumHands: number;
  maximumDiscards: number;
  handSize: number;
  maximumSelectedCards: number;
}