import { ProColumns } from "@hy/pro-table";
import { ITableItem, IOperationalMenuItem } from "./interface";

export const SELECT_ALL = "all";
export enum MENUS_TYPE {
  /** 模块 */
  "MODULE",
  /** 页面 */
  "PAGE"
}
export const PAGE_CONFIG = { SIZE: 10, SIZE_OPTIONS: ["10", "20", "30", "40", "50", "100"] };
export const PAGE_TYPE_ENUM = [
  { text: "自定义页面", value: 1 },
  { text: "仪表盘页面", value: 2 },
  { text: "定制页面", value: 3 }
];
export const TABLE_COLUMNS: ProColumns<ITableItem>[] = [
  {
    title: '序号',
    dataIndex: 'index',
    width: 80,
    hideInSearch: true,
    render: (text, _, index) => index + 1
  },
  {
    title: '页面名称',
    dataIndex: 'name',
    width: 200,
    ellipsis: true
  },
  {
    title: '页面类型',
    dataIndex: 'type',
    valueEnum: PAGE_TYPE_ENUM.reduce((a, b) => {
      a[b.value] = Object.assign({ text: b.text });
      return a;
    }, {}),
    width: 150,
  },
  {
    title: '归属模块',
    dataIndex: 'belongMenus',
    ellipsis: true,
    width: 150,
    hideInSearch: true
  },
  {
    title: '数据表',
    dataIndex: 'dataSources',
    ellipsis: true,
    width: 150,
    hideInSearch: true
  },
  {
    title: '创建时间',
    dataIndex: 'gmtCreate',
    hideInSearch: true,
    width: 210,
    valueType: 'dateTime'
  },
  {
    title: '当前版本',
    dataIndex: 'currentVersion',
    hideInSearch: true,
    width: 120,
  },
  {
    title: '发布版本',
    dataIndex: 'publishedVersion',
    hideInSearch: true,
    width: 120,
  },
  {
    title: '最后修改时间',
    dataIndex: 'gmtModified',
    hideInSearch: true,
    width: 210,
    valueType: 'dateTime'
  },
  {
    title: '最后修改人员',
    dataIndex: 'modifiedUserName',
    hideInSearch: true,
    width: 150,
  }
];
export const OPERATIONAL_MENU: IOperationalMenuItem[] = [
  {
    operate: "edit",
    title: "编辑",
    behavior: "link"
  },
  {
    operate: "release",
    title: "发布",
    behavior: ""
  },
  {
    operate: "delete",
    title: "删除",
    behavior: ""
  }
  // {
  //   operate: "copy",
  //   title: "复制",
  //   behavior: "onClick",
  // },
];
