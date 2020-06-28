import React from 'react';
import { Tabs, Tab } from '@infra/ui-interface';

import DragItem from './DragItem';

interface ComponentItem {
  type: 'container' | 'component'
  id: string
  label: string;
  // TODO: 绑定可编辑的属性
  properties: {

  }
}

export interface ComponentPanelProps {
  componentConfig: {
    tabGroup: ({
      title: string,
      itemsGroups: ({
        title: string
        items: ComponentItem[]
      })[]
    })[]
  }
}

const ComponentPanel: React.SFC<ComponentPanelProps> = ({
  componentConfig
}) => {
  const { tabGroup } = componentConfig;
  const handleChange = () => {
    console.log('object');
  };
  return (
    <div>
      ComponentPanel
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
                          items.map((itm, __idx) => {
                            const {
                              id, label
                            } = itm;
                            return (
                              <div key={id}>
                                <DragItem
                                  entityClass={{
                                    ...itm,
                                  }}
                                >
                                  {label}
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
  componentConfig: {
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
                properties: {

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
                  type: 'flex',
                },
                label: 'Flex 布局',
                type: 'container',
                properties: {

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
