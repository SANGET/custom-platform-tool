import React from "react";
import ReactDOM from 'react-dom';

import VEStateConnector from '../core/visual-app-connector';
import VisualEditorApp from './app';

// import registerComponents from './Components/register';

/**
 * step1，先注册组件
 */
// registerComponents();

/**
 * step2，将可视化编辑器引擎的状态管理连接到 UI 应用
 */
const App = VEStateConnector(VisualEditorApp, 'visual-editor');

ReactDOM.render(
  <App />,
  document.querySelector('#Main')
);
