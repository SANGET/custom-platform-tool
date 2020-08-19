import React from "react";
import ReactDOM from 'react-dom';

import Connector from './connect-app';
import VisualEditorApp from './main';

const App = Connector(VisualEditorApp);

ReactDOM.render(
  <App />,
  document.querySelector('#Main')
);
