import React from 'react';
import produce from 'immer';
import { Provider as ReduxProvider, connect, ConnectedProps } from 'react-redux';

import createStore from './store';
import { AllDispatcherActions } from './actions';
import { VisualEditorState } from './reducers/reducer';
import { getItemFromNestingItemsByBody } from './utils';

/** TODO: 完善 state */
const mapStateToProps = (state: VisualEditorState) => {
  return produce(state, (draft) => {
    /** 设置 activeEntity */
    const { layoutInfo, selectedEntities } = draft;
    const { activeEntityNestingIdx } = selectedEntities;
    if (!activeEntityNestingIdx) return draft;
    // eslint-disable-next-line no-param-reassign
    draft.selectedEntities.activeEntity = getItemFromNestingItemsByBody(
      layoutInfo, activeEntityNestingIdx
    );
    return draft;
  });
};

/**
 * 过滤所有 string 类型的 action，并且做 memoried
 */
let dispatcherCache;
const mapDispatchToProps = (dispatch) => {
  if (!dispatcherCache) {
    const tempActions = (function () {
      const obj = {};
      for (const item in AllDispatcherActions) {
        const _dispatch = AllDispatcherActions[item];
        if (typeof _dispatch === 'function') {
          obj[item] = (...args) => {
            dispatch(_dispatch(...args));
          };
        }
      }
      return obj;
    }());

    dispatcherCache = {
      dispatcher: tempActions
    };
  }
  return dispatcherCache;
};

const appStore = createStore();

const connector = connect(mapStateToProps, mapDispatchToProps);

type PropsFromRedux = ConnectedProps<typeof connector>

const Connector = (
  ConnectApp
): React.FC<PropsFromRedux> => () => {
  const ConnectedApp = connector(ConnectApp);
  return (
    <ReduxProvider store={appStore}>
      <ConnectedApp />
    </ReduxProvider>
  );
};

export default Connector;
