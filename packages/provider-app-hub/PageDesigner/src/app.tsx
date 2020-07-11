import React, { useState } from "react";

import { Grid, Button } from '@infra/ui';
import { DndProvider } from 'react-dnd';
import { ShowModal } from '@deer-ui/core';
import { HTML5Backend } from 'react-dnd-html5-backend';

import { useEntitiesStateStore, useSelectEntity } from "@engin/visual-editor/app/actions";
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
  entitiesStateStore
}) => {
  const layoutNodeTree = getLayoutNodeTree();

  Prop2IUB({
    layoutNodeTree,
    entitiesStateStore
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
  const [entitiesStateStore, saveEntitiesStateStore] = useEntitiesStateStore();

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
              ShowModal({
                onClose: () => {},
                onConfirm: (context) => {
                  console.log(context);
                },
                showFuncBtn: true,
                title: '弹窗',
                children: (context) => {
                  return (
                    <div>
                      弹窗 123122
                      <Button>撒的</Button>
                    </div>
                  );
                }
              });
              // releasePage({
              //   entitiesStateStore
              // });
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
            defaultFormState={entitiesStateStore[activeID]}
            saveEntitiesStateStore={saveEntitiesStateStore}
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
