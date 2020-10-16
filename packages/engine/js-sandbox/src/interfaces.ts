export type IFakeWindow = Window & Record<PropertyKey, any>

export interface IOptions {
  // window 黑名单属性列表
  blackList?: string[];
}

export interface IBlackMap {
  [other: string]: boolean;
}
