import React, { Component } from "react";
import PropTypes from "prop-types";

import { TransitionGroup, CSSTransition } from "react-transition-group";
import { Tabs, Tab } from "@deer-ui/core/tabs";

import LoginPanel, { LoginPanelProps } from "./login-panel";
import RegisterPanel from "../register";

export interface LoginSelectorProps extends LoginPanelProps {
  isLogin: boolean;
  children?: any;
}

const LoginSelector: React.SFC<LoginSelectorProps> = (props) => {
  const { children, isLogin, autoLoging } = props;

  let container;
  switch (true) {
    case autoLoging:
      container = <div>自动登陆中...</div>;
      break;
    case isLogin:
      container = React.cloneElement(children, props);
      break;
    default:
      container = (
        <Tabs>
          <Tab label="登陆">
            <LoginPanel {...props} />
          </Tab>
          <Tab label="注册">
            <RegisterPanel {...props} />
          </Tab>
        </Tabs>
      );
  }
  return (
    <TransitionGroup component={null}>
      <CSSTransition
        key={isLogin ? "LOGIN_SUCCESS" : "NO_LOGIN_YET"}
        classNames="fade"
        timeout={200}>
        {container}
      </CSSTransition>
    </TransitionGroup>
  );
};

export default LoginSelector;
