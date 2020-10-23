import { ApbFunction } from "@iub-dsl/definition";

/**
 * TODO: 这是个大难题, 需要多尝试多思考
 */

/**
 * 关系处理模块
 * 主要职责:
 * 1. 处理数据的副作用「如: 对表的增、改、删需要收集记录」, 并对应处理其副作用
 */

/**
  * 处理表副作用的研讨:
  * 1. 收集影响是在哪个时机收集呢? 每条APBDSL转换时? CUD动作完成时? 在调度中心收集?
  * 2. 应该触发什么动作呢?
  *   1. 更新有关联的数据「表格、表单」 --> 自动触发流程?
  *   2. 其他什么副作用????
  */

/**
 * 运行记录收集/副作用处理?
 * 收集什么信息才是最有用的?
 * 1. 期望在每项流程运行前和后收集. 「但是仅能拿到处理结果和交互信息, 并不符合当前需求」
 * 2. 每个动作运行信息? 「侵入动作本身逻辑入侵太大, 有污染嫌疑」
 * 3. 都在调度中心耦合会好维护 「但是不能保证不臃肿」
 */

/**
 * 收集有可能产生影响的信息, 「如表格」
 * 使用?: 需要依赖收集才可以用啊??? 表依赖收集?? 数据使用的依赖收集??
 */
const collectEffectInfoFromAPBDSL = (APBDSLCURDParam) => {
  const { businesscode, steps } = APBDSLCURDParam;
  const effectInfo: any[] = [];
  steps.forEach(({ function: { code, params } }) => {
    const { table } = params;
    switch (code) {
      case ApbFunction.DEL:
      case ApbFunction.UPD:
      case ApbFunction.SET:
        effectInfo.push({
          table,
          fnCode: code
        });
        break;
      default:
        break;
    }
  });
  return {
    type: 'effectTable',
    businesscode,
    effectInfo,
  };
};

const vaildCollect: any[] = [];

const pickVaildCollect = () => {
  return vaildCollect.filter((v) => v.isRunSuccess);
};

export const collectRelationshipFromScheduler = (schedulerCtx) => {
  const {
    action, type, params, actionName
  } = schedulerCtx;
  const actionType = action?.type;

  let collectInfo = {
    type: 'emptyCollect',
    isRunSuccess: false
  };
  switch (actionType) {
    case 'APBDSLCURDAction':
      collectInfo = {
        ...collectInfo,
        ...collectEffectInfoFromAPBDSL(params[0])
      };
      break;
    default:
      break;
  }

  if (collectInfo.type !== 'emptyCollect') {
    vaildCollect.push(collectInfo);
  }
  console.log(vaildCollect);

  return collectInfo;
};
