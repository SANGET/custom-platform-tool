declare namespace API {
  export enum CLIENT_TYPE {
    "WEB" = 4
  }
  export interface IResponseBaseType {
    success: boolean;
    code: number;
    message: string;
  }
  export interface ILoginParams{
    username: string;
    password: string;
    clientType: CLIENT_TYPE;
  }

  export interface ILoginType extends IResponseBaseType {
    dataId: null;
    "access_token": string;
    "token_type": string;
    "refresh_token": string;
    "expires_in": number;
    "scope": string;

  }

  export interface IMenuData {
    id: number;
    version: number;
    createdBy: number;
    gmtCreate: number;
    modifiedBy: number;
    gmtModified: number;
    deleteFlag: number;
    name: string;
    type: number;
    pageLink: number;
    icon: string;
    status: number;
    pid: number;
    sort: number;
    level: number;
    path: string;
    pageName: string;
    createdUserName: string;
    modifiedUserName: string;
  }

  export interface IMenunType extends IResponseBaseType {
    result: IMenuData[]
  }

  export interface IMeunParams {
    name: string;
  }

  export interface ICurrentUser {
    avatar?: string;
    name?: string;
    title?: string;
    group?: string;
    signature?: string;
    userid?: string;
    access?: 'user' | 'guest' | 'admin';
    unreadCount?: number;
  }
  export interface ICurrentUserType extends IResponseBaseType {
    dataId: null;
    result: ICurrentUser;
  }

  export interface IPageDataParams {
    id: string;
    mode?: string;
    lessee?: string;
    app?: string;
  }

  export interface IPageDataType extends IResponseBaseType {
    result: string;
  }
}
