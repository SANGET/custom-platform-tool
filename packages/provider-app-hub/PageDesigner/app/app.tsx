import React, { useEffect } from "react";

import produce from 'immer';
import { Grid, Button } from '@infra/ui';

import { Dispatcher } from "@engine/visual-editor/core/actions";
import { VisualEditorState } from "@engine/visual-editor/core/reducers/reducer";
/// //// mock 数据
import { ApiSavePage } from "@mock-data/page-designer/mock-api/edit-page";
/// //// mock 数据
import { getPageDetailService, updatePageService } from "@provider-app/services";
import ToolBar from './components/Toolbar';
import ComponentPanel from './components/ComponentPanel';
import CanvasStage from './components/CanvasStage';
import PropertiesEditor from './components/PropertiesEditor';
import { EditButton } from "./PageMetadataEditor/EditButton";
import { wrapPageData } from "../utils";
import Style from './style';
import prepareAppData, { setCompPanelData } from "./utils/prepareAppData";
import { getDataSourcePanelConfig } from "./components/DataSource";
import { extraDatasources } from "./utils/datasource-filter";

// import { VisualEditorStore } from "@engine/visual-editor/core/store";

interface VisualEditorAppProps extends VisualEditorState {
  dispatcher: Dispatcher
}

class PageDesignerApp extends React.Component<VisualEditorAppProps & HY.SubApp> {
  onUpdatedDatasource = (addingData) => {
    const { appContext, dispatcher, location } = this.props;
    const { pageID, title } = location;
    const { UpdateAppContext } = dispatcher;
    const { compPanelData, payload } = appContext;
    const pageInfo = {
      name: title,
      id: pageID,
      type: 2
    };

    updatePageService(pageInfo, {
      dataSources: addingData.map((tableData) => {
        return {
          datasourceId: tableData.id,
          datasourceType: tableData.type
        };
      })
    }).then((res) => {
      getPageDetailService(pageID)
        .then((pageDataRes) => {
          extraDatasources(pageDataRes.dataSources)
            .then((datasources) => {
              UpdateAppContext({
                compPanelData: [compPanelData[0], getDataSourcePanelConfig({
                  datasources,
                  onUpdatedDatasource: this.onUpdatedDatasource
                })]
              });
            });
        });
    });
    // compPanelData.splice(1, 1);
    // console.log('asd');
  }

  componentDidMount() {
    const { dispatcher, location } = this.props;
    const { InitApp } = dispatcher;
    const { pageID } = location;
    /** 初始化数据 */
    prepareAppData(pageID, this.onUpdatedDatasource)
      .then((resData) => {
        const initData = produce(resData, (draft) => {
          return draft;
        });

        InitApp(initData);
      });
  }

  render() {
    const {
      dispatcher,
      selectedInfo,
      layoutInfo,
      pageMetadata,
      appContext,
      flatLayoutItems,
      location,
    } = this.props;
    // console.log(location);
    const { pageID } = location;
    // console.log(props);
    // 调整整体的数据结构，通过 redux 描述一份完整的{页面数据}
    const {
      InitApp, UnmountApp, UpdateAppContext,
      SelectEntity, InitEntityState, UpdateEntityState,
      SetLayoutInfo, DelEntity, AddEntity,
    } = dispatcher;
    const { id: activeEntityID, entity: activeEntity } = selectedInfo;

    return appContext.ready ? (
      <div className="visual-app">
        <header className="app-header">
          <ToolBar onReleasePage={(e) => {}} />
          <div className="p10">
            <Button
              hola
              className="mr10"
              onClick={(e) => {
                localStorage.clear();
                location.reload();
              }}
            >
              调试用 - 清除页面数据
            </Button>
            <EditButton
              hola
              className="mr10"
              onOK={(e) => {}}
              onCancel={(e) => {}}
            >
              编辑页面属性
            </EditButton>
            <Button
              className="mr10"
              onClick={(e) => {
                const pageData = wrapPageData({
                  id: pageID,
                  pageID,
                  name: '测试页面',
                  pageMetadata,
                  layoutInfo,
                });
                // console.log(pageData);
                updatePageService(pageData);
                ApiSavePage(pageData);
              }}
            >
              保存页面
            </Button>
          </div>
        </header>
        <div className="app-content">
          {/* <DndProvider backend={HTML5Backend}> */}
          <div
            className="comp-panel"
          >
            <ComponentPanel
              componentPanelConfig={appContext.compPanelData}
              compClassDeclares={appContext.compClassDeclares}
            />
          </div>
          <div
            className="canvas-container"
          >
            <CanvasStage
              selectedInfo={selectedInfo}
              layoutNodeInfo={layoutInfo}
              pageMetadata={pageMetadata}
              onStageClick={() => {
                // SelectEntity(PageEntity);
              }}
              {...dispatcher}
            />
          </div>
          {/* </DndProvider> */}
          <div
            className="prop-panel"
          >
            {
              activeEntity && (
                <PropertiesEditor
                  key={activeEntityID}
                  propItemDeclares={appContext.propItemDeclares}
                  propertiesConfig={appContext?.compClassDeclares[activeEntity?._classID]?.bindProps}
                  selectedEntity={activeEntity}
                  propPanelData={appContext.propPanelData}
                  defaultEntityState={activeEntity.propState}
                  initEntityState={(entityState) => InitEntityState(selectedInfo, entityState)}
                  updateEntityState={(entityState) => UpdateEntityState({
                    nestingIdx: selectedInfo.nestingIdx,
                    entity: activeEntity
                  }, entityState)}
                />
              )
            }
          </div>
        </div>
        <Style />
      </div>
    ) : (
      // TODO: 优化样式
      <div>
        Loading data
      </div>
    );
  }
}

// const createPageDesignerApp = () => PageDesignerApp

export default PageDesignerApp;
