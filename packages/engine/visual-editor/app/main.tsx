import React, { useState } from "react";

import { Grid } from '@infra/ui-interface';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

import ToolBar from '../components/Toolbar';
import ComponentPanel from '../components/ComponentPanel';
import CanvasStage from '../components/CanvasStage';
import PropertiesEditor from '../components/PropertiesEditor';

import { Dispatcher } from "../core/actions";
import { VisualEditorStore } from "../core/store";
import { useSelectEntity } from "./useSelectEntity";
import { useEntityPropsStore } from "./useEntityPropsStore";

import '@deer-ui/core/default.css';

interface VisualEditorAppProps {
  dispatcher: Dispatcher
  layoutContent: VisualEditorStore['layoutContentState']
}

const VisualEditorApp = (props: VisualEditorAppProps) => {
  const [selectedEntities, selectEntity] = useSelectEntity();
  const [entityPropsStore, saveEntityPropsStore] = useEntityPropsStore();

  const { activeID } = selectedEntities;

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
        >
          <h3>Visual editor</h3>
        </Grid>
        <Grid
          item
          className=""
          lg={10}
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
            lg={8}
            md={8}
            sm={8}
            xs={8}
            item
            className="canvas-container"
          >
            <CanvasStage
              selectedEntities={selectedEntities.selectedList}
              selectEntity={selectEntity}
            />
          </Grid>
        </DndProvider>
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
            selectedEntity={selectedEntities.activeEntity}
            defaultFormState={entityPropsStore[activeID]}
            saveEntityPropsStore={saveEntityPropsStore}
          />
        </Grid>
      </Grid>
    </div>
  );
};

export default VisualEditorApp;
