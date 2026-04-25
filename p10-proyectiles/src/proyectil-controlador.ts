/**
 * Universidad de La Laguna
 * Escuela Superior de Ingeniería y Tecnología
 * Grado en Ingeniería Informática
 * Programación de Aplicaciones Interactivas
 *
 * @author Adriel Reyes Suárez
 * @desc Controlador que coordina la comunicación entre el modelo físico y la interfaz.
 * @module ProyectilControlador
 */

import type { Coordenadas } from "./coordenadas.js";
import { ProyectilModelo } from "./proyectil-modelo.js";
import { VistaPrincipal } from "./vista-principal.js";
import { TransformadorCoordenadas } from "./transformador-coordenadas.js";

export class ProyectilControlador {
  private listaDeProyectiles: ProyectilModelo[] = [];
  private transformador: TransformadorCoordenadas;
  private estaEnEjecucion: boolean = false;
  private paletaDeColores: string[] = ['red', 'blue', 'green', 'purple', 'orange'];
  private indiceDelColorActual: number = 0;
  private escalaPixelesPorMetro: number = 1; 
  private esPrimerLanzamiento: boolean = true;

  constructor(private readonly vista: VistaPrincipal) {
    // Inicializamos el transformador con la escala por defecto
    this.transformador = new TransformadorCoordenadas(this.escalaPixelesPorMetro);
    
    this.vista.vincularBotonLanzar(() => this.ejecutarLanzamiento());
    this.actualizarRepresentacionGrafica();
    this.estaEnEjecucion = true;
    requestAnimationFrame((t) => this.bucleDeAnimacion(t));
  }

  /**
   * @desc Gestiona la creación de un nuevo proyectil y ajusta la escala si es necesario
   */
  private ejecutarLanzamiento(): void {
    const velocidad = this.vista.getVelocidadInicial();
    const angulo = this.vista.getAnguloGrados();
    const altura = this.vista.getAlturaInicial();
    const haciaIzquierda = this.vista.getHaciaIzquierda();
    const colorAsignado = this.paletaDeColores[this.indiceDelColorActual % this.paletaDeColores.length];

    const nuevoProyectil = new ProyectilModelo(velocidad, angulo, altura, colorAsignado, haciaIzquierda);

    if (this.esPrimerLanzamiento) {
      this.ajustarEscalaSegunProyectil(nuevoProyectil);
      this.esPrimerLanzamiento = false;
    }

    this.listaDeProyectiles.push(nuevoProyectil);
    ++this.indiceDelColorActual;
  }

  /**
   * @desc Calcula la escala necesaria para que el primer tiro sea visible completamente
   */
  private ajustarEscalaSegunProyectil(proyectil: ProyectilModelo): void {
    const canvas = this.vista.getCanvasTrayectorias();
    
    const alcanceEstimado = (Math.pow(proyectil.getVelocidadInicial(), 2) / 9.81) + 10;
    const alturaMaximaEstimada = proyectil.calcularAlturaMaxima() + 10;

    const anchoUtilizable = canvas.width * 0.8;
    const alturaUtilizable = canvas.height * 0.8;

    const escalaX = anchoUtilizable / alcanceEstimado;
    const escalaY = alturaUtilizable / alturaMaximaEstimada;
    
    this.escalaPixelesPorMetro = Math.min(escalaX, escalaY);
    // Actualizamos el transformador con la nueva escala calculada
    this.transformador.setEscala(this.escalaPixelesPorMetro);
  }

  /** @desc Calcula las coordenadas del vector de disparo y delega el dibujo en la vista */
  private gestionarDibujoDelCanyon(): void {
    const alturaInicialMetros = this.vista.getAlturaInicial();
    const anguloRadianes = this.vista.getAnguloGrados() * (Math.PI / 180);
    const longitudVectorPixeles = 50; 

    const pixelOrigen = this.convertirMetrosAPixeles(0, alturaInicialMetros);
    
    const sentido = this.vista.getHaciaIzquierda() ? -1 : 1;
    const pixelDestino: Coordenadas = {
      posicionX: pixelOrigen.posicionX + (longitudVectorPixeles * Math.cos(anguloRadianes) * sentido),
      posicionY: pixelOrigen.posicionY - (longitudVectorPixeles * Math.sin(anguloRadianes))
    };

    this.vista.dibujarCanyon({
      origen: pixelOrigen,
      destino: pixelDestino,
    });
  }

  /**
   * @desc Redibuja el escenario y actualiza las posiciones de los proyectiles
   */
  private bucleDeAnimacion(instanteActual: number): void {
    this.actualizarRepresentacionGrafica(); 
    this.gestionarDibujoDelCanyon();          

    for (const proyectil of this.listaDeProyectiles) {
      const milisegundosDesdeElNacimiento = instanteActual - proyectil.getInstanteDeLanzamiento();
      let tiempoLocalSegundos = milisegundosDesdeElNacimiento / 1000;
      
      if (tiempoLocalSegundos > proyectil.getTiempoDeVueloEstimado()) {
        tiempoLocalSegundos = proyectil.getTiempoDeVueloEstimado();
      }
      this.renderizarProyectilEnPantalla(proyectil, tiempoLocalSegundos);

      if (proyectil === this.listaDeProyectiles[this.listaDeProyectiles.length - 1]) {
        const posicionActual = proyectil.calcularPosicion(tiempoLocalSegundos);
        this.actualizarPanelDeInformacion(posicionActual, tiempoLocalSegundos, proyectil.calcularAlturaMaxima());
      }
    }

    if (this.estaEnEjecucion) {
      requestAnimationFrame((t) => this.bucleDeAnimacion(t));
    }
  }

  /**
   * @desc Dibuja el proyectil y, opcionalmente, su rastro
   */
  private renderizarProyectilEnPantalla(proyectil: ProyectilModelo, tiempoActual: number): void {
    const tiempoEfectivo = Math.min(tiempoActual, proyectil.getTiempoDeVueloEstimado());
    const mostrarTrayectoria = this.vista.getMostrarTrayectoria();
    
    if (mostrarTrayectoria) {
      let puntosParaDibujar: Coordenadas[] = [];
      const pasoDeTiempo = 0.05;

      for (let tiempo = 0; tiempo <= tiempoEfectivo; tiempo += pasoDeTiempo) {
        const posMetros = proyectil.calcularPosicion(tiempo);
        puntosParaDibujar.push(this.convertirMetrosAPixeles(posMetros.posicionX, posMetros.posicionY));
      }

      const posFinalMetros = proyectil.calcularPosicion(tiempoEfectivo);
      puntosParaDibujar.push(this.convertirMetrosAPixeles(posFinalMetros.posicionX, posFinalMetros.posicionY));

      // Usamos el nuevo método de la vista con tipado estricto
      this.vista.dibujarTrayectoria({ puntos: puntosParaDibujar, color: proyectil.getColor() });
    }

    const posicionMetros = proyectil.calcularPosicion(tiempoEfectivo);
    const pixelAhora = this.convertirMetrosAPixeles(posicionMetros.posicionX, posicionMetros.posicionY);

    // Usamos el nuevo método tipado de la vista para la bola
    this.vista.dibujarProyectil({
      posicion: pixelAhora,
      color: proyectil.getColor()
    });
  }

  /**
   * @desc Método auxiliar que ahora delega en el TransformadorCoordenadas
   */
  private convertirMetrosAPixeles(xMetros: number, yMetros: number): Coordenadas {
    const canvas = this.vista.getCanvasTrayectorias();
    return this.transformador.metrosAPixeles(
      xMetros, 
      yMetros, 
      canvas.width, 
      canvas.height, 
      this.vista.getHaciaIzquierda()
    );
  }

  /**
   * @desc Escribe los datos numéricos en el segundo Canvas 
   */
  private actualizarPanelDeInformacion(pos: Coordenadas, tiempo: number, alturaMax: number): void {
    const ctx = this.vista.getContextoDatos();
    ctx.clearRect(0, 0, this.vista.getCanvasDatos().width, this.vista.getCanvasDatos().height);
    ctx.fillStyle = 'black';
    ctx.font = 'bold 16px monospace';
    
    const texto = `Tiempo: ${tiempo.toFixed(2)}s | Distancia: ${Math.abs(pos.posicionX).toFixed(2)}m | Altura Máx: ${alturaMax.toFixed(2)}m`;
    ctx.fillText(texto, 10, 25);
  }

  private actualizarRepresentacionGrafica(): void {
    const haciaIzquierda = this.vista.getHaciaIzquierda();
    const canvas = this.vista.getCanvasTrayectorias();
    
    // Delegamos en el nuevo método de la vista respetando tus nombres
    this.vista.dibujarEjesCartesianos({
      haciaIzquierda: haciaIzquierda,
      metrosMaxX: canvas.width / this.escalaPixelesPorMetro,
      metrosMaxY: canvas.height / this.escalaPixelesPorMetro
    });
  }
}
