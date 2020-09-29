import React from 'react';
import { PageLoading } from '@ant-design/pro-layout';
import {
  Redirect, connect, Dispatch, history
} from 'umi';
import { stringify } from 'querystring';
import { ConnectState } from '@/models/connect';
import { IUserModelState } from '@/models/user';
import { getQueryByParams } from '@/utils/utils';
import store from 'store';

interface SecurityLayoutProps {
  loading?: boolean;
  currentUser?: IUserModelState;
  dispatch: Dispatch;
}

interface SecurityLayoutState {
  isReady: boolean;
}

class SecurityLayout extends React.PureComponent<SecurityLayoutProps, SecurityLayoutState> {
  state: SecurityLayoutState = {
    isReady: false,
  };

  componentDidMount() {
    const { dispatch } = this.props;
    const { query } = history.location;
    const { appName } = query;
    // @TODO 暂时这么写
    if (appName) {
      store.set("appName", appName);
      dispatch({
        type: 'settings/changeSetting',
        payload: {
          title: appName
        }
      });
    }
    this.setState({
      isReady: true,
    });

    if (dispatch) {
      dispatch({
        type: 'user/fetchCurrent',
      });
    }
  }

  render() {
    const { isReady } = this.state;
    const { children, loading, currentUser } = this.props;
    const isLogin = currentUser && currentUser.token;
    const queryLink = getQueryByParams(["mode", "app", "lessee"]);
    const queryString = stringify({
      redirect: window.location.href,
    });
    if ((!isLogin && loading) || !isReady) {
      return <PageLoading />;
    }
    if (!isLogin && window.location.pathname !== '/user/login') {
      return <Redirect to={`/user/login?${queryString}&${queryLink}`} />;
    }
    return children;
  }
}

export default connect(({ user, loading }: ConnectState) => ({
  currentUser: user,
  loading: loading.models.user,
}))(SecurityLayout);
