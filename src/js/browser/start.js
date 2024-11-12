import UIkit from 'uikit';
import Icons from 'uikit/dist/js/uikit-icons';
import 'uikit/dist/css/uikit.min.css';
import { startSocketClient } from './ui/start.js';

// loads the Icon plugin
UIkit.use(Icons);

export async function start () {
  let dom, parent;
  parent = document.querySelector ('#app');
  if (parent) {
    dom = document.createElement ('tm-code-coverage-app');
    parent.appendChild (dom);
  }
  startSocketClient ({ onRefresh });
}

export async function onRefresh () {
  let dom;
  dom = document.querySelector ('iframe.code.coverage.preview');
  if (dom) {
    console.log ('refresh the page...');
    dom.contentWindow.location.reload ();
  }

  dom = document.querySelector ('.current.time');
  if (dom) {
    dom.textContent = Date.now ();
  }
}

start ();
