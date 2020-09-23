import { Subscription, Reducer, Effect } from 'umi';
import { NoticeIconData } from '@/components/NoticeIcon';

export interface IGlobalModelState {
  collapsed: boolean;
}

export interface IGlobalModel {
  namespace: 'global';
  state: IGlobalModelState;
  effects: {

  };
  reducers: {
    changeLayoutCollapsed: Reducer<IGlobalModelState>;
  };
  subscriptions: { setup: Subscription };
}

const GlobalModel: IGlobalModel = {
  namespace: 'global',

  state: {
    collapsed: false,
  },

  effects: {

  },

  reducers: {
    changeLayoutCollapsed(state = { notices: [], collapsed: true }, { payload }):
    IGlobalModelState {
      state.collapsed = payload;
      return state;
    }
  },

  subscriptions: {
    setup({ history }): void {
      // Subscribe history(url) change, trigger `load` action if pathname is `/`
      // history.listen(({ pathname, search }): void => {
      //   if (typeof window.ga !== 'undefined') {
      //     window.ga('send', 'pageview', pathname + search);
      //   }
      // });
    },
  },
};

export default GlobalModel;
