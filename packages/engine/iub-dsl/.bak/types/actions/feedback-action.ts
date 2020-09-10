import { BasicActionConf } from ".";

type FeedBackStatus = 'success' | 'faile'

/** 动作更新运行时状态、 控件赋值 */
export interface FeedBack extends BasicActionConf {
  type: 'feedback';
  state: FeedBackStatus
  msg: string;
}
