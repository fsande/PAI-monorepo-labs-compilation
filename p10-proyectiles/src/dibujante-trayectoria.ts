/**
 * Universidad de La Laguna
 * Escuela Superior de Ingeniería y Tecnología
 * Grado en Ingeniería Informática
 * Programación de Aplicaciones Interactivas
 *
 * @author Adriel Reyes Suárez
 * @desc Controlador que coordina la comunicación entre el modelo físico y la interfaz.
 * @module DibujanteTrayectoria
 */

import type { Dibujante } from "./drawer.js";
import type { DatosTrayectoria } from "./tipos-dibujo.js";

/**
 * @desc Clase encargada de dibujar la trayectoria del proyectil en el canvas
 */
export class DibujanteTrayectoria implements Dibujante<DatosTrayectoria> {
  dibujar(ctx: CanvasRenderingContext2D, { puntos, color }: DatosTrayectoria): void {
    if (puntos.length < 2) return; 

    ctx.beginPath();
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    
    ctx.moveTo(puntos[0].posicionX, puntos[0].posicionY);
    for (let i = 1; i < puntos.length; i++) {
      ctx.lineTo(puntos[i].posicionX, puntos[i].posicionY);
    }
    
    ctx.stroke();
  }
}
