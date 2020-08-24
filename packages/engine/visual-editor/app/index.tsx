import React from "react";
import ReactDOM from 'react-dom';

import Connector from './visual-app-connector';
import VisualEditorApp from './main';

const App = Connector(VisualEditorApp);

ReactDOM.render(
  <App />,
  document.querySelector('#Main')
);
