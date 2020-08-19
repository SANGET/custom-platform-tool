import React, { useEffect } from "react";

import { Grid } from '@infra/ui';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

import { Dispatcher } from "@engine/visual-editor/core/actions";
import { GlobalStyle } from '@engine/visual-editor/style/global-style';
import { VisualEditorState } from "@engine/visual-editor/core/reducers/reducer";
import ToolBar from './components/Toolbar';
import ComponentPanel from './components/ComponentPanel';
import CanvasStage from './components/CanvasStage';
import PropertiesEditor from './components/PropertiesEditor';

// import { VisualEditorStore } from "@engine/visual-editor/core/store";

interface VisualEditorAppProps extends VisualEditorState {
  dispatcher: Dispatcher
}

const PageDesignerApp: React.FC<VisualEditorAppProps> = (props) => {
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
          <h3>页面设计器</h3>
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

export {
  PageDesignerApp
};

export default PageDesignerApp;
