/**
 * @author zxj
 *
 * 分组面板
 */

import React from 'react';
import { Tabs, Tab } from '@infra/ui';
import classnames from 'classnames';
import { GroupItemsRender, GroupItemsRenderProps } from './GroupItems';

export type GroupPanelItem = any

export interface PanelItemsGroup {
  title: string
  items: GroupPanelItem[]
}

export interface GroupPanelData {
  /** 组的标题 */
  title: string
  /** 组的类型 */
  type?: string
  itemsGroups: GroupItemsRenderProps['itemsGroups']
  /** 组渲染器，如果存在，则直接返回该渲染 */
  renderer?: (item, idx) => JSX.Element
}

export interface GroupPanelProps {
  /** 组件 panel 的配置 */
  panelData: GroupPanelData[]
  /** group 元素的 className */
  className?: string
  /** 可拖拽 item 的包装器 interface */
  itemRenderer: GroupItemsRenderProps['itemRenderer']
  handleChange?: (idx?: number) => void
}

export const GroupPanel: React.FC<GroupPanelProps> = ({
  panelData,
  className,
  handleChange,
  itemRenderer,
}) => {
  const classes = classnames(
    'group-panel-container',
    className
  );
  return (
    <div
      className={classes}
    >
      <Tabs
        onChangeTab={handleChange}
      >
        {
          panelData.map((tg, idx) => {
            const {
              title: tgTitle,
              type: groupType,
              itemsGroups,
              renderer
            } = tg;
            return (
              <Tab label={tgTitle} key={idx}>
                {
                  typeof renderer === 'function' ? renderer(tg, idx) : (
                    <GroupItemsRender
                      itemsGroups={itemsGroups}
                      groupType={groupType}
                      itemRenderer={itemRenderer}
                    />
                  )
                }
              </Tab>
            );
          })
        }
      </Tabs>
    </div>
  );
};
