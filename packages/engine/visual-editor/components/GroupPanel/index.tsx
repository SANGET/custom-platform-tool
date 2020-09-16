/**
 * @author zxj
 *
 * 分组面板
 */

import React from 'react';
import { Tabs, Tab } from '@infra/ui';

export type GroupPanelItem = any

export interface PanelItemsGroup {
  title: string
  items: GroupPanelItem[]
}

export interface PanelTabGroupItem {
  /** 组的标题 */
  title: string
  /** 组的类型 */
  type: string
  itemsGroups: PanelItemsGroup[]
  /** 组渲染器，如果存在，则直接返回该渲染 */
  renderer?: (item, idx) => JSX.Element
}

export type GroupPanelData = PanelTabGroupItem[]
// export interface GroupPanelData {
//   tabGroup: PanelTabGroupItem[]
// }

export interface GroupPanelProps {
  /** 组件 panel 的配置 */
  panelData: GroupPanelData
  /** group 元素的 className */
  className?: string
  /** 可拖拽 item 的包装器 interface */
  itemRenderer: (item: GroupPanelItem, groupType: string) => JSX.Element
  handleChange?: (idx?: number) => void
}

export const GroupPanel: React.FC<GroupPanelProps> = ({
  panelData,
  className = 'group-panel-container',
  handleChange,
  itemRenderer,
}) => {
  return (
    <div
      className={className}
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
                  typeof renderer === 'function' ? renderer(tg, idx) : itemsGroups && itemsGroups.map((ig, _idx) => {
                    const {
                      title: igTitle,
                      items,
                    } = ig;
                    return (
                      <div key={`${idx}_${_idx}`} className="items-group">
                        <div className="group-title">
                          {igTitle}
                        </div>
                        <div className="items-content">
                          {
                            items && items.map((item, __idx) => {
                              const itemKey = `${idx}_${_idx}_${__idx}`;
                              return (
                                <div className="item" key={itemKey}>{itemRenderer(item, groupType)}</div>
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
