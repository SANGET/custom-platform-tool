import { Modal } from 'antd';

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
    Modal[ModalType.confirm]({
      title: '测试弹窗',
    });
  };
};
