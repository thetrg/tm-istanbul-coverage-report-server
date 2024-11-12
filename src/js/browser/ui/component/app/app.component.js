import TEMPLATE from './app.html?raw';
import './app.less';

export const TAG_NAME = 'tm-code-coverage-app';

export class AppComponent extends HTMLElement {
  connectedCallback () {
    let dom;
    dom = this;
    dom.className = 'component tm code coverage app';
    dom.innerHTML = TEMPLATE;
  }
}
