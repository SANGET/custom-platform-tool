import React, { useCallback, useMemo } from 'react';
import { ComponentPanelProps } from '@engine/visual-editor/components/WidgetPanel';
import DragItemComp from '@engine/visual-editor/spec/DragItemComp';
import { DragableItemTypes } from '@engine/visual-editor/spec';
import { Tab, Tabs } from '@infra/ui';
import { GroupItemsRender, PanelItemsGroup } from '@engine/visual-editor/components/GroupPanel';
import { DataSourceDragItem, DataSourceSelector } from './PDDataSource';

export interface PageDesignerComponentPanelProps {
  interDatasources
  onUpdatedDatasource
  widgetPanelData: PanelItemsGroup
  widgetMetaDataCollection: ComponentPanelProps['widgetMetaDataCollection']
  getDragItemConfig?: ComponentPanelProps['getDragItemConfig']
}

const itemRendererFac = (
  widgetMetaDataCollection, getDragItemConfig
) => (componentClassID, groupType) => {
  const widgetMeta = widgetMetaDataCollection[componentClassID];
  if (!widgetMeta) {
    return (
      <div className="t_red">widget 未定义</div>
    );
  }
  const {
    id, label
  } = widgetMeta;
  switch (groupType) {
    case 'dragableItems':
      return (
        <DragItemComp
          className="drag-comp-item"
          type={DragableItemTypes.DragableItemType}
          dragConfig={getDragItemConfig ? getDragItemConfig(widgetMeta) : {}}
          dragableWidgetType={{
            ...widgetMeta,
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
  widgetMetaDataCollection,
  getDragItemConfig,
  interDatasources,
  onUpdatedDatasource,
  widgetPanelData,
  ...other
}) => {
  console.log('widgetPanelData :>> ', widgetPanelData);
  const itemRenderer = useMemo(
    () => itemRendererFac(widgetMetaDataCollection, getDragItemConfig),
    [widgetMetaDataCollection, getDragItemConfig],
  );
  const { title: compPanelTitle, type: groupType, ...otherPanelConfig } = widgetPanelData;

  return (
    <div className="component-panel-container">
      <Tabs>
        <Tab label={compPanelTitle}>
          {/* <WidgetPanel
            {...other}
            componentPanelConfig={[widgetPanelData]}
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
            interDatasources={interDatasources}
            onAddDataSource={(addData) => {
              // return console.log(addData);
              onUpdatedDatasource(addData);
            }}
          />
        )}
        >
          <DataSourceDragItem
            interDatasources={interDatasources}
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
