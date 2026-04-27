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
 * @desc Declares the minimal actor data contract used by the rendering layer
 * to draw game entities.
 */

import {Vector} from '../Vector';
import type {ActorType} from '../model/Actor';

/** 
 * @desc Minimal data structure needed by the view to render any actor in the 
 * game world. 
 */
export interface ActorView {
  type: ActorType;
  position: Vector;
  size: Vector;
}
