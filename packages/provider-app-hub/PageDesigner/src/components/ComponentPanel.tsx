import React from 'react';
import ComponentPanel from '@engine/visual-editor/components/ComponentPanel';
import DatasourcePanel from './DatasourcePanel';

const ComponentPanelCustom = (props) => {
  return (
    <div>
      自定义的组件类面板
      <DatasourcePanel />
      <ComponentPanel {...props} />
    </div>
  );
};

export default ComponentPanelCustom;
