/**
 * Universidad de La Laguna
 * Escuela Superior de Ingeniería y Tecnología
 * Grado en Ingeniería Informática
 * Programación de Aplicaciones Interactivas
 *
 * @author Adriel Reyes Suárez
 * @desc Controlador que coordina la comunicación entre el modelo físico y la interfaz.
 * @module TransformadorCoordenadas
 */

import type { Coordenadas } from "./coordenadas.js";

/** 
 * * @desc Clase encargada de mapear el mundo físico (metros) al canvas (píxeles) 
 */
export class TransformadorCoordenadas {
  constructor(private escala: number, private margenSuelo: number = 40, private margenLateral: number = 50) {}

  setEscala(nuevaEscala: number) { this.escala = nuevaEscala; }

  // Convierte metros a la posición real en el canvas
  metrosAPixeles(xMetros: number, yMetros: number, canvasWidth: number, canvasHeight: number, haciaIzquierda: boolean): Coordenadas {
    const origenX = haciaIzquierda ? canvasWidth - this.margenLateral : this.margenLateral;
    const origenY = canvasHeight - this.margenSuelo;

    return {posicionX: origenX + (xMetros * this.escala), posicionY: origenY - (yMetros * this.escala)};
  }
}
