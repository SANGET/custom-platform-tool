import React, { useEffect } from "react";

import { Grid, Button } from '@infra/ui';

import ToolBar from '@engine/visual-editor/components/Toolbar';
import WidgetPanel from '@engine/visual-editor/components/WidgetPanel';
import CanvasStage from '@engine/visual-editor/components/CanvasStage';
import PropertiesEditor from '@engine/visual-editor/components/PropertiesEditor';

import { VEDispatcher } from "@engine/visual-editor/core/actions";
// import { VisualEditorStore } from "@engine/visual-editor/core/store";

import { VisualEditorState } from "@engine/visual-editor/core/reducers/reducer";
import {
  getWidgetDefinitionData,
  getWidgetPanelData,
  getPagePropItems,
  getPropItemData,
} from "@mock-data/page-designer/mock-data";
import { ApiGetPageData, ApiSavePage } from "@mock-data/page-designer/mock-api/edit-page";
import { EditButton } from "../components/PageMetadataEditor";
import { wrapPageData } from "../core/utils/wrap-page-data";
import { dragableItemWrapperFac } from "./dragableItemWrapperFac";
import Style from './style';

import '../style/index.scss';
import { FrameLayout } from "../components/LayoutFrame";
import { PropItemRenderer } from "./PropItemRenderer";

interface VisualEditorAppProps extends VisualEditorState {
  dispatcher: VEDispatcher
}

// const PAGE_ENTITY_ID = '__PAGE__ENTITY__ID__';
// const PageEntity: PageStageEntity = {
//   id: PAGE_ENTITY_ID,
//   pageID: '',
//   bindPropItems: {
//     rawPropItems: pagePropsData
//   },
// };
const VisualEditorApp: React.FC<VisualEditorAppProps> = (props) => {
  const {
    dispatcher,
    selectedInfo,
    layoutInfo,
    pageMetadata,
    appContext,
    flatLayoutItems,
    appKey,
  } = props;
  // console.log(props);
  // 调整整体的数据结构，通过 redux 描述一份完整的{页面数据}
  const {
    InitApp,
    SelectEntity, InitEntityState, UpdateEntityState,
    SetLayoutInfo, DelEntity, AddEntity,
  } = dispatcher;
  const { id: activeEntityID, entity: activeEntity } = selectedInfo;

  useEffect(() => {
    /** 初始化数据 */
    Promise.all([
      getWidgetDefinitionData(),
      getWidgetPanelData(),
      getPagePropItems(),
      getPropItemData()
    ])
      .then(([compClassCollection, compClassForPanelData, pagePropsData, propItemData]) => {
        ApiGetPageData(appKey)
          .then((pageContent) => {
            console.log(pageContent);
            InitApp({
              compClassForPanelData,
              compClassCollection,
              propItemData,
              pagePropsData,
              /** 回填数据的入口 */
              pageContent
            });
          });

        // SelectEntity(PageEntity);
      })
      .catch((err) => {
        // TODO: 处理异常
      });
  }, []);

  return appContext.ready ? (
    <div className="visual-app">
      <header className="app-header">
        <ToolBar />
        <div className="p10">
          <Button
            hola
            className="mr10"
            onClick={(e) => {
              localStorage.clear();
              location.reload();
            }}
          >
            调试用 - 清除页面数据
          </Button>
          <EditButton
            hola
            className="mr10"
            onOK={(e) => {}}
            onCancel={(e) => {}}
          >
            编辑页面属性
          </EditButton>
          <Button
            className="mr10"
            onClick={(e) => {
              const pageContent = wrapPageData({
                id: appKey,
                pageID: appKey,
                name: '测试页面',
                pageMetadata,
                layoutInfo,
              });
              ApiSavePage(pageContent);
            }}
          >
            保存页面
          </Button>
        </div>
      </header>
      <div className="app-content">
        <div
          className="comp-panel"
        >
          <WidgetPanel
            componentPanelConfig={appContext.compClassForPanelData}
            compClassCollection={appContext.compClassCollection}
          />
        </div>
        <div
          className="canvas-container"
        >
          <CanvasStage
            dragableItemWrapper={dragableItemWrapperFac}
            selectedInfo={selectedInfo}
            layoutNodeInfo={layoutInfo}
            pageMetadata={pageMetadata}
            onStageClick={() => {
              // SelectEntity(PageEntity);
            }}
            {...dispatcher}
          />
        </div>
        <div
          className="prop-panel"
        >
          {
            activeEntity && (
              <PropertiesEditor
                key={activeEntityID}
                propItemData={appContext.propItemData}
                propItemRenderer={(_props) => <PropItemRenderer {..._props} />}
                propertiesConfig={appContext?.compClassCollection[activeEntity?._classID]?.bindPropItems}
                selectedEntity={activeEntity}
                defaultEntityState={activeEntity.propState}
                initEntityState={(entityState) => InitEntityState(selectedInfo, entityState)}
                updateEntityState={(entityState) => UpdateEntityState({
                  nestingInfo: selectedInfo.nestingInfo,
                  entity: activeEntity
                }, entityState)}
              />
            )
          }
        </div>
      </div>
      <Style />
    </div>
  ) : (
    // TODO: 优化样式
    <div>
      Loading data
    </div>
  );
};

export default VisualEditorApp;
