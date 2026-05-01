/**
 * Universidad de La Laguna
 * Escuela Superior de Ingeniería y Tecnología
 * Grado en Ingeniería Informática
 * Programación de Aplicaciones Interactivas 2024-2025
 *
 * @author Eric Rios Hamilton
 * @since May 1, 2025
 * @description TrapezoidalModel class for the Trapezoidal Rule Calculator.
 *
 */

import { Model } from '../mvc/model.ts';
import { TrapezoidalData } from './trapezoidal-data.ts';
import { TrapezoidalUpdate } from './trapezoidal-update.ts';
import { CurveComputer } from './curve-computer.ts';
import { TrapezoidalCalculator } from './trapezoid-calculator.ts';
import { MathJsFunction } from './math-js-function.ts';

export class TrapezoidalModel implements Model<TrapezoidalData, TrapezoidalUpdate, string> {
  private readonly pointCount = 100000;
  private state: TrapezoidalData = {
    curvePoints: [],
    trapezoids: [],
    update: {
      expression: '',
      numberOfTrapezoids: 0,
      xStart: 0,
      xEnd: 0,
    },
  };
  private observers: ((state: TrapezoidalData, eventInfo?: string | undefined) => void)[] = [];

  /**
   * @description Gets the current state of the model.
   * @returns The current state of the model
   */
  public getState(): TrapezoidalData {
    return this.state;
  }

  /**
   * @description Initializes the model with the given initial value.
   * @param initialValue The value to be set to the model
   */
  public initialize(initialValue: TrapezoidalUpdate): void {
    this.state.update = initialValue;
    this.updateTrapezoids(initialValue);
    this.notifyObservers('INITIALIZE');
  }

  /**
   * @description Subscribes a listener to the model. The listener will be called when the state changes.
   * @param listener The listener to be called when the state changes
   */
  public subscribe(listener: (state: TrapezoidalData, eventInfo?: string | undefined) => void): void {
    this.observers.push(listener);
  }

  /**
   * @description Updates the model with the given event information and payload.
   * @param action The event information to be passed to the model
   * @param payload the event payload to be passed to the model
   */
  public update(action: string, payload?: TrapezoidalUpdate): void {
    switch (action) {
      case 'UPDATE':
        this.state.update = payload as TrapezoidalUpdate;
        this.updateTrapezoids(payload as TrapezoidalUpdate);
        break;
    }
  }

  /**
   * @description Updates the trapezoids in the model with the given payload.
   * @param payload The payload containing the expression, xStart, xEnd, and numberOfTrapezoids
   */
  private updateTrapezoids(payload: TrapezoidalUpdate): void {
    const filteredPayload = Object.fromEntries(
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      Object.entries(payload).filter(([_, value]) => value != null)
    );
    this.state.update = Object.assign({}, this.state.update, filteredPayload);
    const { expression, xStart, xEnd, numberOfTrapezoids } = this.state.update;
    const mathFunction = new MathJsFunction(expression!);
    const graphComputer = new CurveComputer(mathFunction, xStart!, xEnd!, this.pointCount);
    this.state.curvePoints = graphComputer.getPoints();
    this.state.trapezoids = TrapezoidalCalculator.calculateTrapezoids(
      this.state.curvePoints,
      { expression, xStart, xEnd, numberOfTrapezoids }
    );
    this.notifyObservers('UPDATE');
  }

  /**
   * @description Notifies all observers of the model about the state change.
   * @param eventInfo The event information to be passed to the observers
   */
  private notifyObservers(eventInfo?: string): void {
    for (const observer of this.observers) {
      observer(this.state, eventInfo);
    }
  }
}