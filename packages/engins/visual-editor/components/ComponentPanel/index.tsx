import React from 'react';
import { Tabs, Tab } from '@infra/ui-interface';

import DragItem from './DragItem';

export interface ComponentPanelProps {
  componentConfig: {
    tabGroup: ({
      title: string,
      itemsGroups: ({
        title: string
        items: ({
          id: string,
          component: string,
          label: string,
          type: 'component' | 'container',
        })[]
      })[]
    })[]
  }
}

const ComponentPanel = ({
  componentConfig
} : ComponentPanelProps) => {
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
                        <h3>{igTitle}</h3>
                        {
                          items.map((itm, __idx) => {
                            const {
                              component, id, label, type
                            } = itm;
                            return (
                              <div key={id}>
                                <DragItem
                                  entity={{
                                    id,
                                    component,
                                    type,
                                    properties: {

                                    }
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
                id: 'c1',
                component: 'Input',
                label: '文本框',
                type: 'component',
              }
            ]
          }
        ]
      },
    ]
  }
};

export default ComponentPanel;
