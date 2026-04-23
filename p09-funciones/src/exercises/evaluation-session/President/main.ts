/**
 * Universidad de La Laguna
 * Escuela Superior de Ingeniería y Tecnología
 * Grado en Ingeniería Informática
 * Programación de Aplicaciones Interactivas
 *
 * @author Daniel Martínez
 * @since Apr 07 2026
 * @description Main program to verify the Singleton behavior of the President class.
 */

import { President } from './president.js';

/**
 * Executes the main logic to test the President class.
 */
const main = function (): void {
  const president: President = President.getPresident();
  console.log(president.getName());

  const anotherPresident: President = President.getPresident();
  console.log(anotherPresident.getName());

  // The following line would cause a compilation error because the constructor is private:
  // const oneMorePresident = new President('Trump');
};

main();