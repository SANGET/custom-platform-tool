import { notification } from 'antd';

/** 弹出提示 */
type IStatus = "success" | "info" | "warning" | "error"
export const openNotification = (type: IStatus, msg = "", description = "") => {
  notification?.[type]?.({
    message: msg,
    description
  });
};
