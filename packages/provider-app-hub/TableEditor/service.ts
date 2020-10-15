import { notification, Modal } from 'antd';
import { construct as contructTree } from '@infra/utils/tools';
import { FIELDTYPE } from './constants';
import { ISELECTSMENU, ITableColumnFromApi } from './interface';

export { contructTree };
const { confirm } = Modal;
/** 弹出提示 */
type IStatus = "success" | "info" | "warning" | "error"
export const openNotification = (type: IStatus, msg = "", description = "") => {
  notification?.[type]?.({
    message: msg,
    description
  });
};
/**
 * 更改表列表为 下拉框组件支持的数据格式
 * @param tables 表列表
 * @returns selectMenu 下拉框列表
 */
interface ITable {
  code: string
  name: string
  id: string
}
export const translateTableListToSelectMenus = (tables:ITable[]): ISELECTSMENU[] => {
  if (!Array.isArray(tables)) return [];
  return tables.map((item) => {
    return {
      key: item?.id,
      value: item?.code,
      label: item?.name
    };
  });
};
/**
 * 更改字段列表为 下拉框组件支持的数据格式
 * @param fields 字段列表
 * @returns selectMenu 下拉框列表
 */
export const translateFieldListToSelectMenus = (fields: ITableColumnFromApi[]):ISELECTSMENU[] => {
  if (!Array.isArray(fields)) return [];
  return fields
    .filter((item) => item.fieldType !== FIELDTYPE.TEXT)
    .map((item) => {
      return {
        key: item.id,
        value: item.code,
        label: item.name
      };
    });
};

interface IDeleteConfirmParam {
  title?: string
  okText?: string
  cancelText?: string
  onOk?: ()=>void
  onCancel?: ()=>void
}
/**
 * 删除询问框
 *
 * @param {string} title 询问框标题
 * @param {string} okText 确定按钮名称
 * @param {string} cancelText 取消按钮名称
 * @param {function} onOk 点确定按钮执行的操作
 * @param {function} onCancel 点取消按钮执行的操作
 * @returns {void}
 */
export const deleteConfirm = (param: IDeleteConfirmParam): void => {
  const {
    title = '是否确定删除？', cancelText = '取消', okText = '确定', onOk, onCancel
  } = param || {};
  confirm({
    title,
    cancelText,
    okText,
    onOk() {
      typeof onOk === 'function' && onOk();
    },
    onCancel() {
      typeof onCancel === 'function' && onCancel();
    },
  });
};
export const getlabelByMenuList = (menu: ISELECTSMENU[], key?: string): string => {
  return key ? (menu?.filter((item) => item?.value === key)?.[0]?.label || '') : '';
};
