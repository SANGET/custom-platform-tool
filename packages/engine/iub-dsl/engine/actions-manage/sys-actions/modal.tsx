import { Modal, Form, Input } from 'antd';
import React from 'react';
import { OpenModal } from '@iub-dsl/definition';
import { IUBDSLRenderer } from '@iub-dsl/platform/react';

enum ModalType {
  info = 'info',
  success = 'success',
  error = 'error',
  warn = 'warn',
  warning = 'warning',
  confirm = 'confirm'
}

export const openModal = (conf: OpenModal) => {
  const {
    actionOptions: {
      type,
      pageUrl
    },
    actionName, actionOutput, actionId
  } = conf;
  return async ({ action, asyncRuntimeScheduler }) => {
    const { userForm } = await import('@iub-dsl/demo/base-reference/user/userfrom');
    console.log(userForm);

    Modal.confirm({
      icon: false,
      content: <IUBDSLRenderer dsl={userForm} />
    });
    // Modal[ModalType.confirm]({
    //   title: '测试弹窗',
    //   content: <div>你猜猜</div>
    // });
  };
};
