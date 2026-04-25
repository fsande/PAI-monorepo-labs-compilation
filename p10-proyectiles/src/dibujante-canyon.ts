/**
 * Universidad de La Laguna
 * Escuela Superior de Ingeniería y Tecnología
 * Grado en Ingeniería Informática
 * Programación de Aplicaciones Interactivas
 *
 * @author Adriel Reyes Suárez
 * @desc Controlador que coordina la comunicación entre el modelo físico y la interfaz.
 * @module DibujanteCanyon
 */

import type { Dibujante } from "./drawer.js";
import type { DatosCanyon } from "./tipos-dibujo.js";

export class DibujanteCanyon implements Dibujante<DatosCanyon> {
  /**
   * @desc Dibuja el cañón como un vector con una punta circular en el destino.
   */
  dibujar(ctx: CanvasRenderingContext2D, { origen, destino }: DatosCanyon): void {
    ctx.beginPath();
    ctx.moveTo(origen.posicionX, origen.posicionY);
    ctx.lineTo(destino.posicionX, destino.posicionY);
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 4;
    ctx.stroke();
    
    // Punta del cañón (estética)
    ctx.beginPath();
    ctx.arc(destino.posicionX, destino.posicionY, 5, 0, Math.PI * 2);
    ctx.fillStyle = 'black';
    ctx.fill();
  }
}
