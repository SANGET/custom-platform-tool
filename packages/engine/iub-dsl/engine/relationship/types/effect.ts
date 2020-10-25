/** 动作的枚举类型 */
enum TriggerType {
  update = 'update',
  set = 'set',
  delete = 'delete',
  userBehavior = 'userBehavior'
}

/**
 * 元数据影响的描述
 */
interface MetadataEffectInfo {
  /** 引用位置 */
  metadataRef?: string;
  /** 触发的动作 */
  metadataTriggerType?: TriggerType;
}

/**
 * 页面状态影响的描述
 */
interface SchemasEffectInfo {
  /** 引用位置 */
  schemasRef?: string;
  /** 触发的动作 */
  schemasTriggerType?: TriggerType;
}

/** 影响信息描述, 可以有多影响 */
type EffectInfo = (MetadataEffectInfo & SchemasEffectInfo)[]

/**
 * 动作造成的影响的描述信息
 * 说明:
 *  1. 触发了有影响的操作达到了, 触发影响的可能
 *  2. 每个动作的描述信息都不一样
 *  3. 一个动作可以包含多个影响信息
 */
export interface ActionEffect extends EffectInfo {
  actionType: string;
}

/**
 * apbdslCURD动作的影响
 */
export interface APBDSLActionEffect extends ActionEffect {
  actionType: string;
  businessCode: string;
}

/**
 * 动作影响收集后的格式
 */
export interface ActionEffectCollection {
  [actionId: string]: APBDSLActionEffect

}
