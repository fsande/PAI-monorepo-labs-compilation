/**
 * Universidad de La Laguna
 * Escuela Superior de Ingenieria y Tecnologia
 * Grado en Ingenieria Informatica
 * Programacion de Aplicaciones Interactivas
 *
 * @author Pablo Hernandez Jimenez
 * @since Apr 29, 2026
 * @description Starts the Monte Carlo integral MVC canvas application.
 */

import { MonteCarloIntegralApplication } from './application';

/**
 * Starts the assignment on the current document.
 */
function main(): void {
  MonteCarloIntegralApplication.fromDocument(document).start();
}

main();
