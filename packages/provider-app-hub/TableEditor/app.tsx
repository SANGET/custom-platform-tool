import React from "react";
import { ConfigProvider } from 'antd';
import zhCN from 'antd/es/locale/zh_CN';
import TableEditor from "./components/TableEditor";
import "./index.less";

const App: HY.SubApp = (props) => {
  return (

    <ConfigProvider locale={zhCN}>
      <div className="page-list-container">
        <TableEditor />
      </div>
    </ConfigProvider>
  );
};

export default App;
