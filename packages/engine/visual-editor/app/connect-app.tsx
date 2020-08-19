import React from 'react';

import { Provider as ReduxProvider, connect, ConnectedProps } from 'react-redux';

import createStore from '../core/store';
import * as VisualEditorActions from '../core/actions';
import { VisualEditorState } from '../core/reducers/reducer';

/** TODO: 完善 state */
const mapStateToProps = (state: VisualEditorState) => state;

/**
 * 过滤所有 string 类型的 action，并且做 memoried
 */
let dispatcherCache;
const mapDispatchToProps = (dispatch) => {
  if (!dispatcherCache) {
    const tempActions = (function () {
      const obj = {};
      for (const item in VisualEditorActions) {
        const _dispatch = VisualEditorActions[item];
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

const Connector = (ConnectApp): React.FC<PropsFromRedux> => () => {
  const ConnectedApp = connector(ConnectApp);
  return (
    <ReduxProvider store={appStore}>
      <ConnectedApp />
    </ReduxProvider>
  );
};

export default Connector;
