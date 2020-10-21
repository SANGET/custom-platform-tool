import React from 'react';
import produce from 'immer';
import { Provider as ReduxProvider, connect, ConnectedProps } from 'react-redux';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

import createStore from './store';
import { AllDispatcherActions } from './actions';
import { VisualEditorState } from './reducers/reducer';

/**
 * TODO: 完善 state
 */
export const mapVisualStateToProps = (state: VisualEditorState) => {
  return produce(state, (draft) => {
    /** 设置 activeEntity */
    const { selectedInfo, flatLayoutItems } = draft;
    const { id } = selectedInfo;
    // eslint-disable-next-line no-param-reassign
    draft.selectedInfo.entity = flatLayoutItems[id];
    return draft;
  });
};

/**
 * 过滤所有 string 类型的 action，并且做 memoried
 */
const dispatcherCache = {};
export const mapVisualDispatchToProps = (appKey) => (dispatch) => {
  const AllDispatcherActionsCopy = { ...AllDispatcherActions };
  if (!dispatcherCache[appKey]) {
    const tempActions = (function () {
      const obj = {};
      for (const item in AllDispatcherActionsCopy) {
        const _dispatch = AllDispatcherActionsCopy[item];
        if (typeof _dispatch === 'function') {
          obj[item] = (...args) => {
            dispatch(_dispatch(...args));
          };
        }
      }
      return obj;
    }());

    dispatcherCache[appKey] = {
      dispatcher: tempActions
    };
  }
  return dispatcherCache[appKey];
};

// type PropsFromRedux = ConnectedProps<typeof connector>

/**
 * @important
 * @author zxj
 * @description 重要的连接器，通过 HOC 的方式支持返回多个 redux connector 实例
 */
const ConnectedAppStore: {
  [key: string]: React.ElementType
} = {};

const Connector = (
  ConnectApp,
  appKey: string
) => {
  if (!appKey) {
    throw Error('appKey 是必须且唯一的，请检查调用');
  }
  let ConnectorChild = ConnectedAppStore[appKey];
  if (!ConnectorChild) {
    const appStore = createStore(appKey);
    // console.log(object);
    const connector = connect(mapVisualStateToProps, mapVisualDispatchToProps(appKey));
    const Comp = connector(ConnectApp);
    ConnectorChild = (props) => {
      return (
        <DndProvider backend={HTML5Backend}>
          <ReduxProvider store={appStore}>
            <Comp {...props} appKey={appKey} />
          </ReduxProvider>
        </DndProvider>
      );
    };
    ConnectedAppStore[appKey] = ConnectorChild;
  }
  return ConnectorChild;
};

export default Connector;
