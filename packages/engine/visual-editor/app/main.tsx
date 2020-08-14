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

interface VisualEditorAppProps extends VisualEditorState {
  dispatcher: Dispatcher
}

const VisualEditorApp: React.FC<VisualEditorAppProps> = (props) => {
  const {
    dispatcher,
    selectedEntities,
    entitiesStateStore,
  } = props;
  const {
    InitApp,
    SelectEntity, InitEntityState, UpdateEntityState,
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
            <CanvasStage
              selectedEntities={selectedEntities}
              entitiesStateStore={entitiesStateStore}
              selectEntity={SelectEntity}
              initEntityState={InitEntityState}
              updateEntityState={UpdateEntityState}
              PropEditorRenderer={PropertiesEditor}
            />
          </Grid>
        </DndProvider>
      </Grid>
      <GlobalStyle />
    </div>
  );
};

export default VisualEditorApp;
