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
    result: null;
  }

  export interface IMenuData {
    id: string;
    menuName: string;
    pid: string;
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
}
