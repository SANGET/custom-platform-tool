import React from "react";
import DictionaryList from "./components/DictionaryList";
import "./index.less";

const App: HY.SubApp = (props) => {
  return (
    <div className="page-list-container">
      <DictionaryList />
    </div>
  );
};

export default App;
