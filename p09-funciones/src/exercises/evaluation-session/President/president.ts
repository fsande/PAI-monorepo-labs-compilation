/**
 * Universidad de La Laguna
 * Escuela Superior de Ingeniería y Tecnología
 * Grado en Ingeniería Informática
 * Programación de Aplicaciones Interactivas
 *
 * @author Daniel Martínez
 * @since Apr 07 2026
 * @description Implementation of the President class using the Singleton pattern
 * to ensure only one instance exists in the system.
 */

export class President {
    private static instance: President;
  
    /**
     * Private constructor to prevent direct instantiation from outside the class.
     * @param name The name of the president.
     */
    private constructor(private readonly name: string) {}
  
    /**
     * Provides access to the unique instance of the President.
     * @desc If the instance does not exist, it creates one. Otherwise, it returns the existing one.
     * @returns The unique President instance.
     */
    static getPresident(): President {
      if (!President.instance) {
        President.instance = new President('Von der Leyen');
      }
      return President.instance;
    }
  
    /**
     * Returns the name of the president.
     * @returns The president's name.
     */
    getName(): string {
      return this.name;
    }
  }