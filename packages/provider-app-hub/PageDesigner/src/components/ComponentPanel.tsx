import React from 'react';
import ComponentPanel from '@engin/visual-editor/components/ComponentPanel';
import DatasourcePanel from './DatasourcePanel';

const ComponentPanelCustom = (props) => {
  return (
    <div>
      ComponentPanelCustom
      <DatasourcePanel />
      <ComponentPanel {...props} />
    </div>
  );
};

export default ComponentPanelCustom;
