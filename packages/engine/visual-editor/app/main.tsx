import React, { useEffect } from "react";

import { Grid } from '@infra/ui';
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
  } = props;
  // console.log(props);
  // 调整整体的数据结构，通过 redux 描述一份完整的{页面数据}
  const {
    InitApp,
    SelectEntity, InitEntityState, UpdateEntityState,
    SetLayoutInfo, DelEntity, MotifyEntity, AddEntity,
  } = dispatcher;

  return (
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
            <ComponentPanel />
          </Grid>
          <Grid
            lg={10}
            md={10}
            sm={10}
            xs={10}
            item
            className="canvas-container"
          >
            <EditButton
              onOK={(e) => {}}
              onCancel={(e) => {}}
            >
              编辑页面属性
            </EditButton>
            <CanvasStage
              selectedEntities={selectedEntities}
              entitiesStateStore={entitiesStateStore}
              layoutNodeInfo={layoutInfo}
              pageMetadata={pageMetadata}
              PropEditorRenderer={PropertiesEditor}
              {...dispatcher}
            />
          </Grid>
        </DndProvider>
      </Grid>
      <GlobalStyle />
    </div>
  );
};

export default VisualEditorApp;
