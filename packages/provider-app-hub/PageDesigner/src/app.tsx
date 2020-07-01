import React from "react";

import DatasourcePanel from './components/DatasourcePanel';
import BusinessComponentPanel from './components/BusinessComponentPanel';
import CanvasContainer from './components/CanvasContainer';
import PropertiesEditor from './components/PropertiesEditor';

const PageDesignerApp = () => {
  return (
    <div>
      <h3>页面设计器</h3>
      <div className="left-panel">
        <DatasourcePanel />
        <BusinessComponentPanel />
      </div>
      <div className="canvas-container">
        <CanvasContainer />
      </div>
      <div className="right-panel">
        <PropertiesEditor />
      </div>
    </div>
  );
};

export { PageDesignerApp };
