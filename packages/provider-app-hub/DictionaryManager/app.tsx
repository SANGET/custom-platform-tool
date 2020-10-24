import React from "react";
import { ConfigProvider } from 'antd';
import zhCN from 'antd/es/locale/zh_CN'; // 引入中文包
import DictionaryList from "./components/DictionaryList";

import "./index.less";

const App: HY.SubApp = (props) => {
  return (
    <ConfigProvider locale={zhCN}>
      <div className="page-list-container">
        <DictionaryList />
      </div>
    </ConfigProvider>
  );
};

export default App;
