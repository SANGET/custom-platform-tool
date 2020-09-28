import React from "react";

import { getUrlParams } from "@mini-code/request/url-resolve";
import { Call, IsUrl } from "@mini-code/base-func";
import classnames from 'classnames';

import { getRouteKey, onNavigate, NavParams } from "../utils";

export interface LinkProps {
  /** 将要导航到的路由 */
  to: string;
  className?: string;
  /** 是否激活 */
  isActive?: boolean;
  onClick?: React.DOMAttributes<HTMLSpanElement>['onClick'];
  /** 作为 query string 的导航参数，例如 { ID: 123, name: alex } -> ID=123&name=alex */
  params?: NavParams;
}

/**
 * 用于导航到另外页面的组件
 */
const Link: React.SFC<LinkProps> = ({
  to,
  className,
  isActive,
  children,
  onClick,
  params,
}) => {
  const activeRoute = getUrlParams(undefined, undefined, true)[getRouteKey()];
  const _isActive = typeof isActive != "undefined" ? isActive : activeRoute === to;

  const classes = classnames(
    _isActive && 'active',
    className
  );

  return (
    <span
      className={classes}
      onClick={(e) => {
        Call(onClick, e);
        if (IsUrl(to)) {
          window.open(to);
        } else {
          onNavigate({
            type: "PUSH",
            path: to,
            params,
          });
        }
      }}
    >
      {children}
    </span>
  );
};

Link.defaultProps = {
  className: "link-btn",
};

export default Link;
