import React, { useCallback, useMemo } from 'react';
import ComponentPanel, { ComponentPanelProps } from '@engine/visual-editor/components/ComponentPanel';
import DragItem, { DragItemConfig } from '@engine/visual-editor/spec/DragItem';
import { DragableItemTypes } from '@engine/visual-editor/spec';
import DatasourcePanel from './DatasourcePanel';

export type PageDesignerComponentPanelProps = ComponentPanelProps

const itemRendererFac = (
  compClassDeclares, getDragItemConfig
) => (componentClassID, groupType) => {
  const componentClass = compClassDeclares[componentClassID];
  const {
    id, label
  } = componentClass;
  switch (groupType) {
    case 'dragableItems':
      return (
        <DragItem
          className="drag-comp-item"
          type={DragableItemTypes.DragItemClass}
          dragConfig={getDragItemConfig ? getDragItemConfig(componentClass) : {}}
          dragItemClass={{
            ...componentClass,
          }}
        >
          {label}
        </DragItem>
      );
    case 'dataSource':
      return (
        <div>asd</div>
      );
    default:
      break;
  }
};

const ComponentPanelCustom: React.FC<PageDesignerComponentPanelProps> = ({
  compClassDeclares,
  getDragItemConfig,
  ...other
}) => {
  const itemRenderer = useMemo(
    () => itemRendererFac(compClassDeclares, getDragItemConfig),
    [compClassDeclares, getDragItemConfig],
  );
  return (
    <ComponentPanel
      {...other}
      itemRenderer={itemRenderer}
    />
  );
};

export default ComponentPanelCustom;
