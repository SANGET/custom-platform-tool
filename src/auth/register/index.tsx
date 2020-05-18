import React, { Component } from "react";

import { FormGenerator, TipPanel } from "@deer-ui/core";
import { FormOptions } from "@deer-ui/core/form-generator/form-generator";

import { register } from "../actions/apis";

export default class Register extends Component {
  state = {
    logging: false
  };

  formOptions: FormOptions;

  formHelper;

  constructor(props) {
    super(props);

    this.formOptions = [
      {
        ref: "username",
        type: "input",
        title: "账号",
        iconName: "account",
        required: true
      },
      {
        ref: "password",
        type: "password",
        title: "密码",
        iconName: "lock",
        required: true
      }
    ];
  }

  render() {
    const { logging } = this.state;
    return (
      <div className="login-panel fixbg">
        <div className="form-layout">
          <h3 className="title"></h3>
          <FormGenerator
            className="login-form-container"
            // inlineTitle={true}
            onSubmit={(e) => {
              register(this.formHelper.value);
            }}
            showInputTitle
            formOptions={this.formOptions}
            ref={(e) => (this.formHelper = e)}>
            <div className="form-group">
              <button
                type="submit"
                className="btn theme flat login-btn"
                id="freeLogin">
                {logging ? "注册中..." : "注册"}
              </button>
            </div>
          </FormGenerator>
        </div>
      </div>
    );
  }
}
