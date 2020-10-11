import React from "react";
import TableEditor from "./components/TableEditor";
import "./index.less";

const App: HY.SubApp = (props) => {
  return (
    <div className="page-list-container">
      <TableEditor />
    </div>
  );
};

export default App;
