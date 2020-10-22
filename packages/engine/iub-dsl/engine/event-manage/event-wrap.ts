import {
  useState, useMemo, useCallback, useContext, useRef
} from 'react';
import { WidgetEvents, ActionTypes, ActionRefType } from "@iub-dsl/definition/events/events";
import { getOnChangeHandle } from './onChange-event';
import { getOnClickHandle } from './onClick-event';
import { FlowItemParseRes, GetFlowItemInfo } from '../flow-engine';
// import { overArgs } from "lodash"; // 包裹函数

interface EventBaseContext {
  action: any
}

const actionRefWithFnWrap = ({
  normalActionHandle,
  runFn
}) => (
  runtimeCtxRef
) => (e) => {
  // 获取标准的事件action参数
  const normalAction = normalActionHandle(e);
  /** 取出useRef的缓存引用 */
  const runtimeCtx = runtimeCtxRef.current;
  const eventContext = {
    action: normalAction,
    ...runtimeCtx
  };
  // 触发标准的事件, 传入上下文
  runFn(eventContext);
};

/** 运行时事件处理 */
export const genEventWrapFnList = (
  dynamicProps,
  { getFlowItemInfo }: { getFlowItemInfo: GetFlowItemInfo}
) => {
  const { widgetEvent } = dynamicProps;
  const eventWrapFnList = widgetEvent?.map((conf) => {
    const { eventType, eventConf: { type: actionType, actionID }, eventHandle } = conf;
    /** 获取真实使用的动作 */
    const { flowItemRun, changeStateToUse, getStateToUse } = getFlowItemInfo(actionID);
    /** 获取规范化事件输入的函数 */
    const normalActionHandle = eventHandle(); // param0: 配置
    if (actionType === 'actionRef') {
      return {
        eventType,
        eventHandle: actionRefWithFnWrap({
          runFn: flowItemRun,
          normalActionHandle
        }),
        eventDeps: getStateToUse // ** 动作解析可以得到
      };
    }
    return false;
  }).filter((a) => a);
  return eventWrapFnList || [];
};

export const useEventProps = (eventWrapFnList: any[], runTimeCtx) => {
  /** 用useRef缓存, 不需要对事件进行watch */
  const eventProps = {};

  eventWrapFnList.forEach(({ eventType, eventHandle, eventDeps }) => {
    /** 缓存每个事件 用useRef缓存减少很多计算 */
    eventProps[eventType] = eventHandle(runTimeCtx);
  });

  /** 换成最终结果 */
  return useMemo(() => eventProps, []);
};

/** 事件解析 */
export const eventPropsHandle = (key, conf, context) => {
  if (key === 'actions') {
    return eventParser(conf, context);
  }
  return false;
};

type Events = keyof WidgetEvents
export const eventParser = (events: WidgetEvents, context) => {
  const event = Object.keys(events);
  let eventConf: ActionTypes;
  const eventParseRes = event.map((eKey) => {
    eventConf = events[eKey];
    if (eventConf.type === 'actionRef') {
      return {
        eventType: eKey,
        eventConf,
        eventHandle: eventParserScheduler(eKey as Events, context)
      };
    }
    return {
      eventType: eKey,
      eventConf,
      eventHandle: eventConf
    };
  });
  if (eventParseRes.length) {
    return {
      type: 'widgetEvent',
      result: {
        widgetEvent: eventParseRes
      }
    };
  }
  return false;
};

const eventParserScheduler = (eventKey: Events, context) => {
  const { compTag } = context;
  switch (eventKey) {
    case 'onChange':
      return getOnChangeHandle(compTag);
    case 'onClick':
      return getOnClickHandle;
    default:
      console.error('未处理的事件');
      return () => {};
  }
};
