/**
 * Universidad de La Laguna
 * Escuela Superior de Ingeniería y Tecnología
 * Grado en Ingeniería Informática
 * Programación de Aplicaciones Interactivas
 * @author Adrián Pérez Poleo
 * @since Apr 25, 2026
 * @desc Program that implements the Hangman Game using the MVC pattern.
 */

import {HangmanController} from './Controller/hangman-controller';
import {HangmanModel} from './Model/hangman-model';
import {HangmanView} from './View/hangman-view';

/**
 * Entry point of the program.
 */
export function main() {
  const model = new HangmanModel();  
  const view = new HangmanView();
  new HangmanController(model, view);
};

main();
