import React from "react";

import { Row, Col } from '@infra/ui-interface/layout/row';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

import ToolBar from '../components/Toolbar';
import ComponentPanel from '../components/ComponentPanel';
import CanvasStage from '../components/CanvasStage';
import PropertiesEditor from '../components/PropertiesEditor';

import { Dispatcher } from "../core/actions";
import { VisualEditorStore } from "../core/store";

import 'antd/dist/antd.css';

interface VisualEditorAppProps {
  dispatcher: Dispatcher
  layoutContent: VisualEditorStore['layoutContentState']
}

const VisualEditorApp = (props: VisualEditorAppProps) => {
  const { dispatcher, layoutContent } = props;
  return (
    <div>
      <Row>
        <Col
          className="logo"
          span={2}
        >
          <h3>Visual editor</h3>
        </Col>
        <Col
          className=""
          span={10}
        >
          <ToolBar />
        </Col>
      </Row>
      <Row>
        <DndProvider backend={HTML5Backend}>
          <Col
            span={2}
            className="left-panel"
          >
            <ComponentPanel />
          </Col>
          <Col
            span={8}
            className="canvas-container"
          >
            <CanvasStage
              layoutContent={layoutContent}
              selectEntity={dispatcher.SelectEntity}
            />
          </Col>
        </DndProvider>
        <Col
          span={2}
          className="right-panel"
        >
          <PropertiesEditor />
        </Col>
      </Row>
    </div>
  );
};

export default VisualEditorApp;
