import React from "react";

import { Grid } from '@infra/ui';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

import ToolBar from '../components/Toolbar';
import ComponentPanel from '../components/ComponentPanel';
import CanvasStage from '../components/CanvasStage';
import PropertiesEditor from '../components/PropertiesEditor';

import { Dispatcher } from "../core/actions";
// import { VisualEditorStore } from "../core/store";

import { GlobalStyle } from '../style/global-style';
import { VisualEditorState } from "../core/reducers/reducer";

interface VisualEditorAppProps extends VisualEditorState {
  dispatcher: Dispatcher
}

const VisualEditorApp: React.FC<VisualEditorAppProps> = (props) => {
  const {
    dispatcher,
    selectedEntities,
    entitiesStateStore,
  } = props;
  const { SelectEntity, InitEntityState, UpdateEntityState } = dispatcher;

  const { activeID, activeEntity } = selectedEntities;

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
        {/* {
          !!activeEntity && (
            <Grid
              lg={2}
              md={2}
              sm={2}
              xs={2}
              item
              className="right-panel"
            >
              <PropertiesEditor
                key={activeID}
                selectedEntity={activeEntity}
                defaultEntityState={entitiesStateStore[activeID]}
                initEntityState={InitEntityState}
                updateEntitiesStateStore={UpdateEntityState}
              />
            </Grid>
          )
        } */}
      </Grid>
      <GlobalStyle />
    </div>
  );
};

export default VisualEditorApp;
