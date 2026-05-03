/**
 * Universidad de La Laguna
 * Escuela Superior de Ingeniería y Tecnología
 * Grado en Ingeniería Informática
 * Programación de Aplicaciones Interactivas
 *
 * @author F. de Sande
 * @since Feb 20, 2020 
 * @since Feb 26, 2021
 * @since Mar 7, 2023
 * @version 3
 * @description TS Object Oriented Analog HTML-Canvas based Clock
 * @tutorial Adapted from {@link https://www.w3schools.com/graphics/canvas_clock.asp}
 * Also, check out {@link https://gist.github.com/fixiecoder/a6146501aaa8ad3bf885fa30a66ba079}
 */


/**
 * @description Defines the content of a hand element
 */
interface Hands { [key: string]: {
                     length: number;
                     color: string;
                     width: number;
                 };
}

/** @classdesc Represents an analog clock */
class Clock {
  // By default document.createElement returns a HTMLElementtype which is a generic type.
  // In order to make your app understand it is a canvas element you need to cast it 
  private readonly canvas: HTMLCanvasElement = document.createElement('CANVAS') as HTMLCanvasElement; // Creates A new HTML element: a canvas
  private readonly context: CanvasRenderingContext2D = this.canvas.getContext('2d')!;
  private radius: number = 0;
  private centerX: number = 0;
  private centerY: number = 0;
  private hands: Hands; 

  /**
   * @description Creates a clock
   * @param containerElement - The HTML that will include the clock
   * @param size - clock size
   */
  constructor(private readonly containerElement: HTMLElement, private readonly size: number) {
    this.radius = 0.95 * (this.size / 2);
    this.hands = {
      second: {
        length: this.radius * 0.90,
        color: 'lightgrey',
        width: this.radius * 0.01
      },
      minute: {
        length: this.radius * 0.90,
        color: 'darkgrey',
        width: this.radius * 0.03
      },
      hour: {
        length: this.radius * 0.7,
        color: 'black',
        width: this.radius * 0.05
      }
    };
    this.canvas.width = this.size;
    this.canvas.height = this.size;
    this.containerElement.appendChild(this.canvas); // Adds the canvas HTML element as a 'child' of the containerElement (body)
    this.centerX = this.canvas.width / 2;
    this.centerY = this.canvas.height / 2;
    this.context.translate(this.centerX, this.centerY);

    // this.render = this.render.bind(this);
    // this.render();
    // setInterval(this.render, 1000);  // An alternative for animation

    this.renderArrow();
  }

  /**
   * @description Draws the clock face
   * @param context - Canvas Drawing Context
   */
  private drawClockFace(context: CanvasRenderingContext2D): void {
    const FILL_STYLE: string = 'slategray'; // For gradient (external ring)

    // Draw the white clock Face
    context.beginPath();
    context.arc(0, 0, this.radius, 0, 2 * Math.PI);
    context.fillStyle = 'white';
    context.fill();

    // Create a radial gradient (95% and 105% of radius):
    //                                     createRadialGradient(x0, y0, r0,              x1, y1, r1);
    let gradient: CanvasGradient = context.createRadialGradient(0, 0, this.radius * 0.95, 0, 0, this.radius * 1.05);

		// Create 3 color stops, corresponding with the inner, middle, and outer edge of the arc:
    gradient.addColorStop(0, FILL_STYLE);
    gradient.addColorStop(0.5, 'white');
    gradient.addColorStop(1, FILL_STYLE);

    // Define the gradient as the stroke style of the drawing object:
    context.strokeStyle = gradient;
    context.lineWidth = this.radius * 0.1;
    context.stroke();

    // Draw the cental black button
    context.beginPath();
    context.arc(0, 0, this.radius * 0.1, 0, 2 * Math.PI);
    context.fillStyle = FILL_STYLE;
    context.fill();
    return;
  }

  /**
   * @description Draws the clock numbers
   * @param context - Canvas Drawing Context
   */
  private drawNumbers(context: CanvasRenderingContext2D): void {
    context.font = this.radius * 0.15 + 'px arial';
    context.fillStyle = 'black'; // Numbers color
    context.textBaseline = 'middle';
    context.textAlign = 'center';
    for (let hour = 1; hour <= 12; hour++) {
      const RATIO: number = 0.85; // 85%
      const ANGLE: number = hour * Math.PI / 6; // Pi/6 = 2*Pi/12
      context.rotate(ANGLE);
      context.translate(0, -this.radius * RATIO);
      context.rotate(-ANGLE);
      context.fillText(String(hour), 0, 0);
      context.rotate(ANGLE);
      context.translate(0, this.radius * RATIO);
      context.rotate(-ANGLE);
    }
    return;
  }

  /**
   * @description Draws each of the clock hands
   * @param handType- Hand type ('second' | 'minute' | 'hour')
   * @param context - Canvas Drawing Context
   */
  private drawHand(handType: string, context: CanvasRenderingContext2D): void {
    const NOW: Date = new Date();
    const SECONDS: number = NOW.getSeconds();
    const MINUTES: number = NOW.getMinutes();
    const HOURS: number = NOW.getHours() % 12;
    const HAND = this.hands[handType];
    let angle: number = 0;

	  switch(handType) {
		  case 'second':
			  angle = (SECONDS * Math.PI / 30);
			  break;
		  case 'minute':
			  angle = (MINUTES * Math.PI / 30) + (SECONDS * Math.PI / (30 * 60));
			  break;
		  case 'hour':
			  angle =  (HOURS * Math.PI / 6) + (MINUTES * Math.PI / (6 * 60)) + (SECONDS * Math.PI / (360 * 60));
			  break;
			default: 
			  throw new Error('Error in handType');
			  break;
		}
    context.beginPath();
    context.lineWidth = HAND.width;
    context.lineCap = 'round';
    context.strokeStyle = HAND.color;
    context.moveTo(0, 0);
    context.rotate(angle);
    context.lineTo(0, -HAND.length);
    context.stroke();
    context.rotate(-angle);
    return;
  }

  /** @description Draws the clock hands */
  private draw3Hands(): void {
    this.drawHand('second', this.context);
    this.drawHand('minute', this.context);
    this.drawHand('hour', this.context);
    return;
  }

  /**
   * @description Draws the central golden circle over the hands
   * @param context  - Canvas Drawing Context
   */
  private drawCentralCircle(context: CanvasRenderingContext2D): void {
    context.beginPath();
    context.arc(0, 0, this.radius * 0.04, 0, 2 * Math.PI);
    context.fillStyle = 'goldenrod';
    context.fill();
    return;
  }

  /** 
    * @description Draws the clock and performs it's animation 
    * Alternatively, the render method can be written as an arrow function (renderArrow)
    */
  public render(): void {
    this.drawClockFace(this.context);
    this.drawNumbers(this.context);
    this.draw3Hands();
    this.drawCentralCircle(this.context);
    requestAnimationFrame(this.render);  // Animate the clock
    return;
  }

  /** 
   * @description Draws the clock and performs it's animation 
   * In this case (arrow function), the binding done in the constructor can be avoided:
   *    this.render = this.render.bind(this);
   */
  public renderArrow = (): void => {
    this.drawClockFace(this.context);
    this.drawNumbers(this.context);
    this.draw3Hands();
    this.drawCentralCircle(this.context);
    requestAnimationFrame(this.renderArrow);  // Animate the clock
    return;
  }
}

/** https://www.w3schools.com/jsref/prop_doc_body.asp
 *  constructor(containerElement, size)
 *  Notice: the HTML code for the clock does not contain a canvas tag:
 *          the canvas is created in the TS code (in the class constructor)
 */ 
function main(): void {
  const clock: Clock = new Clock(document.body, 800);
// console.log(clock);
}

main();
