import {
  DataCollection,
  BaseCollectionStruct,
} from "@iub-dsl/definition/actions";
import { RuntimeSchedulerFnName } from "../../runtime";

export const dataCollectionAction = (conf: DataCollection) => {
  const { actionName, actionOptions: { collectionType, struct }, when } = conf;
  if (collectionType === 'structArray') {
    return async ({ action, asyncRuntimeScheduler }) => {
      return await asyncRuntimeScheduler({
        actionName,
        type: RuntimeSchedulerFnName.getPageState,
        params: [struct]
      });
    };
  }
  /**
   * structObject
   * 1. pageState中字段的映射 collectField 「含有运行时状态、表达式」
   * 2. 映射成元数据形式 field
   * 3. 固定映射 aliasField
   */
  return async ({ action, asyncRuntimeScheduler, runtimeScheduler }) => {
    const newStruct = genGetPagetStateStruct(struct, runtimeScheduler);
    return await asyncRuntimeScheduler({
      actionName,
      type: RuntimeSchedulerFnName.getPageState,
      params: [newStruct]
    });
  };
};

const genGetPagetStateStruct = (struct: (string | BaseCollectionStruct)[], runtimeScheduler) => {
  return struct.reduce(((result, sInfo: (string | BaseCollectionStruct)) => {
    if (typeof sInfo === 'string') {
      result[sInfo] = sInfo;
    } else {
      const { aliasField, field, collectField } = sInfo;
      if (collectField !== undefined) {
        /** TODO: aliasField和field 的优先级问题 */
        if (field !== undefined) {
          const fieldCode = runtimeScheduler({
            type: 'getFiledCode',
            params: [field]
          });
          if (fieldCode) {
            result[fieldCode] = collectField;
          } else {
            console.error('数据源映射转换失败!!');
            result[field] = collectField;
          }
        } else if (aliasField !== undefined) {
          result[aliasField] = collectField;
        }
      } else {
        console.error('收集结构信息错误无收集字段信息: collectField');
      }
    }
    return result;
  }), {});
};
