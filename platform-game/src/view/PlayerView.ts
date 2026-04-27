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
 * @desc Defines the player data contract used by the rendering layer 
 * (position, size, and movement speed).
 */

import {Vector} from '../Vector';

/** 
 * @desc Minimal data structure needed by the view to render the player 
 * character.
 */
export interface PlayerView {
  position: Vector;
  size: Vector;
  speed: Vector;
}
