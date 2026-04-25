/**
 * Universidad de La Laguna ...
 */

import { LissajousCurveViewer } from './lissajous-curve-viewer.js';
import { ControlPanel } from './control-panel.js';
import { LissajousCurve } from '../model/lissajous-curve.js';

export class View {
  private readonly curveViewer: LissajousCurveViewer;
  private readonly controlPanel: ControlPanel;
  
  private readonly HEADER_HEIGHT: number = 80;
  private readonly FOOTER_HEIGHT: number = 40;
  private readonly INFO_HEIGHT: number = 100;
  private readonly SIDEBAR_WIDTH: number = 280;

  constructor() {
    this.createHeader();
    const availableHeight = window.innerHeight - this.HEADER_HEIGHT - this.FOOTER_HEIGHT - this.INFO_HEIGHT;
    const canvasWidth = window.innerWidth - this.SIDEBAR_WIDTH;
    
    this.curveViewer = new LissajousCurveViewer(canvasWidth, availableHeight);
    this.controlPanel = new ControlPanel();
    
    const mainContainer = document.createElement('main');
    mainContainer.style.height = `${availableHeight}px`;
    mainContainer.style.whiteSpace = 'nowrap';
    
    const canvasDiv = document.createElement('div');
    canvasDiv.style.display = 'inline-block';
    canvasDiv.style.verticalAlign = 'top';
    canvasDiv.style.width = `${canvasWidth}px`;
    canvasDiv.appendChild(this.curveViewer.getCanvasElement());
    
    const sidebarDiv = document.createElement('aside');
    sidebarDiv.className = 'has-background-white-ter';
    sidebarDiv.style.display = 'inline-block';
    sidebarDiv.style.verticalAlign = 'top';
    sidebarDiv.style.width = `${this.SIDEBAR_WIDTH}px`;
    sidebarDiv.style.height = '100%';
    sidebarDiv.style.borderLeft = '1px solid #dbdbdb';
    sidebarDiv.appendChild(this.controlPanel.getElement());
    
    mainContainer.appendChild(canvasDiv);
    mainContainer.appendChild(sidebarDiv);
    document.body.appendChild(mainContainer);
    
    this.createInfoSection();
    this.createFooter();
  }

  render(curve: LissajousCurve): void {
    this.curveViewer.render(curve);
  }

  /**
   * @description Creates the header without using innerHTML.
   */
  private createHeader(): void {
    const header = document.createElement('header');
    header.style.height = `${this.HEADER_HEIGHT}px`;
    header.style.padding = '15px 25px';
    const title = document.createElement('h1');
    title.className = 'title is-4 has-text-white mb-1';
    title.textContent = 'Sergio Rosales Calzadilla';
    const subtitle = document.createElement('p');
    subtitle.className = 'is-size-6 has-text-white';
    subtitle.textContent = 'Lissajous Curves Simulation';
    header.appendChild(title);
    header.appendChild(subtitle);
    document.body.appendChild(header);
  }

  /**
   * @description Creates the info section.
   */
  private createInfoSection(): void {
    const info = document.createElement('section');
    info.className = 'has-background-light px-5 py-2';
    info.style.height = `${this.INFO_HEIGHT}px`;
    info.style.borderTop = '1px solid #dbdbdb';
    const aboutDiv = document.createElement('div');
    aboutDiv.style.width = '70%';
    aboutDiv.style.display = 'inline-block';
    aboutDiv.style.verticalAlign = 'top';
    const aboutTitle = document.createElement('h2');
    aboutTitle.className = 'subtitle is-6 mb-1';
    const strongAbout = document.createElement('strong');
    strongAbout.textContent = 'About Lissajous Curves';
    aboutTitle.appendChild(strongAbout);
    const aboutText = document.createElement('p');
    aboutText.className = 'is-size-7';
    aboutText.textContent = 'A point subjected to two perpendicular simple harmonic motions.';
    aboutDiv.appendChild(aboutTitle);
    aboutDiv.appendChild(aboutText);
    const refDiv = document.createElement('div');
    refDiv.style.width = '25%';
    refDiv.style.display = 'inline-block';
    refDiv.style.verticalAlign = 'top';
    refDiv.style.marginLeft = '20px';
    const refTitle = document.createElement('h2');
    refTitle.className = 'subtitle is-6 mb-1';
    const strongRef = document.createElement('strong');
    strongRef.textContent = 'References';
    refTitle.appendChild(strongRef);
    const buttonsDiv = document.createElement('div');
    buttonsDiv.className = 'buttons';
    const wikiLink = document.createElement('a');
    wikiLink.href = 'https://en.wikipedia.org/wiki/Lissajous_curve';
    wikiLink.target = '_blank';
    wikiLink.className = 'button is-small is-primary is-outlined';
    wikiLink.textContent = 'Wiki';
    const refLink = document.createElement('a');
    refLink.href = 'https://academo.org/demos/lissajous-curves/';
    refLink.target = '_blank';
    refLink.className = 'button is-small is-primary is-outlined';
    refLink.textContent = 'Ref';
    buttonsDiv.appendChild(wikiLink);
    buttonsDiv.appendChild(refLink);
    refDiv.appendChild(refTitle);
    refDiv.appendChild(buttonsDiv);
    info.appendChild(aboutDiv);
    info.appendChild(refDiv);
    document.body.appendChild(info);
  }

  private createFooter(): void {
    const footer = document.createElement('footer');
    footer.className = 'has-text-centered has-text-grey is-size-7 pt-2 has-background-white';
    footer.style.height = `${this.FOOTER_HEIGHT}px`;
    footer.textContent = 'PAI - Grado en Ingeniería Informática - ULL - 2026';
    document.body.appendChild(footer);
  }

  getControlPanel(): ControlPanel { return this.controlPanel; }
}