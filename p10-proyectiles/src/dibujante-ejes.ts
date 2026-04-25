/**
 * Universidad de La Laguna
 * Escuela Superior de Ingeniería y Tecnología
 * Grado en Ingeniería Informática
 * Programación de Aplicaciones Interactivas
 *
 * @author Adriel Reyes Suárez
 * @desc Controlador que coordina la comunicación entre el modelo físico y la interfaz.
 * @module DibujanteEjes
 */

import type { Dibujante } from "./drawer.js";
import type { DatosEjes } from "./tipos-dibujo.js";

/**
 * @desc Clase encargada de dibujar los ejes en el canvas
 */
export class DibujanteEjes implements Dibujante<DatosEjes> {
  dibujar(ctx: CanvasRenderingContext2D, { haciaIzquierda, metrosMaxX, metrosMaxY }: DatosEjes): void {
    const ancho = ctx.canvas.width;
    const alto = ctx.canvas.height;

    ctx.clearRect(0, 0, ancho, alto);

    // Márgenes originales [cite: 1]
    const margenSuelo = 40;
    const margenLateral = 50;
    const margenTop = 40;

    const origenY = alto - margenSuelo; 
    const origenX = haciaIzquierda ? ancho - margenLateral : margenLateral;

    // Dibujar las líneas de los ejes 
    ctx.beginPath();
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 2;
    
    // Eje X
    ctx.moveTo(0, origenY);
    ctx.lineTo(ancho, origenY);
    // Eje Y
    ctx.moveTo(origenX, 0);
    ctx.lineTo(origenX, alto);
    ctx.stroke();

    ctx.fillStyle = 'black';
    ctx.font = '12px Arial';

    // Marcas y etiquetas del Eje X
    ctx.textAlign = 'center';
    const longitudEjeX = ancho - margenLateral * 2;
    const numMarcasX = 10; 
    const pasoPixelesX = longitudEjeX / numMarcasX;
    const pasoMetrosX = metrosMaxX / numMarcasX;

    for (let i = 0; i <= numMarcasX; i++) {
      const posX = haciaIzquierda ? origenX - (i * pasoPixelesX) : origenX + (i * pasoPixelesX);
      const valorTexto = (i * pasoMetrosX).toFixed(0);

      // Rayita indicadora X
      ctx.beginPath();
      ctx.moveTo(posX, origenY - 5);
      ctx.lineTo(posX, origenY + 5);
      ctx.stroke();

      // Evitar solapar el 0 del origen [cite: 1]
      if (i > 0) {
        ctx.fillText(valorTexto, posX, origenY + 20);
      } else {
        ctx.fillText('0', posX + (haciaIzquierda ? -10 : 10), origenY + 20);
      }
    }

    // Marcas y etiquetas del Eje Y 
    ctx.textAlign = haciaIzquierda ? 'left' : 'right';
    const longitudEjeY = alto - margenSuelo - margenTop;
    const numMarcasY = 5; 
    const pasoPixelesY = longitudEjeY / numMarcasY;
    const pasoMetrosY = metrosMaxY / numMarcasY;

    for (let i = 1; i <= numMarcasY; i++) {
      const posY = origenY - (i * pasoPixelesY);
      const valorTexto = (i * pasoMetrosY).toFixed(0);

      // Rayita indicadora Y
      ctx.beginPath();
      ctx.moveTo(origenX - 5, posY);
      ctx.lineTo(origenX + 5, posY);
      ctx.stroke();

      const offsetTextoX = haciaIzquierda ? 10 : -10;
      ctx.fillText(valorTexto, origenX + offsetTextoX, posY + 4); 
    }
  }
}
