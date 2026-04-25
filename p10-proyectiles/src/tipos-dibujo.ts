/**
 * Universidad de La Laguna
 * Escuela Superior de Ingeniería y Tecnología
 * Grado en Ingeniería Informática
 * Programación de Aplicaciones Interactivas
 *
 * @author Adriel Reyes Suárez
 * @desc Controlador que coordina la comunicación entre el modelo físico y la interfaz.
 * @module TiposDibujo
 */

import type { Coordenadas } from "./coordenadas.js";

export interface DatosProyectil {
  posicion: Coordenadas;
  color: string;
}

export interface DatosTrayectoria {
  puntos: Coordenadas[];
  color: string;
}

export interface DatosEjes {
  haciaIzquierda: boolean;
  metrosMaxX: number;
  metrosMaxY: number;
}

export interface DatosCanyon {
  origen: Coordenadas;
  destino: Coordenadas;
}
