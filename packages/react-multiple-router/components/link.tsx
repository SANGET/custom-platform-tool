import React from 'react';

import { getUrlParams } from '@mini-code/request/url-resolve';
import { Call, IsUrl } from '@mini-code/base-func';

import {
  getRouteKey, onNavigate
} from '../utils';

export interface LinkProps {
  /** 将要导航到的路由 */
  to: string;
  className?: string;
  isActive?: boolean;
  onClick?: Function;
  /** 作为 query string 的导航参数，例如 { ID: 123, name: alex } -> ID=123&name=alex */
  params?: {};
}

/**
 * 用于导航到另外页面的组件
 */
const Link: React.SFC<LinkProps> = ({
  to, className, isActive,
  children, onClick, params
}) => {
  const activeRoute = getUrlParams(undefined, undefined, true)[getRouteKey()];
  const _isActive = typeof isActive != 'undefined' ? isActive : activeRoute === to;

  return (
    <span
      className={className + (_isActive ? ' active' : '')}
      onClick={(e) => {
        Call(onClick, e);
        if (IsUrl(to)) {
          window.open(to);
        } else {
          onNavigate({
            type: 'PUSH',
            route: to,
            params
          });
        }
      }}>
      {children}
    </span>
  );
};
Link.defaultProps = {
  className: 'link-btn',
};

export default Link;
