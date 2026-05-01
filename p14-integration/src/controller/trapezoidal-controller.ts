/**
 * Universidad de La Laguna
 * Escuela Superior de Ingeniería y Tecnología
 * Grado en Ingeniería Informática
 * Programación de Aplicaciones Interactivas 2024-2025
 *
 * @author Eric Rios Hamilton
 * @since May 1, 2025
 * @description TrapezoidalController class for the Trapezoidal Rule Calculator
 *
 */

import { Controller } from '../mvc/controller.ts';
import { TrapezoidalData } from '../model/trapezoidal-data.ts';
import { TrapezoidalUpdate } from '../model/trapezoidal-update.ts';
import { View } from '../mvc/view.ts';
import { Model } from '../mvc/model.ts';

export class TrapezoidalController implements Controller<string, TrapezoidalUpdate> {
  constructor(
    private model: Model<TrapezoidalData>,
    private view: View<TrapezoidalData, string, TrapezoidalUpdate>,
  ) {
    this.model.subscribe((state: TrapezoidalData) => {
      this.view.render(state);
    });
  }

  /**
   * @description Initializes the controller and binds events to the view.
   * @param initialValue The initial value to set the model to
   */
  public initialize(initialValue: TrapezoidalUpdate): void {
    this.model.initialize(initialValue);
    this.view.bindEvents(this);
    this.view.render(this.model.getState());
  }

  /**
   * @description Updates the model with the given event information and payload.
   * @param eventInfo The event information to be passed to the model
   * @param payload The event payload to be passed to the model
   */
  public onUpdate(eventInfo: string, payload: TrapezoidalUpdate): void {
    this.model.update(eventInfo, payload);
  }
}