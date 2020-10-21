/* eslint-disable no-param-reassign */
import React from "react";
import produce from 'immer';
import { VEDispatcher, VisualEditorState } from "@engine/visual-editor/core";
import { updatePageService } from "@provider-app/services";
import { LoadingTip } from "@provider-ui/loading-tip";
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

class PageDesignerApp extends React.Component<VisualEditorAppProps & HY.ProviderSubAppProps> {
  componentDidMount = async () => {
    // 在顶层尝试捕获异常
    try {
      this.perpareInitData();
    } catch (e) {
      console.error(e);
    }
  }

  /**
   * 包装更新页面的数据源的数据结构
   * @param dataSourcesFormRemote
   */
  wrapDataSourceDataForUpdate = (dataSourcesFormRemote) => {
    const dataSourcesItems = dataSourcesFormRemote.map((tableData) => {
      return {
        datasourceId: tableData.id,
        datasourceType: tableData.type
      };
    });
    return {
      dataSources: dataSourcesItems
    };
  }

  /**
   * 响应更新数据源的回调
   * TODO: 优化链路
   */
  onUpdatedDatasource = async (addingDataFormRemote) => {
    const { appContext, dispatcher, appLocation } = this.props;
    const { pageID, title } = appLocation;
    const { UpdateAppContext } = dispatcher;
    const pageContent = this.getPageContent();

    await updatePageService(
      this.getPageInfo(),
      pageContent,
      this.wrapDataSourceDataForUpdate(addingDataFormRemote)
    );
    const {
      interDatasources
    } = await getPageContentWithDatasource(pageID);
    UpdateAppContext({
      payload: {
        interDatasources
      }
    });
  }

  /**
   * 获取数据源
   */
  getDatasources = () => {
    return this.props.appContext.payload?.interDatasources;
  }

  /**
   * 获取页面信息
   */
  getPageInfo = () => {
    const {
      appLocation
    } = this.props;
    const { pageID, title } = appLocation;
    return {
      id: pageID,
      name: title,
      type: 2,
    };
  }

  /**
   * 获取页面内容
   */
  getPageContent = () => {
    const {
      layoutInfo,
      pageMetadata,
      appLocation,
    } = this.props;
    const { pageID } = appLocation;
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
    const { dispatcher, appLocation } = this.props;
    const { pageID } = appLocation;
    const { InitApp } = dispatcher;

    /** 并发获取初始化数据 */
    const [dynamicData, remotePageData] = await Promise.all([
      getFEDynamicData(),
      getPageContentWithDatasource(pageID)
    ]);
    const {
      interDatasources, pageContent, pageDataRes
    } = remotePageData;

    /** 准备初始化数据 */
    const initData = produce(dynamicData, (draftInitData) => {
      draftInitData.pageContent = pageContent;
      draftInitData.payload = {
        pageDataRes,
        // 填入 interDatasources
        interDatasources,
      };
      return draftInitData;
    });

    InitApp(initData);
  }

  /**
   * 发布页面
   */
  onReleasePage = () => {
    return new Promise((resolve, reject) => {
      const pageContent = this.getPageContent();
      const interDatasources = this.getDatasources();
      updatePageService(
        this.getPageInfo(),
        pageContent,
        this.wrapDataSourceDataForUpdate(interDatasources)
      ).then((res) => {
        resolve(res);
      }).catch((e) => {
        reject(e);
      });
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
      appLocation,
    } = this.props;
    // console.log(appLocation);
    // console.log(props);
    // 调整整体的数据结构，通过 redux 描述一份完整的{页面数据}
    const {
      InitApp, UnmountApp, UpdateAppContext,
      SelectEntity, InitEntityState, UpdateEntityState,
      SetLayoutInfo, DelEntity, AddEntity,
    } = dispatcher;
    const { id: activeEntityID, entity: activeEntity } = selectedInfo;

    return appContext.ready ? (
      <div className="visual-app bg-white">
        <header className="app-header">
          <ToolBar onReleasePage={this.onReleasePage} appLocation={appLocation} />
        </header>
        <div
          className="app-content"
          // style={{ top: 0 }}
        >
          <div
            className="comp-panel"
          >
            <WidgetPanel
              interDatasources={appContext?.payload?.interDatasources}
              widgetPanelData={appContext.widgetPanelData}
              widgetMetaDataCollection={appContext.widgetMetaDataCollection}
              onUpdatedDatasource={this.onUpdatedDatasource}
            />
          </div>
          <div
            className="canvas-container"
            style={{ height: '100%' }}
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
                  interDatasources={this.getDatasources()}
                  // eslint-disable-next-line max-len
                  widgetBindedPropItemsMeta={appContext?.widgetMetaDataCollection[activeEntity?._classID]?.bindPropItems}
                  selectedEntity={activeEntity}
                  propPanelData={appContext.propPanelData}
                  defaultEntityState={activeEntity.propState}
                  initEntityState={(entityState) => InitEntityState(selectedInfo, entityState)}
                  updateEntityState={(entityState) => {
                    UpdateEntityState({
                      nestingInfo: selectedInfo.nestingInfo,
                      entity: activeEntity
                    }, entityState);
                  }}
                />
              )
            }
          </div>
        </div>
      </div>
    ) : (
      <LoadingTip />
    );
  }
}

// const createPageDesignerApp = () => PageDesignerApp

export default PageDesignerApp;
