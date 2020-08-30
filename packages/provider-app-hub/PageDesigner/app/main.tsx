import React from 'react';

import VisualEditorStoreConnector from "@engine/visual-editor/core/visual-app-connector";
import PageDesigner from "./app";
import registerComponents from './ComponentsSpec/register';

/**
 * 注册业务组件
 */
registerComponents();

// const App: HY.SubApp = VisualEditorStoreConnector(PageDesigner, 'pagePath');
const App: HY.SubApp = (props) => {
  const {
    location, pagePath
  } = props;
  /** TODO: 可能 PageDesigner 是一样的导致无法更新 */
  return VisualEditorStoreConnector(PageDesigner, pagePath);
  // return <A {...props} key={pagePath} />;
};

export default App;
