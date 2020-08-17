import React from 'react';

import { Provider as ReduxProvider, connect, ConnectedProps } from 'react-redux';

import createStore from '../core/store';
import * as VisualEditorActions from '../core/actions';

import VisualEditorApp from './main';
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

const Connect = connector(VisualEditorApp);

type PropsFromRedux = ConnectedProps<typeof connector>

const App: React.FC<PropsFromRedux> = () => {
  return (
    <ReduxProvider store={appStore}>
      <Connect />
    </ReduxProvider>
  );
};

export default App;
