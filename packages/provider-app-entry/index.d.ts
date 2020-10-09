import { PageDesignerPropItemTypes } from '@provider-app/page-designer/types';
import { ProviderAppContext } from './src/types';

/**
 * 子应用的 props
 */
export interface ProviderSubAppPropsScope extends ProviderAppContext {
  /** 页面的验证信息 */
  pageAuthInfo
  /** 当前页面的 path */
  pagePath: string
  /** 应用的 location */
  appLocation
}

interface AppConfig {
  apiUrl: string
}

declare global {
  const $AppConfig = AppConfig;
  const $GetAppConfig;
  interface Window {
    $AppConfig: AppConfig
  }
}

/**
 * 子应用的配型
 */
type HYSubAppTypeRE = React.ElementType<ProviderSubAppPropsScope>

/**
 * HOC 子应用
 */
type HYSubAppTypeFE<T> = (props: ProviderSubAppPropsScope) => React.ElementType<T>

/**
 * 向 provider app 注入一些全局校验
 */
declare global {
  /** HY */
  namespace HY {
    type ProviderSubAppProps = ProviderSubAppPropsScope
    /** 通用子应用 */
    type SubApp = HYSubAppTypeRE
    /** HOC 子应用 */
    type SubAppHOC<T = any> = HYSubAppTypeFE<T>
  }
  /** 页面设计器的类型定义 */
  namespace VEExtention {
    /** 属性项的定义 */
    type PropItemTypes = PageDesignerPropItemTypes
  }
}
