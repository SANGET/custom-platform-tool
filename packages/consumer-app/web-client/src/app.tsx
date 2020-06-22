import React from "react";
import ReactDOM from "react-dom";

import AppContainer from './app-container';

const App = () => {
  return (
    <AppContainer>
      <h3>应用平台</h3>
    </AppContainer>
  );
};

ReactDOM.render(
  <App />,
  document.querySelector("#Main")
);
