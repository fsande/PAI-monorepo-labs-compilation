/**
 * Universidad de La Laguna
 * Escuela Superior de Ingeniería y Tecnología
 * Grado en Ingeniería Informática
 * Programación de Aplicaciones Interactivas
 *
 * @author Adriel Reyes Suárez
 * @desc Modelo matemático encapsulado para el cálculo de la cinemática de un tiro parabólico.
 * @module ProyectilModelo
 */

import type { Coordenadas } from "./coordenadas.js";
/**
 * @desc Modelo que gestiona la física y el estado de un proyectil.
 */
export class ProyectilModelo {
  private readonly gravedad: number = 9.81;
  private readonly anguloRadianes: number;
  private readonly instanteDeLanzamiento: number;
  private readonly tiempoDeVueloEstimado: number;

  /**
   * Inicializa un nuevo modelo de proyectil.
   * @param velocidadInicial Velocidad de salida (m/s)
   * @param anguloGrados Ángulo de inclinación del lanzamiento
   * @param alturaInicial Altura desde la que se lanza (m)
   * @param color Identificador visual para usar posteriormente
   * @param haciaIzquierda Si es true, el proyectil viajará hacia el eje X negativo
   */
  constructor(private readonly velocidadInicial: number, private readonly anguloGrados: number, private readonly alturaInicial: number,
              private readonly color: string, private readonly haciaIzquierda: boolean = false) {
    // Convertimos el angulo a radianes para poder operar correctamente con Math
    this.anguloRadianes = (this.anguloGrados * Math.PI) / 180;
    this.instanteDeLanzamiento = performance.now();
    
    // Cálculo de tiempo de vuelo: h0 + v0y*t - 0.5*g*t^2 = 0
    const gravedad = 9.81;
    const velocidadVerticalInicial = this.velocidadInicial * Math.sin(this.anguloRadianes);
    
    // Fórmula cuadrática simplificada para el tiempo de impacto
    this.tiempoDeVueloEstimado = (velocidadVerticalInicial + Math.sqrt(Math.pow(velocidadVerticalInicial, 2) + 2 * gravedad * this.alturaInicial)) / gravedad;
  }

  /** @desc Getters de los distitnos atributos de la clase */
  getVelocidadInicial(): number { return this.velocidadInicial; }
  
  getAnguloGrados(): number { return this.anguloGrados; }

  getAlturaInicial(): number { return this.alturaInicial; }

  getColor(): string { return this.color; }

  getHaciaIzquierda(): boolean { return this.haciaIzquierda; }

  getInstanteDeLanzamiento(): number { return this.instanteDeLanzamiento; }
  
  getTiempoDeVueloEstimado(): number { return this.tiempoDeVueloEstimado; }
  
  /** @desc Calcula la altura máxima h_max = h0 + (v0y^2 / 2g) */
  calcularAlturaMaxima(): number {
    const v0y = this.velocidadInicial * Math.sin(this.anguloRadianes);
    return this.alturaInicial + (Math.pow(v0y, 2) / (2 * 9.81));
  }

  /**
   * @desc Calcula la posición exacta en metros para un instante de tiempo dado.
   * Aplica las ecuaciones paramétricas del tiro parabólico.
   * @param tiempoSegundos Tiempo transcurrido desde el lanzamiento
   * @returns Objeto con las coordenadas físicas (posicionX, posicionY)
   */
  calcularPosicion(tiempoSegundos: number): Coordenadas {
    const velocidadX = this.velocidadInicial * Math.cos(this.anguloRadianes);
    const velocidadY = this.velocidadInicial * Math.sin(this.anguloRadianes);

    // Si el proyectil va hacia la izquierda debemos invertir la dirección de tiro
    const direcccionX = this.haciaIzquierda ? -1 : 1;

    // Fórmulas cinemáticas para ambos ejes
    const posicionX = velocidadX * tiempoSegundos * direcccionX;
    const posicionY = this.alturaInicial + (velocidadY * tiempoSegundos) - (0.5 * this.gravedad * (tiempoSegundos ** 2));
    
    return { posicionX, posicionY};
  }
}

