/**
 * @author zxj
 *
 * 组件类面板不做组件实例渲染
 */

import React from 'react';

import DragItem, { DragItemConfig } from '@engine/visual-editor/spec/DragItem';
import { EditorComponentClass } from '@engine/visual-editor/types';
import { DragableItemTypes } from '../../spec';
import { GroupPanel, GroupPanelData } from '../GroupPanel';

export type ComponentPanelConfig = GroupPanelData

export interface ComponentPanelProps {
  /** 组件 panel 的配置 */
  componentPanelConfig: ComponentPanelConfig
  compClassDeclares: any
  /** 可拖拽 item 的包装器 interface */
  itemWrapper?: (item: EditorComponentClass) => React.ReactChild
  /** 控制 DragItem 的 drag 配置的 interface，详情参考 react-dnd */
  getDragItemConfig?: (item: EditorComponentClass) => DragItemConfig
  itemRenderer?: (a, b) => JSX.Element
}

const defaultItemRendererFac = (compClassDeclares, getDragItemConfig) => (componentClassID) => {
  const componentClass = compClassDeclares[componentClassID];
  const {
    id, label
  } = componentClass;
  return (
    <DragItem
      key={id} className="drag-comp-item"
      type={DragableItemTypes.DragItemClass}
      dragConfig={getDragItemConfig ? getDragItemConfig(componentClass) : {}}
      dragItemClass={{
        ...componentClass,
      }}
    >
      {label}
    </DragItem>
  );
};

const ComponentPanel: React.FC<ComponentPanelProps> = ({
  componentPanelConfig,
  compClassDeclares,
  itemRenderer,
  getDragItemConfig
}) => {
  /**
   * 处理 Tabs 更改事件
   */
  const handleChange = () => {
    // console.log('handleChange');
  };

  return (
    <div>
      <GroupPanel
        panelData={componentPanelConfig}
        className="component-panel-container"
        handleChange={handleChange}
        itemRenderer={itemRenderer ?? defaultItemRendererFac(compClassDeclares, getDragItemConfig)}
      />
    </div>
  );
};

export default ComponentPanel;
