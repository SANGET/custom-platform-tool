/**
 * @author zxj
 *
 * 组件类面板不做组件实例渲染
 */

import React from 'react';
import { Tabs, Tab } from '@infra/ui';

import DragItem, { DragItemConfig } from '@engine/visual-editor/spec/DragItem';
import { EditorComponentClass, ComponentPanelConfig } from '@engine/visual-editor/types';
import { DragableItemTypes } from '../../spec';

export interface ComponentPanelProps {
  /** 组件 panel 的配置 */
  componentPanelConfig: ComponentPanelConfig
  compClassDeclares: any
  /** 可拖拽 item 的包装器 interface */
  itemWrapper?: (item: EditorComponentClass) => React.ReactChild
  /** 控制 DragItem 的 drag 配置的 interface，详情参考 react-dnd */
  getDragItemConfig?: (item: EditorComponentClass) => DragItemConfig
}

const ComponentPanel: React.FC<ComponentPanelProps> = ({
  componentPanelConfig,
  compClassDeclares,
  itemWrapper,
  getDragItemConfig
}) => {
  const { tabGroup } = componentPanelConfig;

  /**
   * 处理 Tabs 更改事件
   */
  const handleChange = () => {
    console.log('handleChange');
  };

  return (
    <div
      className="component-panel-container"
    >
      <Tabs
        onChangeTab={handleChange}
      >
        {
          tabGroup.map((tg, idx) => {
            const {
              title: tgTitle,
              itemsGroups
            } = tg;
            return (
              <Tab label={tgTitle} key={idx}>
                {
                  itemsGroups.map((ig, _idx) => {
                    const {
                      title: igTitle,
                      items
                    } = ig;
                    return (
                      <div key={`${idx}_${_idx}`} className="drag-item-group">
                        <div className="group-title">
                          {igTitle}
                        </div>
                        <div className="drag-items">
                          {
                            items.map((componentClassID, __idx) => {
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
                                  {
                                    typeof itemWrapper === 'function' ? itemWrapper(componentClass) : label
                                  }
                                </DragItem>
                              );
                            })
                          }
                        </div>
                      </div>
                    );
                  })
                }
              </Tab>
            );
          })
        }
      </Tabs>
    </div>
  );
};

export default ComponentPanel;
