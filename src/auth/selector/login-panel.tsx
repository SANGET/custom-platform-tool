import React, { Component } from "react";
import PropTypes from "prop-types";

import { FormGenerator } from "@deer-ui/core/form-generator";
import { Alert } from "@deer-ui/core/alert";
import { FormOptions } from "@deer-ui/core/form-generator/form-generator";

import Storage from "@mini-code/base-func/storage";
import { AuthActions } from "../actions/store";

const isDev = process.env.NODE_ENV == "development";
const StoreLoginInfo = "STORE_LOGIN_INFO";

export interface LoginPanelProps {
  logging: boolean;
  login: AuthActions["login"];
  loginResDesc: string;
}

export default class LoginPanel extends Component<LoginPanelProps> {
  formOptions: FormOptions;

  formHelper;

  constructor(props) {
    super(props);

    this.formOptions = [
      {
        ref: "username",
        type: "input",
        defaultValue: "qwe",
        title: "账号",
        iconName: "account",
        required: true
      },
      {
        ref: "password",
        type: "password",
        defaultValue: "123",
        title: "密码",
        iconName: "lock",
        required: true
      }
    ];
  }

  // componentDidMount() {
  //   const loaderDOM = document.querySelector('#loadingBg');
  //   if (!loaderDOM) return;
  //   loaderDOM.classList.add('loaded');
  //   loaderDOM.parentNode.removeChild(loaderDOM);
  //   setTimeout(() => {
  //     process.env.NODE_ENV == 'development' && document.querySelector('#freeLogin').click();
  //   }, 100);
  // }

  render() {
    const { logging, login, loginResDesc } = this.props;

    return (
      <div className="login-panel fixbg">
        <div className="form-layout">
          <h3 className="title"></h3>
          {loginResDesc && <Alert text={loginResDesc} />}
          <FormGenerator
            className="login-form-container"
            // inlineTitle={true}
            onSubmit={(e) => {
              login(this.formHelper.value, (userInfo) => {
                // console.log(userInfo)
                Storage.setItem(StoreLoginInfo, userInfo);
              });
            }}
            showInputTitle
            formOptions={this.formOptions}
            ref={(e) => (this.formHelper = e)}>
            <div className="form-group">
              <button
                type="submit"
                className="btn theme flat login-btn"
                id="freeLogin">
                {logging ? "登录中..." : "登录"}
              </button>
            </div>
          </FormGenerator>
        </div>
      </div>
    );
  }
}
