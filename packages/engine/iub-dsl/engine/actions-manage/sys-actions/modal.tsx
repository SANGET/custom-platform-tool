import { Modal, Form, Input } from 'antd';
import React, { useContext } from 'react';
import { DefaultCtx } from '../../runtime';

enum ModalType {
  info = 'info',
  success = 'success',
  error = 'error',
  warn = 'warn',
  warning = 'warning',
  confirm = 'confirm'
}

export const showMoadl = (conf) => {
  const {
    actionOptions: {
    },
    actionName, actionOutput, actionId
  } = conf;
  return async ({ action, asyncRuntimeScheduler }) => {
    Modal.confirm({
      icon: false,
      content: <Input />

    });
    // Modal[ModalType.confirm]({
    //   title: '测试弹窗',
    //   content: <div>你猜猜</div>
    // });
  };
};
