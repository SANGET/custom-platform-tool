import React from "react";

import { Grid } from '@infra/ui';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { useSelectEntity, useEntitiesStateStore } from "@engine/visual-editor/core/actions-hook";

import ToolBar from '../components/Toolbar';
import ComponentPanel from '../components/ComponentPanel';
import CanvasStage from '../components/CanvasStage';
import PropertiesEditor from '../components/PropertiesEditor';

// import { Dispatcher } from "../core/actions";
// import { VisualEditorStore } from "../core/store";

import '@deer-ui/core/default.css';

// interface VisualEditorAppProps {
//   dispatcher: Dispatcher
//   layoutContent: VisualEditorStore['layoutContentState']
// }

const VisualEditorApp: React.FC = (props) => {
  const [selectedEntities, selectEntity] = useSelectEntity();
  const [entitiesStateStore, saveEntitiesStateStore] = useEntitiesStateStore();

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
              entitiesStateStore={entitiesStateStore}
              selectEntity={selectEntity}
            />
          </Grid>
        </DndProvider>
        {
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
                saveEntitiesStateStore={saveEntitiesStateStore}
              />
            </Grid>
          )
        }
      </Grid>
    </div>
  );
};

export default VisualEditorApp;
