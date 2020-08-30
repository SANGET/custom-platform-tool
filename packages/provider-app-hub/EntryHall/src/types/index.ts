import { OnNavigate, history } from "multiple-page-routing";

/**
 * 生产应用的 app context
 */
export interface ProviderAppContext {
  history: typeof history
  onNavigate: OnNavigate
}
