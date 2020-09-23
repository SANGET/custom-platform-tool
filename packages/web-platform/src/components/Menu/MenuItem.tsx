import React from 'react';
import { MenuDataItem } from '@ant-design/pro-layout';
import {
  Link
} from 'umi';

interface IMeuItem {
  menuItemProps?: MenuDataItem;
  defaultDom: React.ReactNode;
}

const MeuItem = (props: IMeuItem): React.ReactNode => {
  const { menuItemProps, defaultDom } = props;
  if (menuItemProps?.isUrl || !menuItemProps?.path) {
    return defaultDom;
  }
  return <Link to={menuItemProps?.path}>{defaultDom}</Link>;
};

export default MeuItem;
