import React, { useEffect } from "react";

import produce from 'immer';
import { Grid, Button } from '@infra/ui';

import { Dispatcher } from "@engine/visual-editor/core/actions";
import { VisualEditorState } from "@engine/visual-editor/core/reducers/reducer";
import { getPageDetailService, updatePageService } from "@provider-app/services";
import ToolBar from './components/Toolbar';
import ComponentPanel from './components/ComponentPanel';
import CanvasStage from './components/CanvasStage';
import PropertiesEditor from './components/PropertiesEditor';
import { wrapPageData } from "../utils";
import Style from './style';
import prepareAppData, { setCompPanelData } from "./utils/prepareAppData";
import { getDataSourcePanelConfig } from "./components/DataSource";
import { extraDatasources } from "./utils/datasource-filter";

// import { VisualEditorStore } from "@engine/visual-editor/core/store";

interface VisualEditorAppProps extends VisualEditorState {
  dispatcher: Dispatcher
}

class PageDesignerApp extends React.Component<VisualEditorAppProps & HY.SubAppSpec> {
  onUpdatedDatasource = (addingData) => {
    const { appContext, dispatcher, location } = this.props;
    const { pageID, title } = location;
    const { UpdateAppContext } = dispatcher;
    const { compPanelData, payload } = appContext;
    const pageContent = this.getPageContent();

    updatePageService(this.getPageInfo(), pageContent, {
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

  getPageInfo = () => {
    const {
      location,
    } = this.props;
    const { pageID, title } = location;
    return {
      id: pageID,
      name: title,
      type: 2
    };
  }

  getPageContent = () => {
    const {
      layoutInfo,
      pageMetadata,
      location,
    } = this.props;
    // console.log(location);
    const { pageID } = location;
    const pageContent = wrapPageData({
      id: pageID,
      pageID,
      name: '测试页面',
      pageMetadata,
      layoutInfo,
    });

    return pageContent;
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
          <ToolBar onReleasePage={() => {
            const pageContent = this.getPageContent();
            updatePageService(this.getPageInfo(), pageContent);
            // ApiSavePage(pageContent);
          }}
          />
        </header>
        <div className="app-content">
          {/* <DndProvider backend={HTML5Backend}> */}
          <div
            className="comp-panel"
          >
            <ComponentPanel
              componentPanelConfig={appContext.compPanelData}
              compClassData={appContext.compClassData}
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
                  propItemData={appContext.propItemData}
                  propertiesConfig={appContext?.compClassData[activeEntity?._classID]?.bindProps}
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
