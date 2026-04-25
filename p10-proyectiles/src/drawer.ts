/**
 * Universidad de La Laguna
 * Escuela Superior de Ingeniería y Tecnología
 * Grado en Ingeniería Informática
 * Programación de Aplicaciones Interactivas
 *
 * @author Adriel Reyes Suárez
 * @desc Controlador que coordina la comunicación entre el modelo físico y la interfaz.
 * @module Dibujante
 */

export interface Dibujante<T> {
  dibujar(ctx: CanvasRenderingContext2D, datos: T): void;
}