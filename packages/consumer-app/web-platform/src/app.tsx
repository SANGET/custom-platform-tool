import React from 'react';
import { Settings as LayoutSettings, BasicLayoutProps } from '@ant-design/pro-layout';
import { history } from 'umi';
import { queryCurrent, ICurrentUser, APICurrentUser } from '@/services/user';
import RightContent from '@/components/RightContent';
import defaultSettings from '../config/defaultSettings';

export async function getInitialState(): Promise<{
  settings?: LayoutSettings;
  currentUser?: ICurrentUser;
  fetchUserInfo: () => Promise<APICurrentUser | undefined>;
}> {
  const fetchUserInfo = async () => {
    try {
      return await queryCurrent();
    } catch (error) {
      history.push('/user/login');
    }
    return undefined;
  };
  // 如果是登录页面，不执行
  if (history.location.pathname !== '/user/login') {
    const res = await fetchUserInfo();
    return {
      fetchUserInfo,
      currentUser: res?.result,
      settings: defaultSettings,
    };
  }
  return {
    fetchUserInfo,
    settings: defaultSettings,
  };
}

export const layout = ({
  initialState,
}: {
  initialState: { settings?: LayoutSettings; currentUser?: ICurrentUser };
}): BasicLayoutProps => {
  return {
    rightContentRender: () => <RightContent />,
    disableContentMargin: false,
    footerRender: () => false,
    // menuDataRender: () => [],
    onPageChange: () => {
      const { currentUser } = initialState;
      console.dir(currentUser);
      const { location } = history;
      // 如果没有登录，重定向到 login
      if (!currentUser?.userid && location.pathname !== '/user/login') {
        history.push('/user/login');
      }
    },
    menuHeaderRender: undefined,
    ...initialState?.settings,
  };
};
