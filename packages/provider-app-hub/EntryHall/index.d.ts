/**
 * 子应用接入规范
 */
export interface SubAppSpec {
  pageContext
}

/**
 * 子应用的配型
 */
declare type HYSubAppType = React.ElementType<SubAppSpec>

/**
 * 向 provider app 注入一些全局校验
 */
declare global {
  /** HY */
  namespace HY {
    type SubApp = HYSubAppType
  }
}
