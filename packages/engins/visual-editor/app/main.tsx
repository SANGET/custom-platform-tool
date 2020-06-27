import React from "react";

import { Grid } from '@infra/ui-interface';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

import ToolBar from '../components/Toolbar';
import ComponentPanel from '../components/ComponentPanel';
import CanvasStage from '../components/CanvasStage';
import PropertiesEditor from '../components/PropertiesEditor';

const VisualEditorApp = (props) => {
  console.log(props);
  return (
    <div>
      <Grid container alignItems="center">
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
      <Grid container>
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
            <CanvasStage />
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
          <PropertiesEditor />
        </Grid>
      </Grid>
    </div>
  );
};

export default VisualEditorApp;
