/* eslint-disable no-param-reassign */
import React from "react";
import produce from 'immer';
import { VEDispatcher, VisualEditorState } from "@engine/visual-editor/core";
import { updatePageService } from "@provider-app/services";
import { ApiSavePage } from "@mock-data/page-designer/mock-api/edit-page";
import ToolBar from './components/PDToolbar';
import WidgetPanel from './components/PDWidgetPanel';
import CanvasStage from './components/PDCanvasStage';
import PropertiesEditor from './components/PDPropertiesEditor';
import { wrapPageData } from "./utils";
import {
  getFEDynamicData, getPageContentWithDatasource
} from "./services";

import './style';
// import { VisualEditorStore } from "@engine/visual-editor/core/store";

interface VisualEditorAppProps extends VisualEditorState {
  dispatcher: VEDispatcher
}

class PageDesignerApp extends React.Component<VisualEditorAppProps & HY.SubAppSpec> {
  componentDidMount = async () => {
    // 在顶层尝试捕获异常
    try {
      this.perpareInitData();
    } catch (e) {
      console.error(e);
    }
  }

  /**
   * 响应更新数据源的回调
   * TODO: 优化链路
   */
  onUpdatedDatasource = async (addingData) => {
    const { appContext, dispatcher, location } = this.props;
    const { pageID, title } = location;
    const { UpdateAppContext } = dispatcher;
    const pageContent = this.getPageContent();

    await updatePageService(this.getPageInfo(), pageContent, {
      dataSources: addingData.map((tableData) => {
        return {
          datasourceId: tableData.id,
          datasourceType: tableData.type
        };
      })
    });
    const {
      datasources
    } = await getPageContentWithDatasource(pageID);
    UpdateAppContext({
      payload: {
        datasources
      }
    });
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

  /**
   * 准备应用初始化数据，并发进行
   * 1. 获取前端动态资源：所有组件类数据、属性项数据、组件面板数据、属性面板数据、页面可编辑属性项数据
   * 2. 从远端获取页面数据，包括 页面数据、数据源
   * 3. 将「数据源面板」插入到组件类面板中
   * 4. 将数据准备，调用 InitApp 初始化应用
   */
  perpareInitData = async () => {
    const { dispatcher, location } = this.props;
    const { pageID } = location;
    const { InitApp } = dispatcher;

    /** 并发获取初始化数据 */
    const [dynamicData, remotePageData] = await Promise.all([
      getFEDynamicData(),
      getPageContentWithDatasource(pageID)
    ]);
    const {
      datasources, pageContent, pageDataRes
    } = remotePageData;

    /** 准备初始化数据 */
    const initData = produce(dynamicData, (draftInitData) => {
      draftInitData.pageContent = pageContent;
      draftInitData.payload = {
        pageDataRes,
        // 填入 datasources
        datasources,
      };
      return draftInitData;
    });

    InitApp(initData);
  }

  onReleasePage = () => {
    const pageContent = this.getPageContent();
    updatePageService(this.getPageInfo(), pageContent);
    ApiSavePage(pageContent);
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
          <ToolBar onReleasePage={this.onReleasePage}/>
        </header>
        <div className="app-content">
          <div
            className="comp-panel"
          >
            <WidgetPanel
              datasources={appContext?.payload?.datasources}
              compClassForPanelData={appContext.compClassForPanelData}
              compClassCollection={appContext.compClassCollection}
              onUpdatedDatasource={this.onUpdatedDatasource}
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
          <div
            className="prop-panel"
          >
            {
              activeEntity && (
                <PropertiesEditor
                  key={activeEntityID}
                  propItemData={appContext.propItemData}
                  // eslint-disable-next-line max-len
                  propertiesConfig={appContext?.compClassCollection[activeEntity?._classID]?.bindPropItems}
                  selectedEntity={activeEntity}
                  propPanelData={appContext.propPanelData}
                  defaultEntityState={activeEntity.propState}
                  initEntityState={(entityState) => InitEntityState(selectedInfo, entityState)}
                  updateEntityState={(entityState) => UpdateEntityState({
                    nestingInfo: selectedInfo.nestingInfo,
                    entity: activeEntity
                  }, entityState)}
                />
              )
            }
          </div>
        </div>
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
