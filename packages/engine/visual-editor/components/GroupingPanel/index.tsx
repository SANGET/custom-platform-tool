import React from 'react';
import { Tabs, Tab } from '@infra/ui';

import DragItem, { DragItemConfig } from '@engine/visual-editor/spec/DragItem';
import { EditorComponentClass } from '../../types';

export interface PanelItemsGroup {
  title: string
  items: EditorComponentClass[]
}

export interface PanelTabGroupItem {
  title: string
  itemsGroups: PanelItemsGroup[]
}

export interface ComponentPanelConfig {
  tabGroup: PanelTabGroupItem[]
}

export interface ComponentPanelProps {
  /** 组件 panel 的配置 */
  componentPanelConfig: ComponentPanelConfig
  /** 可拖拽 item 的包装器 interface */
  itemWrapper?: (item: EditorComponentClass) => React.ReactChild
  /** 控制 DragItem 的 drag 配置的 interface，详情参考 react-dnd */
  getDragItemConfig?: (item: EditorComponentClass) => DragItemConfig
}

const ComponentPanel = ({
  componentPanelConfig,
  itemWrapper,
  getDragItemConfig
}: ComponentPanelProps) => {
  const { tabGroup } = componentPanelConfig;

  /**
   * 处理 Tabs 更改事件
   */
  const handleChange = () => {
    console.log('handleChange');
  };

  return (
    <div>
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
                      <div key={`${idx}_${_idx}`}>
                        <h5>{igTitle}</h5>
                        {
                          items.map((componentClass, __idx) => {
                            const {
                              id, label
                            } = componentClass;
                            return (
                              <div key={id}>
                                <DragItem
                                  dragConfig={getDragItemConfig ? getDragItemConfig(componentClass) : {}}
                                  dragItemClass={{
                                    ...componentClass,
                                  }}
                                >
                                  {
                                    typeof itemWrapper === 'function' ? itemWrapper(componentClass) : label
                                  }
                                </DragItem>
                              </div>
                            );
                          })
                        }
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

ComponentPanel.defaultProps = {
  componentPanelConfig: {
    tabGroup: [
      {
        title: '控件类型',
        itemsGroups: [
          {
            title: '基础控件',
            items: [
              {
                id: 'com1',
                component: 'Input',
                label: '文本框',
                type: 'component',
                bindProperties: {
                  propRefs: ['propID-1', 'propID-2']
                }
              }
            ]
          },
          {
            title: '布局',
            items: [
              {
                id: 'con1',
                layout: {
                  type: 'flex', // 布局方式
                  props: {
                    justifyContent: 'start',
                    justifyItems: 'start'
                  }
                },
                label: 'Flex 布局',
                type: 'container',
                bindProperties: {
                  propRefs: ['propID-1', 'propID-2', 'propID-3', 'propID-4', 'propID-5']
                }
              }
            ]
          },
        ]
      },
    ]
  }
};

export default ComponentPanel;
