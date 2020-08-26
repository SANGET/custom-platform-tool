/**
 * Author: Alex Zhang
 * Desc: 此文件为生成环境的主要入口文件
 */

import React from "react";
import { Provider, connect } from "unistore/react";

import AuthSelector from "@infra/auth-selector/selector";
import { authStore, authActions, AuthStore } from "./auth/actions";
import { GlobalStyle } from './style/global-style';
import App from "./app";

const defaultLang = navigator.language || navigator.userLanguage;

const i18nConfig = {
  "zh-CN": "中文",
  "en-US": "English"
};

function selector(state) {
  return state;
}

const loginFormOptions = [
  {
    ref: "AdminName",
    type: "input",
    title: "账号",
    iconName: "account",
    required: true
  },
  {
    ref: "Password",
    type: "password",
    title: "密码",
    iconName: "lock",
    required: true
  },
];

const removeLoadingBG = () => {
  const loaderDOM = document.querySelector("#loadingBg");
  if (!loaderDOM || !loaderDOM.parentNode) return;
  loaderDOM.classList.add("loaded");
  loaderDOM.parentNode.removeChild(loaderDOM);
  // setTimeout(() => {
  // }, 100);
};

type LoginFilterProps = AuthStore

class LoginFilter extends React.Component<LoginFilterProps> {
  componentDidMount = () => {
    // this.props.autoLogin();
    // Call(window.OnLuanched);
    removeLoadingBG();
  }

  render() {
    const { isLogin, userInfo } = this.props;
    // isLogin = process.env.NODE_ENV === "development" ? true : isLogin;
    return (
      <AuthSelector
        {...this.props}
        backgroundImage="url(./images/bg/bg_3.jpg)"
        btnGColor="red"
        logo={() => <h3>admin-dashboard</h3>}
        isLogin={isLogin}
        formOptions={loginFormOptions}
      >
        {isLogin ? (
          <App {...this.props} />
        ) : null}
      </AuthSelector>
    );
  }
}
const LoginFilterWithStore = connect<AuthStore, any, any, any>(
  selector,
  authActions
)((userStore) => <LoginFilter {...userStore} />);

const C = () => (
  <>
    <Provider store={authStore}>
      <LoginFilterWithStore />
    </Provider>
    <GlobalStyle/>
  </>
);

// export default hot(module)(C);
export default C;
