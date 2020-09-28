import React, { useCallback, useMemo } from 'react';
import { ComponentPanelProps } from '@engine/visual-editor/components/WidgetPanel';
import DragItemComp from '@engine/visual-editor/spec/DragItemComp';
import { DragableItemTypes } from '@engine/visual-editor/spec';
import { Tab, Tabs } from '@infra/ui';
import { GroupItemsRender, PanelItemsGroup } from '@engine/visual-editor/components/GroupPanel';
import { DataSourceDragItem, DataSourceSelector } from './PDDataSource';

export interface PageDesignerComponentPanelProps {
  datasources
  onUpdatedDatasource
  compClassForPanelData: PanelItemsGroup
  compClassCollection: ComponentPanelProps['compClassCollection']
  getDragItemConfig?: ComponentPanelProps['getDragItemConfig']
}

const itemRendererFac = (
  compClassCollection, getDragItemConfig
) => (componentClassID, groupType) => {
  const componentClass = compClassCollection[componentClassID];
  const {
    id, label
  } = componentClass;
  switch (groupType) {
    case 'dragableItems':
      return (
        <DragItemComp
          className="drag-comp-item"
          type={DragableItemTypes.DragableItemType}
          dragConfig={getDragItemConfig ? getDragItemConfig(componentClass) : {}}
          dragableWidgetType={{
            ...componentClass,
          }}
        >
          {label}
        </DragItemComp>
      );
    case 'dataSource':
      return (
        <div>asd</div>
      );
    default:
      break;
  }
};

/**
 * page designer widget panel
 */
const PDWidgetPanel: React.FC<PageDesignerComponentPanelProps> = ({
  compClassCollection,
  getDragItemConfig,
  datasources,
  onUpdatedDatasource,
  compClassForPanelData,
  ...other
}) => {
  const itemRenderer = useMemo(
    () => itemRendererFac(compClassCollection, getDragItemConfig),
    [compClassCollection, getDragItemConfig],
  );
  const { title: compPanelTitle, type: groupType, ...otherPanelConfig } = compClassForPanelData;

  return (
    <div className="component-panel-container">
      <Tabs>
        <Tab label={compPanelTitle}>
          {/* <WidgetPanel
            {...other}
            componentPanelConfig={[compClassForPanelData]}
            itemRenderer={itemRenderer}
          /> */}
          <GroupItemsRender
            groupType={groupType}
            itemRenderer={itemRenderer}
            {...otherPanelConfig}
          />
        </Tab>
        <Tab label={(
          <DataSourceSelector
            datasources={datasources}
            onAddDataSource={(addData) => {
              // return console.log(addData);
              onUpdatedDatasource(addData);
            }}
          />
        )}
        >
          <DataSourceDragItem
            datasources={datasources}
          />
        </Tab>
        <Tab label="控件模版">
          <div>敬请期待</div>
        </Tab>
      </Tabs>
    </div>
  );
};

export default PDWidgetPanel;
