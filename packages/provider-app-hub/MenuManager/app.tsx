import React from "react";
import MenuList from "./pages/PageList";
import "./index.less";

const App: HY.SubApp = (props) => {
  return (
    <div className="page-list-container">
      <MenuList />
    </div>
  );
};

export default App;
