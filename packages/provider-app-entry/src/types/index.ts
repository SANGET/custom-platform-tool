import { OnNavigate, history } from "multiple-page-routing";

/**
 * 生产应用的 app context
 */
export interface ProviderAppContext {
  /** history 对象 */
  history: typeof history
  /** 导航器 */
  onNavigate: OnNavigate
}
