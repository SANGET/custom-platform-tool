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

import '@deer-ui/core/default.css';

interface VisualEditorAppProps {
  dispatcher: Dispatcher
  layoutContent: VisualEditorStore['layoutContentState']
}

interface ComponentPropStore {
  [entityID: string]: {}
}

const VisualEditorApp = (props: VisualEditorAppProps) => {
  const { dispatcher, layoutContent } = props;

  /** TODO: 优化状态管理 */
  const [selectedEntities, setSelectedEntity] = useState({
    selectedList: {},
    activeID: '',
    activeEntity: {}
  });
  const [componentPropStore, setComponentPropStore] = useState({});

  const selectEntity = (id, entity) => {
    setSelectedEntity({
      selectedList: {
        [id]: entity
      },
      activeID: id,
      activeEntity: entity
    });
  };

  console.log(componentPropStore);

  const { activeID } = selectedEntities;

  const saveComponentPropStore = (id, formState) => {
    setComponentPropStore({
      ...componentPropStore,
      [id]: formState
    });
  };

  // console.log(componentPropStore);
  // console.log(activeID);
  // console.log(selectedEntities.activeEntity);

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
            defaultFormState={componentPropStore[activeID]}
            saveComponentPropStore={saveComponentPropStore}
          />
        </Grid>
      </Grid>
    </div>
  );
};

export default VisualEditorApp;
