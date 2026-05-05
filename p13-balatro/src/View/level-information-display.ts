/**
 * Universidad de La Laguna
 * Escuela Superior de Ingeniería y Tecnología
 * Grado en Ingeniería Informática
 * Programación de Aplicaciones Interactivas
 * @author Adrián Pérez Poleo
 * @since May 04, 2026
 * @desc Class that displays the current Balatro Level information
 */

/**
 * Class thta displays the level information.
 */
export class LevelInformationDisplay {
  /** Text element that displays the number of cards in the deck. */
  private readonly deckText: HTMLParagraphElement;

  /**
   * Creates a new panel with the Level Information
   * @param containerId Name of the container where the Level Information will be displayed
   */
  constructor(containerId: string) {
    const container = document.getElementById(containerId) as HTMLDivElement;
    if (!container) throw new Error(`No se encontró el contenedor ${containerId}`);
    container.innerHTML = '';

    const columnsDiv = document.createElement('div') as HTMLDivElement;
    columnsDiv.className = 'columns';
    container.appendChild(columnsDiv);

    this.buildTextColumn(columnsDiv, 'is-4', 'has-text-white', 'Level 1: Small Blind');
    this.buildTextColumn(columnsDiv, 'is-2', 'has-text-cyan', 'Money: $5');
    this.buildTextColumn(columnsDiv, 'is-2', 'has-text-white', 'Round: 1');
    this.deckText = this.buildTextColumn(columnsDiv, 'is-3', 'has-text-purple', 'Deck: 44/52 cards');
    
    this.buildHelpButton(columnsDiv);  
  }

  /**
   * Updates the size of the deck after drawing cards.
   * @param currentSize Current size of the deck.
   * @param totalSize Total cards that were initially in the deck.
   */
  updateDeckSize(currentSize: number, totalSize: number = 52): void {
    this.deckText.innerText = `Deck: ${currentSize}/${totalSize} cards`;
  }

  /**
   * Creates a text element to display text.
   * @param parent Container where the column will be placed.
   * @param columnWidthClass Column width
   * @param textColorClass Color of the text
   * @param initialText Text that will be printed
   * @return Paragraph Element containing the information. 
   */
  private buildTextColumn(parent: HTMLElement, columnWidthClass: string, textColorClass: string, initialText: string): HTMLParagraphElement {
    const column = document.createElement('div');
    column.className = `column ${columnWidthClass}`;
    
    const textElement = document.createElement('p');
    textElement.className = `column ${textColorClass}`;
    textElement.innerText = initialText;
    
    column.appendChild(textElement);
    parent.appendChild(column);
    
    return textElement;
  }

  /**
   * Creqates a button with an interrogation mark.
   * @param parent Container where the butto will be placed.
   * @return Button that has been created. 
   */
  private buildHelpButton(parent: HTMLElement): HTMLButtonElement {
    const column = document.createElement('div');
    column.className = 'column';

    const button = document.createElement('button');
    button.className = 'button has-background-ull-purple is-medium has-text-danger';
    button.innerText = '?';

    column.appendChild(button);
    parent.appendChild(column);

    return button;
  }
}