import React, { useState } from "react";

import { Grid } from '@infra/ui';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

import { useEntityPropsStore } from "@engin/visual-editor/app/useEntityPropsStore";
import { useSelectEntity } from "@engin/visual-editor/app/useSelectEntity";
import { getLayoutNodeTree, getLayoutContentCollection } from "@engin/visual-editor/components/CanvasStage";
import ToolBar from './components/Toolbar';
import ComponentPanel from './components/ComponentPanel';
import CanvasStage from './components/CanvasStage';
import PropertiesEditor from './components/PropertiesEditor';

/** 使用属性 to IUB-DSL */
import { Prop2IUB } from './utils/prop-translater';

import '@deer-ui/core/default.css';

/**
 * 模拟发布页面
 *
 * TODO: 完善逻辑
 */
const releasePage = ({
  componentPropStore
}) => {
  const layoutNodeTree = getLayoutNodeTree();

  Prop2IUB({
    layoutNodeTree,
    componentPropStore
  });
};

/**
 * 页面设计器 APP 入口
 */
const PageDesignerApp = (props) => {
  /**
   * 最终由 VisualEditor Engin 产出的数据
   *
   * TODO: 转换成 IUB-DSL
   */
  const [selectedEntities, selectEntity] = useSelectEntity();
  const [componentPropStore, saveEntityPropsStore] = useEntityPropsStore();

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
          <h3>页面设计器</h3>
        </Grid>
        <Grid
          item
          className=""
          lg={10}
        >
          <ToolBar
            onReleasePage={(e) => {
              releasePage({
                componentPropStore
              });
            }}
          />
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
            saveEntityPropsStore={saveEntityPropsStore}
          />
        </Grid>
      </Grid>
    </div>
  );
};

export {
  PageDesignerApp
};

export default PageDesignerApp;
