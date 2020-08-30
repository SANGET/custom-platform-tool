import { OnNavigate, history } from "multiple-page-routing";

/**
 * 生产应用的 app context
 */
export interface ProviderAppContext {
  location: typeof history.location
  onNavigate: OnNavigate
}
