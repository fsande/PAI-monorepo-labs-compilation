/**
 * Universidad de La Laguna
 * Escuela Superior de Ingeniería y Tecnología
 * Grado en Ingeniería Informática
 * Programación de Aplicaciones Interactivas
 * @author Adrián Pérez Poleo
 * @since Apr 29, 2026
 * @desc Balatro main client.
 */

import {BalatroModel} from './Model/balatro-model';
import {BalatroView} from './View/balatro-view';
import {BalatroController} from './Controller/balatro-controller';

/**
 * Main function of the program.
 */
export function main(): void {
  const model = new BalatroModel();
  const view = new BalatroView();
  new BalatroController(model, view);
}

main();