import { OnNavigate, history } from "multiple-page-routing";

/**
 * 生产应用的 app context
 */
export interface ProviderAppContext {
  /** history 对象 */
  history: typeof history
  /** 当前的 location 信息 */
  location
  /** 当前页面的 path */
  pagePath: string
  /** 导航器 */
  onNavigate: OnNavigate
}
