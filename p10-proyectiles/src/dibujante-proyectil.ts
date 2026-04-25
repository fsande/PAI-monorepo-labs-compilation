/**
 * Universidad de La Laguna
 * Escuela Superior de Ingeniería y Tecnología
 * Grado en Ingeniería Informática
 * Programación de Aplicaciones Interactivas
 *
 * @author Adriel Reyes Suárez
 * @desc Controlador que coordina la comunicación entre el modelo físico y la interfaz.
 * @module DibujanteProyectil
 */


import type { Dibujante } from "./drawer.js";
import type { DatosProyectil } from "./tipos-dibujo.js";

/**
 * @desc Clase encargada de dibujar el proyectil en el canvas
 */
export class DibujanteProyectil implements Dibujante<DatosProyectil> {
  dibujar(ctx: CanvasRenderingContext2D, { posicion, color }: DatosProyectil): void {
    ctx.beginPath();
    ctx.arc(posicion.posicionX, posicion.posicionY, 8, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.fill();
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 1;
    ctx.stroke();
  }
}
