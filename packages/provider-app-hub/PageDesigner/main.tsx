import VisualEditorStoreConnector from "@engine/visual-editor/core/visual-app-connector";
import PageDesigner from "./app";

/**
 * 注册业务组件
 */

const App: HY.SubAppHOC = (props) => {
  const {
    appLocation, pagePath
  } = props;
  return VisualEditorStoreConnector(PageDesigner, pagePath);
};

export default App;
