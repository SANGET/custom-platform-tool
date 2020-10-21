export interface ITableItem {
  id: string;
  /** 页面名称 */
  name: string;
  /** 页面类型 */
  type: string;
  /** 归属模块 */
  belongMenus: string[];
  /** 数据表 */
  dataSources: string[];
  /** 创建时间 */
  gmtCreate: string;
  /** 当前版本 */
  currentVersion: string;
  /** 发布版本 */
  publishedVersion: string;
  /** 最后修改时间 */
  gmtModified: string;
  /** 最后修改人员 */
  modifiedUserName: string;
}
export interface IOperationalMenuItem {
  operate: string;
  title: string;
  behavior: string;
}
export interface IValueEnum {
  [key: string]: React.ReactNode | {
    text: React.ReactNode;
    status?: 'Success' | 'Error' | 'Processing' | 'Warning' | 'Default';
  };
}

export interface IReleaseParams {
  menuIds: string[];
  pageInfoIds: string[];
}

export interface INode {
  title: string | React.ReactElement;
  name: string;
  key: string;
  id: string;
  pid: string;
  value?: string;
}

export interface IOperationalMethods {
  [key: string]: (item: ITableItem) => void;
}
