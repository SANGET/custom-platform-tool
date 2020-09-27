import { SiderMenuProps } from '@ant-design/pro-layout/lib/SiderMenu/SiderMenu';
import React, { ReactElement, useState } from 'react';

interface IMenuContentProps {
  siderMenu: SiderMenuProps;
}
const MenuContent: React.FC<IMenuContentProps> = (props): ReactElement => {
  const { loadingMenu } = props.siderMenu;
  return loadingMenu ? (<div
    style={{
      padding: '24px 0',
    }}
  >
    <Spin tip="菜单加载中">{dom}</Spin>
  </div>) : (dom);
};

export default React.memo(MenuContent);
