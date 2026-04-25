/**
 * Universidad de La Laguna
 * Escuela Superior de Ingeniería y Tecnología
 * Grado en Ingeniería Informática
 * Programación de Aplicaciones Interactivas
 *
 * @author Adriel Reyes Suárez
 * @desc Vista principal que genera y gestiona el DOM y los lienzos (Canvas)
 * @module VistaPrincipal
 */


import { DibujanteEjes } from "./dibujante-ejes.js";
import { DibujanteProyectil } from "./dibujante-proyectil.js";

import type { DatosEjes} from "./tipos-dibujo.js";
import type { DatosProyectil} from "./tipos-dibujo.js";
import type { DatosTrayectoria} from "./tipos-dibujo.js";
import type { DatosCanyon } from "./tipos-dibujo.js";

import { DibujanteTrayectoria } from "./dibujante-trayectoria.js";
import { DibujanteCanyon } from "./dibujante-canyon.js";
/**
 * @desc Vista principal que genera y gestiona el DOM y los lienzos (Canvas)
 */
export class VistaPrincipal {
  private readonly contenedorPrincipal: HTMLDivElement;
  private readonly canvasTrayectorias: HTMLCanvasElement;
  private readonly ctxTrayectorias: CanvasRenderingContext2D;
  private readonly canvasDatos: HTMLCanvasElement;
  private readonly ctxDatos: CanvasRenderingContext2D;

  private inputVelocidad!: HTMLInputElement;
  private inputAngulo!: HTMLInputElement;
  private inputAltura!: HTMLInputElement;
  private botonLanzar!: HTMLButtonElement;
  private inputHaciaIzquierda!: HTMLInputElement;
  private inputMostrarTrayectoria!: HTMLInputElement;
  private panelControles: HTMLDivElement;

  private ejesDrawer: DibujanteEjes = new DibujanteEjes();
  private proyectilDrawer: DibujanteProyectil = new DibujanteProyectil();
  private trayectoriaDrawer = new DibujanteTrayectoria();
  private canyonDrawer = new DibujanteCanyon();


  constructor() {
    // Creamos el contenedor
    this.contenedorPrincipal = document.createElement('div');
    this.configurarEstilosContenedor(this.contenedorPrincipal);

    // Creamos los canvas
    this.canvasTrayectorias = document.createElement('canvas');
    this.ctxTrayectorias = this.canvasTrayectorias.getContext('2d')!;
    
    this.canvasDatos = document.createElement('canvas');
    this.ctxDatos = this.canvasDatos.getContext('2d')!;

    // Configuramos
    this.panelControles = this.construirPanelDeControles();
    this.ensamblarDOM();
    this.redimensionarCanvas();
    
    window.addEventListener('resize', () => this.redimensionarCanvas());
  }

  /**
   * @desc Aplica estilos básicos mediante TS para evitar el scroll y asegurar el layout SPA
   *       No tendría sentido quitar la ligadura de nuestro HTML pero tener un CSS con los estilos
   *       de elementos no creados
   */
  private configurarEstilosContenedor(contenedor: HTMLDivElement): void {
    contenedor.style.display = 'flex';
    contenedor.style.flexDirection = 'column';
    contenedor.style.flex = '1';
    contenedor.style.width = '100%';
    contenedor.style.overflow = 'hidden';
    contenedor.style.margin = '0';
    contenedor.style.padding = '0';
    contenedor.style.backgroundColor = 'white';
    
    document.body.style.margin = '0';
    document.body.style.overflow = 'hidden';
  }

  /**
   * @desc Crea y configura el panel inferior con los inputs y botones
   * @returns Un elemento div que actúa como contenedor de los controles
   */
  private construirPanelDeControles(): HTMLDivElement {
    const panelControles = document.createElement('div');
    
    // Estilos del panel (ocupará el 15% restante de la pantalla y alineará todo al centro)
    panelControles.style.height = '15%';
    panelControles.style.display = 'flex';
    panelControles.style.justifyContent = 'center';
    panelControles.style.alignItems = 'center';
    panelControles.style.gap = '20px'; 
    panelControles.style.backgroundColor = 'lightgray';
    panelControles.style.borderTop = '2px solid gray';

    // Creamos los distintos inputs
    this.inputVelocidad = this.crearInputNumerico('Velocidad (m/s):', '10', panelControles);
    this.inputAngulo = this.crearInputNumerico('Ángulo (grados):', '45', panelControles);
    this.inputAltura = this.crearInputNumerico('Altura Inicial (m):', '0', panelControles);

    // Creamos el checkbox que dirá si el tiro es hacia la izquierda
    this.inputHaciaIzquierda = this.crearCheckbox('Disparar hacia la izquierda', panelControles);
    this.inputMostrarTrayectoria = this.crearCheckbox('Mostrar rastro de trayectoria', panelControles);
    // Creamos el botón de lanzamiento
    this.botonLanzar = document.createElement('button');
    this.botonLanzar.textContent = 'Lanzar Proyectil';
    this.botonLanzar.style.padding = '10px 20px';
    this.botonLanzar.style.fontSize = '16px';
    this.botonLanzar.style.cursor = 'pointer';
    panelControles.appendChild(this.botonLanzar);

    return panelControles;
  }

  /**
   * @desc Método auxiliar para crear una casilla de verificación con su etiqueta
   * @param textoLabel El texto que acompañará al checkbox
   * @param contenedorPadre El elemento DOM donde se inyectará el conjunto
   * @returns El elemento HTMLInputElement (tipo checkbox) creado
   */
  private crearCheckbox(textoLabel: string, contenedorPadre: HTMLDivElement): HTMLInputElement {
    const contenedorCheckbox = document.createElement('div');
    contenedorCheckbox.style.display = 'flex';
    contenedorCheckbox.style.alignItems = 'center';
    contenedorCheckbox.style.gap = '5px';

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.style.width = '20px';
    checkbox.style.height = '20px';

    const label = document.createElement('label');
    label.textContent = textoLabel;
    label.style.fontWeight = 'bold';

    contenedorCheckbox.appendChild(checkbox);
    contenedorCheckbox.appendChild(label);
    contenedorPadre.appendChild(contenedorCheckbox);

    return checkbox;
  }

  /**
   * @desc Método auxiliar para crear cajas de texto numéricas con su etiqueta
   */
  private crearInputNumerico(textoLabel: string, valorPorDefecto: string, contenedorPadre: HTMLDivElement): HTMLInputElement {
    const contenedorGrupo = document.createElement('div');
    contenedorGrupo.style.display = 'flex';
    contenedorGrupo.style.flexDirection = 'column';

    const label = document.createElement('label');
    label.textContent = textoLabel;
    label.style.fontSize = '14px';
    label.style.fontWeight = 'bold';
    label.style.marginBottom = '5px';

    const input = document.createElement('input');
    input.type = 'number';
    input.value = valorPorDefecto;
    input.style.padding = '5px';
    input.style.fontSize = '16px';

    contenedorGrupo.appendChild(label);
    contenedorGrupo.appendChild(input);
    contenedorPadre.appendChild(contenedorGrupo);

    return input;
  }

  /**
   * @desc Inyecta todos los elementos creados en el DOM del navegador
   */
  private ensamblarDOM(): void {
    // Añadimos los elementos al contenedor principal
    this.contenedorPrincipal.appendChild(this.canvasTrayectorias);
    this.contenedorPrincipal.appendChild(this.canvasDatos);
    this.contenedorPrincipal.appendChild(this.panelControles);

    // Inyectamos el contenedor en el body
    document.body.appendChild(this.contenedorPrincipal);
  }

  /**
   * @desc Ajusta el tamaño de los Canvas dinámicamente según el tamaño de la ventana
   */
  private redimensionarCanvas(): void {
    const espacioDisponibleAlto = this.contenedorPrincipal.offsetHeight;
    const anchoDisponible = this.contenedorPrincipal.offsetWidth;
    
    this.canvasTrayectorias.width = anchoDisponible;
    // Ocupamos el 75% del espacio REAL disponible para la trayectoria
    this.canvasTrayectorias.height = espacioDisponibleAlto * 0.75;

    this.canvasDatos.width = anchoDisponible;
    // Ocupamos el 10% para los datos, el resto se lo queda el panel de controles
    this.canvasDatos.height = espacioDisponibleAlto * 0.10;
  }

  // Getters para acceder a los valores de los inputs y a los contextos de los canvas desde el controlador
  getVelocidadInicial(): number { return Number(this.inputVelocidad.value); }
  getAnguloGrados(): number { return Number(this.inputAngulo.value); }
  getAlturaInicial(): number { return Number(this.inputAltura.value); }
  getHaciaIzquierda(): boolean { return this.inputHaciaIzquierda.checked; }
  getMostrarTrayectoria(): boolean { return this.inputMostrarTrayectoria.checked; }

  // Getters para acceder a los contextos de los canvas desde el controlador
  getContextoTrayectorias(): CanvasRenderingContext2D { return this.ctxTrayectorias; }
  getCanvasTrayectorias(): HTMLCanvasElement { return this.canvasTrayectorias; }
  getContextoDatos(): CanvasRenderingContext2D { return this.ctxDatos; }
  getCanvasDatos(): HTMLCanvasElement { return this.canvasDatos; }

  // Método para vincular el evento de click del botón de lanzamiento desde el controlador
  vincularBotonLanzar(manejadorEvento: () => void): void {
    this.botonLanzar.addEventListener('click', manejadorEvento);
  }

  /**
   * @desc Limpia el lienzo y dibuja los ejes cartesianos con sus valores métricos
   * @param haciaIzquierda Booleano que indica la dirección del disparo
   * @param metrosMaxX La distancia máxima en metros que se mostrará en el eje X
   * @param metrosMaxY La altura máxima en metros que se mostrará en el eje Y
   */
  dibujarEjesCartesianos(datos: DatosEjes): void {
    this.ejesDrawer.dibujar(this.ctxTrayectorias, datos);
  }

  /** @desc Dibuja el cañón como un vector en el origen */
  dibujarCanyon(datos: DatosCanyon): void {
    this.canyonDrawer.dibujar(this.ctxTrayectorias, datos);
  }

  /** @desc Dibuja la bola en una posición de píxeles */
  dibujarProyectil(datos: DatosProyectil): void {
    this.proyectilDrawer.dibujar(this.ctxTrayectorias, datos);
  }

  /** @desc Une los puntos recibidos para representar la estela del proyectil */
  dibujarTrayectoria(datos: DatosTrayectoria): void {
    this.trayectoriaDrawer.dibujar(this.ctxTrayectorias, datos);
  }
}
