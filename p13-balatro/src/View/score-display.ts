/**
 * Universidad de La Laguna
 * Escuela Superior de Ingeniería y Tecnología
 * Grado en Ingeniería Informática
 * Programación de Aplicaciones Interactivas
 * @author Adrián Pérez Poleo
 * @since Apr 29, 2026
 * @desc Class that displays the needed points to win the game.
 */

export class ScoreDisplay {
  /** Text showing the number of points needed to pass the round. */
  private readonly remainingPointsText: HTMLParagraphElement;
  /** Progress bar that displays the remaining points needed. */
  private readonly progressBar: HTMLProgressElement;
  /** Text containing the percentage of the needed points in the round that have been earned. */
  private readonly percentageText: HTMLParagraphElement;
  /** Number of points needed to win the round. */
  private totalPointsNeeded: number = 0;

  /**
   * Creates a new instance of the class.
   */
  constructor(containerId: string) {
    const scoreDiv = document.getElementById(containerId) as HTMLDivElement;

    this.remainingPointsText = document.createElement('p') as HTMLParagraphElement;
    scoreDiv.appendChild(this.remainingPointsText);
    this.remainingPointsText.innerText = `Goal: ${this.totalPointsNeeded} pts`;
    this.remainingPointsText.classList.add('has-text-yellow');

    this.progressBar = document.createElement('progress') as HTMLProgressElement;
    scoreDiv.appendChild(this.progressBar);
    this.progressBar.classList.add('progress');
    this.progressBar.classList.add('is-purple');
    this.progressBar.max = 100;
    this.progressBar.value = 0;

    this.percentageText = document.createElement('p') as HTMLParagraphElement;
    scoreDiv.appendChild(this.percentageText);
    this.percentageText.classList.add('has-text-gray');
    this.percentageText.innerText = 'Accumulated: 0 pts (0%)';
  }

  /**
   * Modifies the number of points needed to win the round.
   * @param totalPoints Number of points needed to win the round.
   */
  setTotalNeededPoints(totalPoints: number): void {
    this.totalPointsNeeded = totalPoints;
    this.updateNeededPoints(totalPoints);
  }

  /**
   * Updates the number of needed points to win the round.
   * @param newNeededPoints New amount of points needed.
   */
  updateNeededPoints(newNeededPoints: number): void {
    this.remainingPointsText.innerText = `Goal: ${this.totalPointsNeeded} pts`;
    let obtainedPoints: number = this.totalPointsNeeded - newNeededPoints;
    obtainedPoints = Math.min(obtainedPoints, this.totalPointsNeeded);
    this.progressBar.value = obtainedPoints / this.totalPointsNeeded * 100;
    this.percentageText.innerText = `Accumulated: ${obtainedPoints} pts (${(obtainedPoints * 100 / this.totalPointsNeeded).toFixed(2)}%)`;
  }
}