import React, { useEffect } from "react";

import { Grid, Button } from '@infra/ui';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

import ToolBar from '@engine/visual-editor/components/Toolbar';
import ComponentPanel from '@engine/visual-editor/components/ComponentPanel';
import CanvasStage from '@engine/visual-editor/components/CanvasStage';
import PropertiesEditor from '@engine/visual-editor/components/PropertiesEditor';

import { Dispatcher } from "@engine/visual-editor/core/actions";
// import { VisualEditorStore } from "@engine/visual-editor/core/store";

import { GlobalStyle } from '@engine/visual-editor/style/global-style';
import { VisualEditorState } from "@engine/visual-editor/core/reducers/reducer";
import { EditButton } from "../components/PageMetadataEditor";
import { wrapPageData } from "../core/utils/wrap-page-data";
import {
  getCompClassData,
  getCompPanelData,
  getPagePropsData,
  getPropertyItems,
} from "../mock-data";
import { ApiGetPageData, ApiSavePage } from "../mock-api/edit-page";
import { MOCK_PAGE_ID } from "../mock-data/page";

import '../style/index.scss';
import { FrameLayout } from "../components/LayoutFrame";

interface VisualEditorAppProps extends VisualEditorState {
  dispatcher: Dispatcher
}

// const PAGE_ENTITY_ID = '__PAGE__ENTITY__ID__';
// const PageEntity: EditorPageEntity = {
//   id: PAGE_ENTITY_ID,
//   pageID: '',
//   bindProps: {
//     rawProp: pagePropsData
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
    Promise.all([getCompClassData(), getCompPanelData(), getPagePropsData(), getPropertyItems()])
      .then(([compClassData, compPanelData, pagePropsData, propItemsData]) => {
        ApiGetPageData(MOCK_PAGE_ID)
          .then((pageData) => {
            console.log(pageData);
            InitApp({
              compPanelData,
              compClassData,
              propItemsData,
              pagePropsData,
              /** 回填数据的入口 */
              pageData
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
              const pageData = wrapPageData({
                id: MOCK_PAGE_ID,
                pageID: MOCK_PAGE_ID,
                name: '测试页面',
                pageMetadata,
                layoutInfo,
              });
              ApiSavePage(pageData);
            }}
          >
            保存页面
          </Button>
        </div>
      </header>
      <div className="app-content">
        <DndProvider backend={HTML5Backend}>
          <div
            className="comp-panel"
          >
            <ComponentPanel
              componentPanelConfig={appContext.compPanelData}
              compClassData={appContext.compClassData}
            />
          </div>
          <div
            className="canvas-container"
          >
            <CanvasStage
              selectedInfo={selectedInfo}
              layoutNodeInfo={layoutInfo}
              pageMetadata={pageMetadata}
              onStageClick={() => {
                // SelectEntity(PageEntity);
              }}
              {...dispatcher}
            />
          </div>
        </DndProvider>
        <div
          className="prop-panel"
        >
          {
            activeEntity && (
              <PropertiesEditor
                key={activeEntityID}
                propItemsData={appContext.propItemsData}
                propertiesConfig={appContext?.compClassData[activeEntity?._classID]?.bindProps}
                selectedEntity={activeEntity}
                defaultEntityState={activeEntity.propState}
                initEntityState={(entityState) => InitEntityState(selectedInfo, entityState)}
                updateEntityState={(entityState) => UpdateEntityState(selectedInfo, entityState)}
              />
            )
          }
        </div>
      </div>
      <GlobalStyle />
    </div>
  ) : (
    // TODO: 优化样式
    <div>
      Loading data
    </div>
  );
};

export default VisualEditorApp;
