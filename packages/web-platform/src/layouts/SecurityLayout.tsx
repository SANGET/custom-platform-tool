import React from 'react';
import { PageLoading } from '@ant-design/pro-layout';
import {
  Redirect, connect, Dispatch
} from 'umi';
import { stringify } from 'querystring';
import { ConnectState } from '@/models/connect';
import { ICurrentUser } from '@/models/user';
import { getQueryByParams } from '@/utils/utils';

interface SecurityLayoutProps {
  loading?: boolean;
  currentUser?: ICurrentUser;
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
    this.setState({
      isReady: true,
    });
    const { dispatch } = this.props;
    if (dispatch) {
      dispatch({
        type: 'user/fetchCurrent',
      });
    }
  }

  render() {
    const { isReady } = this.state;
    const { children, loading, currentUser } = this.props;
    const isLogin = currentUser && currentUser.userid;
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
