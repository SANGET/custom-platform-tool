import { ComplexType } from "@iub-dsl/definition/schemas";
import { CommonCondition } from "@iub-dsl/definition/public";
import { BasicActionConf } from "..";

/**
 * 基础的数据收集结构, 递归由数据表的关系进行额外考虑
 */
export interface BaseCollectionStruct extends CommonCondition {
  /** 页面运行时状态/固定值/表达式 */
  collectField: string;
  /** 对应表格得字段, 为空默认和dateMapping一致 */
  field?: string;
  /** 别名字段 */
  aliasField?: string;
}

/**
 * 数据收集关系: 按照描述的规则将数据成组收集起来, 再提供给其他模块使用
 * 范围: 动作传参、页面传参、apb-dsl传参
 * 问题: 是否需要顺序编排; 连表如何扩展, 若支持, 额外关系处理的位置?
 * 界限: 是否可以和配置一一对应
 */

interface ColletionStruct extends CommonCondition {
  type: 'dataCollection';

  /** 收集类型array/object */
  collectionType: ComplexType;
  /** 有结构就是完整得描述, 字符串默认收集 collectField */
  struct: (BaseCollectionStruct | string)[];
}

export type DataCollection = (ColletionStruct)& BasicActionConf
