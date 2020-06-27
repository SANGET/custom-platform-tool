import React from 'react';

import { Provider as ReduxProvider, connect } from 'react-redux';

import createChatStore from '../core/store';
import * as VisualEditorActions from '../core/actions';

import VisualEditorApp from './main';

/** TODO: 完善 state */
const mapStateToProps = (state) => state;

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
        if (typeof _dispatch !== 'string') obj[item] = _dispatch;
      }
      return obj;
    }());

    dispatcherCache = {
      dispatcher: tempActions
    };
  }
  return dispatcherCache;
};

const appStore = createChatStore();

const Connect = connect(mapStateToProps, mapDispatchToProps)(VisualEditorApp);

const App = () => {
  return (
    <ReduxProvider store={appStore}>
      <Connect />
    </ReduxProvider>
  );
};

export default App;
