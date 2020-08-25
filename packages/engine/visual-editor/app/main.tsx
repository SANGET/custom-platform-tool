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
    selectedEntities,
    layoutInfo,
    pageMetadata,
    appContext,
  } = props;
  // console.log(props);
  // 调整整体的数据结构，通过 redux 描述一份完整的{页面数据}
  const {
    InitApp,
    SelectEntity, InitEntityState, UpdateEntityState,
    SetLayoutInfo, DelEntity, AddEntity,
  } = dispatcher;
  const { activeEntityID, activeEntity } = selectedEntities;

  useEffect(() => {
    /** 初始化数据 */
    Promise.all([getCompClassData(), getCompPanelData(), getPagePropsData(), getPropertyItems()])
      .then(([compClassData, compPanelData, pagePropsData, propItemsData]) => {
        ApiGetPageData(MOCK_PAGE_ID)
          .then((pageData) => {
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
    <div>
      <Grid
        container
        alignItems="center"
        space={10}
      >
        <Grid
          item
          className="logo"
          lg={2}
          md={3}
        >
          <h3>Visual editor</h3>
        </Grid>
        <Grid
          item
          className=""
          lg={9}
          md={10}
        >
          <ToolBar />
        </Grid>
      </Grid>
      <Grid
        container
        space={10}
      >
        <DndProvider backend={HTML5Backend}>
          <Grid
            lg={2}
            md={2}
            sm={2}
            xs={2}
            item
            className="left-panel"
          >
            <ComponentPanel
              componentPanelConfig={appContext.compPanelData}
              compClassData={appContext.compClassData}
            />
          </Grid>
          <Grid
            lg={8}
            md={8}
            sm={8}
            xs={8}
            item
            className="canvas-container"
          >
            <div className="mb10">
              <EditButton
                onOK={(e) => {}}
                onCancel={(e) => {}}
              >
                编辑页面属性
              </EditButton>
              <Button
                className="ml10"
                color="green"
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
              <Button
                className="ml10"
                color="red"
                onClick={(e) => {
                  localStorage.clear();
                  location.reload();
                }}
              >
                清除页面数据
              </Button>
            </div>
            <CanvasStage
              selectedEntities={selectedEntities}
              layoutNodeInfo={layoutInfo}
              pageMetadata={pageMetadata}
              onStageClick={() => {
                // SelectEntity(PageEntity);
              }}
              {...dispatcher}
            />
          </Grid>
        </DndProvider>
        {
          activeEntity && (
            <Grid
              lg={2}
              md={2}
              sm={2}
              xs={2}
              item
            >
              <PropertiesEditor
                key={activeEntityID}
                propItemsData={appContext.propItemsData}
                propertiesConfig={activeEntity.bindProps}
                selectedEntity={activeEntity}
                defaultEntityState={activeEntity.propState}
                initEntityState={(entityState) => InitEntityState(selectedEntities, entityState)}
                updateEntityState={(entityState) => UpdateEntityState(selectedEntities, entityState)}
              />
            </Grid>
          )
        }
      </Grid>
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
