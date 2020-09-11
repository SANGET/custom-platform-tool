import { BasicActionConf } from ".";

/** 数据引用关系得额外转换和处理 */
export interface QuoteEffectAction extends BasicActionConf {
  type: 'quoteEffectAction';
  useQuoteRelation: string | string[];
  // 输入
  // 转换
  // 输出
}
