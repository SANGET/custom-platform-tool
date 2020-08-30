import VisualEditorStoreConnector from "@engine/visual-editor/core/visual-app-connector";
import PageDesigner from "./app";
import registerComponents from './ComponentsSpec/register';

/**
 * 注册业务组件
 */
registerComponents();

const App = VisualEditorStoreConnector(PageDesigner);

export default App;
