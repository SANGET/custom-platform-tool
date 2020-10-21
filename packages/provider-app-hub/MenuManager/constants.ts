import {
  MENUS_TYPE as MENU_TYPE, API_CODE, NOTIFICATION_TYPE, BUTTON_TYPE, BUTTON_SIZE
} from '@provider-app/table-editor/constants';

export {
  MENU_TYPE, API_CODE, NOTIFICATION_TYPE, BUTTON_TYPE, BUTTON_SIZE
};
export const SELECT_ALL = 'all';
export const MENU_OPTIONS = [
  {
    label: "模块",
    value: MENU_TYPE.MODULE,
    key: MENU_TYPE.MODULE,
  }, {
    label: "页面",
    value: MENU_TYPE.PAGE,
    key: MENU_TYPE.PAGE,
  },
];
export const STATUS_OPTIONS = [
  {
    label: "禁用",
    value: MENU_TYPE.MODULE,
    key: MENU_TYPE.MODULE,
  }, {
    label: "启用",
    value: MENU_TYPE.PAGE,
    key: MENU_TYPE.PAGE,
  },
];

export const MESSAGE = {
  GET_MENU_LIST_FAILED: "获取菜单列表数据失败，请联系技术人员",
  SET_STATUS_FAILD: "更改状态失败，请联系技术人员",
  EDIT_MENU_FAILED: "修改菜单数据失败，请联系技术人员",
  ADD_MENU_FAILED: "新增菜单数据失败，请联系技术人员",
  DEL_MENU_FAILED: "删除菜单数据失败，请联系技术人员",
  DEL_MENU_SUCCESS: "删除菜单数据成功",
  SELECT_ICON_FAILED: "请选择图标",
  NAME_REGUIRED: "菜单名称必填",
  NAME_REG_FAILED: "支持32个字符内的中文、英文、数字"
};

export const MENU_KEY = {
  ID: 'id',
  PID: 'pid',
  NAME: 'name',
  TYPE: 'type',
  PAGELINK: 'pageLink',
  PAGENAME: 'pageName',
  ICON: 'icon',
  STATUS: 'status',
  GMTMODIFIED: 'gmtModified',
  CREATEUSERNAME: 'createdUserName',
  CREATEDCUSTOMED: 'createdCustomed',
  EDITABLE: 'editable',
  CHILDREN: 'children',
  INDEXPATH: 'indexPath',
  IDPATH: 'idPath',
  LEVEL: 'level'
};

export enum SAVE_TYPE {
  EDIT = 'edit',
  ADD = 'add'
}

export enum ICON_DEFAULTVALUE {
  MODULE = 'RiFolderLine',
  PAGE = 'RiFileTextLine'
}

export const MAX_LEVEL = 5;

export const NAME_REG = /^[\u4e00-\u9fa5a-zA-Z0-9]{1,32}$/;
