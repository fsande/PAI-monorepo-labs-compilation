/**
 * Universidad de La Laguna
 * Escuela Superior de Ingeniería y Tecnología
 * Grado en Ingeniería Informática
 * Programación de Aplicaciones Interactivas
 * @author Adrián Pérez Poleo
 * @since Apr 25, 2026
 * @desc Class that displays a word on the screen, where each character is in a cell.
 */

export class WordViewer {
  /** Canvas where the word will be shown. */
  private readonly canvas: HTMLCanvasElement;
  /** Context used to draw in the canvas. */
  private readonly context: CanvasRenderingContext2D;
  /** Size of the cells containing the characters. */
  private readonly cellSize: number = 50;
  /** Space between the cells. */
  private readonly gap: number = 8;

  constructor() {
    const div = document.getElementById('word-viewer') as HTMLDivElement;
    this.canvas = document.createElement('canvas') as HTMLCanvasElement;
    this.context = this.canvas.getContext('2d')!;

    this.canvas.width = div.clientWidth;
    this.canvas.height = 100;
    div.appendChild(this.canvas);
  }

  /**
   * Displays a given word on the screen. Each character will be inside a white squared cell.
   * @param word Word to be displayed.
   */
  displayWord(word: string): void {
    const words = word.split(' ');
    const maxWidth = this.canvas.width - 40;
    const wordSpacing = this.cellSize * 1.2; 
    
    const lines: string[][] = [[]];
    let tempWidth = 0;

    words.forEach((singleWord) => {
      const wordWidth = singleWord.length * (this.cellSize + this.gap) + wordSpacing;
      if (tempWidth + wordWidth > maxWidth && tempWidth > 0) {
        lines.push([]); 
        tempWidth = 0;
      }
      lines[lines.length - 1].push(singleWord);
      tempWidth += wordWidth;
    });

    const requiredHeight = 40 + (lines.length * this.cellSize) + ((lines.length - 1) * 15);
    this.canvas.height = requiredHeight; 
    
    this.clearCanvas();
    let currentY = 20;

    lines.forEach((line) => {
      let lineWidth = 0;
      line.forEach(w => lineWidth += w.length * (this.cellSize + this.gap) + wordSpacing);
      lineWidth -= wordSpacing;

      let currentX = (this.canvas.width - lineWidth) / 2;

      line.forEach((singleWord) => {
        for (const char of singleWord) {
          this.displayCharacter(char, currentX, currentY);
          currentX += this.cellSize + this.gap;
        }
        currentX += wordSpacing; 
      });

      currentY += this.cellSize + 15; 
    });
  }

  /**
   * Removes the word displayed on the screen.
   */
  private clearCanvas(): void {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  /**
   * Draws a character inside a white squared cell.
   * @param char Character that will be displayed inside the cell
   * @param xCoordinate X coordinate of the top left corner of the cell.
   * @param yCoordinate Y coordinate of the top left corner of the cell.
   */
  private displayCharacter(char: string, xCoordinate: number, yCoordinate: number): void {
    this.context.save();

    this.context.fillStyle = 'white';
    this.context.fillRect(xCoordinate, yCoordinate, this.cellSize, this.cellSize);

    this.context.strokeStyle = 'lightgrey';
    this.context.lineWidth = 2;
    this.context.strokeRect(xCoordinate, yCoordinate, this.cellSize, this.cellSize);

    if (char !== '_') {
      this.context.fillStyle = 'darkslategray';
      this.context.font = `${this.cellSize * 0.6}px "Argentum Sans", sans-serif`;
      this.context.textAlign = 'center';
      this.context.textBaseline = 'middle';
      this.context.fillText(char.toUpperCase(), xCoordinate + (this.cellSize / 2), 
          yCoordinate + (this.cellSize / 2) + 3);
    }

    this.context.restore();
  }
}