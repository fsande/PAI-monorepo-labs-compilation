/**
 * Universidad de La Laguna
 * Escuela Superior de Ingeniería y Tecnología
 * Grado en Ingeniería Informática
 * Programación de Aplicaciones Interactivas 2025-2026
 *
 * @author Sergio Rosales Calzadilla alu010635590@ull.edu.es
 * @since Apr 19 2026
 * @desc Controller class.
 * Bridges the Model and View and manages the animation loop.
 */

import { LissajousCurveModel } from '../model/lissajous-curve-model.js';
import { View } from '../view/view.js';

export class Controller {
  private lastFrameTime: number = 0;
  constructor(private readonly model: LissajousCurveModel, private readonly view: View) {
    this.view.getControlPanel().onParameterChange(() => this.handleUserInteraction());
    this.lastFrameTime = performance.now();
    this.refreshView();
    requestAnimationFrame((time) => this.animationLoop(time));
  }

  /**
   * @description Synchronizes the model with the UI values.
   */
  private handleUserInteraction(): void {
    const values = this.view.getControlPanel().getValues();
    const curve = this.model.getCurve();  
    curve.setFrequencyA(values.a);
    curve.setFrequencyB(values.b);
    curve.setAmplitudeA(values.ampA);
    curve.setAmplitudeB(values.ampB);
    curve.setPhase(values.phi);
    this.model.setAnimationState(values.animate);
    if (!values.animate) {
      this.view.render(curve);
    }
  }

  /**
   * @description Main animation loop.
   */
  private animationLoop(currentTime: number): void {
    const deltaTime = (currentTime - this.lastFrameTime) / 1000;
    this.lastFrameTime = currentTime;
    if (this.model.getAnimationState()) {
      this.model.update(deltaTime);
      const curve = this.model.getCurve();
      this.view.render(curve);
      this.view.getControlPanel().setPhaseValue(curve.getPhase());
    }
    requestAnimationFrame((time) => this.animationLoop(time));
  }

  private refreshView(): void {
    this.view.render(this.model.getCurve());
  } 
}