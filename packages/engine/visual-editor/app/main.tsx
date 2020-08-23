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

interface VisualEditorAppProps extends VisualEditorState {
  dispatcher: Dispatcher
}

const VisualEditorApp: React.FC<VisualEditorAppProps> = (props) => {
  const {
    dispatcher,
    selectedEntities,
    entitiesStateStore,
    layoutInfo,
    pageMetadata,
    appContext,
  } = props;
  // console.log(props);
  // 调整整体的数据结构，通过 redux 描述一份完整的{页面数据}
  const {
    InitApp,
    SelectEntity, InitEntityState, UpdateEntityState,
    SetLayoutInfo, DelEntity, MotifyEntity, AddEntity,
  } = dispatcher;
  const { activeEntityID, activeEntity } = selectedEntities;

  useEffect(() => {
    /** 初始化数据 */
    Promise.all([getCompClassData(), getCompPanelData(), getPagePropsData(), getPropertyItems()])
      .then(([compClassData, compPanelData, pagePropsData, propItemsData]) => {
        InitApp({
          compPanelData,
          compClassData,
          propItemsData,
          pagePropsData,
          /** 回填数据的入口 */
          pageData: {}
        });
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
                onClick={(e) => {
                  const pageData = wrapPageData({
                    pageMetadata,
                    layoutInfo,
                    entitiesStateStore
                  });
                }}
              >
                保存页面
              </Button>
            </div>
            <CanvasStage
              selectedEntities={selectedEntities}
              entitiesStateStore={entitiesStateStore}
              layoutNodeInfo={layoutInfo}
              pageMetadata={pageMetadata}
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
                defaultEntityState={entitiesStateStore[activeEntityID]}
                initEntityState={(entityState) => InitEntityState(activeEntity, entityState)}
                updateEntityState={(entityState) => UpdateEntityState(activeEntity, entityState)}
              />
            </Grid>
          )
        }
      </Grid>
      <GlobalStyle />
    </div>
  ) : (
    // TODO: 优化
    <div>
      Loading data
    </div>
  );
};

export default VisualEditorApp;
