/**
 * Universidad de La Laguna
 * @author Adriel Reyes Suárez
 * @desc Punto de entrada principal para la simulación de tiro parabólico.
 */

import { VistaPrincipal } from "./vista-principal.js";
import { ProyectilControlador } from "./proyectil-controlador.js";

/**
 * @desc Función de inicio que orquesta la creación del sistema.
 */
function main(): void {
  const vista = new VistaPrincipal();
  new ProyectilControlador(vista);
}

main();
