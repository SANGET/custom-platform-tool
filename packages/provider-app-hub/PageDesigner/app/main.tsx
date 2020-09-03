import VisualEditorStoreConnector from "@engine/visual-editor/core/visual-app-connector";
import PageDesigner from "./app";
import registerComponents from '../ComponentsSpec/register';

/**
 * 注册业务组件
 */
registerComponents();

// const App: HY.SubApp = VisualEditorStoreConnector(PageDesigner, 'pagePath');
const App: HY.SubAppHOC = (props) => {
  const {
    location, pagePath
  } = props;
  return VisualEditorStoreConnector(PageDesigner, pagePath);
};

export default App;
