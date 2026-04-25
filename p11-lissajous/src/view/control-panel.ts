/**
 * Universidad de La Laguna
 * Escuela Superior de Ingeniería y Tecnología
 * Grado en Ingeniería Informática
 * Programación de Aplicaciones Interactivas 2025-2026
 *
 * @author Sergio Rosales Calzadilla alu010635590@ull.edu.es
 * @since Apr 19 2026
 * @desc ControlPanel class.
 * Manages UI inputs using Bulma classes and ULL identity.
 */

export class ControlPanel {
  private readonly container: HTMLElement;
  private readonly inputs: Map<string, { text: HTMLInputElement, slider: HTMLInputElement }>;
  private readonly animateCheckbox: HTMLInputElement;

  constructor() {
    this.container = document.createElement('div');
    this.container.className = 'p-4'; 
    this.inputs = new Map();

    this.addControl('a', 'Frequency a', '1', '20', '7');
    this.addControl('b', 'Frequency b', '1', '20', '6');
    this.addControl('A', 'Amplitude A', '10', '300', '100');
    this.addControl('B', 'Amplitude B', '10', '300', '100');
    this.addControl('phi', 'Phase phi (rad)', '0', '2.0', '0.66', '0.01');

    this.animateCheckbox = this.createAnimationSwitch();
  }

  private addControl(id: string, labelText: string, min: string, max: string, value: string, step: string = '1'): void {
    const field = document.createElement('div');
    field.className = 'field mb-3';

    const label = document.createElement('label');
    label.className = 'label is-size-7 mb-1';
    label.innerText = labelText;

    const control = document.createElement('div');
    control.style.whiteSpace = 'nowrap';

    const textInput = document.createElement('input');
    textInput.className = 'input is-small is-primary';
    textInput.type = 'text';
    textInput.value = value;
    textInput.style.width = '55px';
    textInput.style.display = 'inline-block';

    const slider = document.createElement('input');
    slider.type = 'range';
    slider.min = min;
    slider.max = max;
    slider.step = step;
    slider.value = value;
    slider.style.width = '160px';
    slider.style.marginLeft = '10px';
    slider.style.verticalAlign = 'middle';

    textInput.addEventListener('input', () => slider.value = textInput.value);
    slider.addEventListener('input', () => textInput.value = slider.value);

    control.appendChild(textInput);
    control.appendChild(slider);
    field.appendChild(label);
    field.appendChild(control);
    this.container.appendChild(field);
    
    this.inputs.set(id, { text: textInput, slider: slider });
  }

  private createAnimationSwitch(): HTMLInputElement {
    const field = document.createElement('div');
    field.className = 'field mt-4';
    
    const label = document.createElement('label');
    label.className = 'checkbox is-size-7';
    
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.style.marginRight = '8px';
    
    label.appendChild(checkbox);
    label.appendChild(document.createTextNode(' Animate phi'));
    field.appendChild(label);
    this.container.appendChild(field);

    return checkbox;
  }
  
  getValues(): any {
    return {
      a: parseFloat(this.inputs.get('a')!.text.value) || 1,
      b: parseFloat(this.inputs.get('b')!.text.value) || 1,
      ampA: parseFloat(this.inputs.get('A')!.text.value) || 10,
      ampB: parseFloat(this.inputs.get('B')!.text.value) || 10,
      phi: parseFloat(this.inputs.get('phi')!.text.value) || 0,
      animate: this.animateCheckbox.checked
    };
  }

  setPhaseValue(value: number): void {
    const phi = this.inputs.get('phi');
    if (phi) {
      phi.text.value = value.toFixed(2);
      phi.slider.value = value.toFixed(2);
    }
  }

  onParameterChange(callback: () => void): void {
    this.inputs.forEach(control => {
      control.text.addEventListener('input', callback);
      control.slider.addEventListener('input', callback);
    });
    this.animateCheckbox.addEventListener('change', callback);
  }

  getElement(): HTMLElement {
    return this.container;
  }
}