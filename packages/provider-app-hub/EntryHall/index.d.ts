import { ProviderAppContext } from './src/types';

/**
 * 子应用接入规范
 */
export interface SubAppSpec extends ProviderAppContext {
  pageContext
}

/**
 * 子应用的配型
 */
type HYSubAppTypeRE = React.ElementType<SubAppSpec>

/**
 * HOC 子应用
 */
type HYSubAppTypeFE<T> = (props: SubAppSpec) => React.ElementType<T>

/**
 * 向 provider app 注入一些全局校验
 */
declare global {
  /** HY */
  namespace HY {
    /** 通用子应用 */
    type SubApp = HYSubAppTypeRE
    /** HOC 子应用 */
    type SubAppHOC<T = any> = HYSubAppTypeFE<T>
  }
}
