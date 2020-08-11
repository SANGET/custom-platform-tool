import React, {
  Fragment, useState, useCallback, useMemo, useEffect
} from "react";
import { ComponentElement, ActionTypes } from "@iub-dsl/core/types/component/collection";
import { UserBehavior } from "@iub-dsl/core";
import GetUIParser from "./ui";

interface ComponentParseRes {
  [compID: string]: (runtimeContext, ...args) => JSX.Element
}
type ActionAnalysisResult = {
  [action in UserBehavior]: (...any) => unknown;
};

interface EntityCompParam {
  props: { [str: string]: unknown };
  actions: ActionAnalysisResult;
  dataSource?: any;
  id: string;
  value?: string;
  text?: string;
}

// 一个Comp实例有一个
const resolveComp = {};

const resolveProps = (props, runtimeContext) => {
  return Object.keys(props).reduce((res, key) => {
    res[key] = /^\@\(schemas\)/.test(props[key]) ? runtimeContext.pageRuntimeState[props[key].replace(/^\@\(schemas\)/, '')] : props[key];
    return res;
  }, {});
};

const resolveEvent = (events, runtimeContext) => {
  return Object.keys(events).reduce((res, key) => {
    res[key] = events[key](runtimeContext);
    return res;
  }, {});
};

/**
 * 解析IUB组件集合
 * 绑定已经解析上下文的数据
 * @param compId 组件ID
 * @param componentElement 组件元素配置
 * @param parserContext 解析上下文
 * @returns 渲染组件的构造函数, 运行时候结合运行时上下文解析真实的props, 并返回能够渲染的jsx.Element
 */
/**
 * @step_1 获取组件、props、actions绑定
 * @step_2 传入context, 组装绑定和解析的函数, ??
 * @step_3 实际解析props,和绑定action ??
 */
const parseComponent = (compId: string, componentElement: ComponentElement, parserContext) => {
  const CompConstructor: React.FC<any> = GetUIParser(componentElement.component.type);

  const props = {
    ...componentElement.component
  };
  //  解析动作
  const { actions = {} } = componentElement;
  const events = Object.keys(actions || {}).reduce((res, key) => {
    res[key] = parserContext.actionParseRes[actions[key].actionID];
    return res;
  }, {});

  // CompConstructor
  return (runtimeContext) => {
    // TODO: 是否再包裹一层
    const newEvents: any = resolveEvent(events, runtimeContext);
    const newProps: any = resolveProps(props, runtimeContext);
    // console.log(newEvents, props);
    useEffect(() => {
      if (Reflect.has(newEvents, 'onMount')) {
        newEvents.onMount();
      }
      return () => {
        console.log('unMount');
      };
    }, []);
    return (
      <CompConstructor
        // key={compId}
        {...newProps}
        {...newEvents}
      ></CompConstructor>
    );
  };
};

/**
 * 解析 DSL 描述的 component
 */
const ComponentCollectionParser = (
  componentCollection: { [compID: string]: ComponentElement },
  parserContext // 依赖~
) => {
  const parseResult: ComponentParseRes = {};
  let temp: ComponentElement;
  const componentIdArr = Object.keys(componentCollection);

  componentIdArr.map((compId) => {
    temp = componentCollection[compId];
    switch (temp.type) {
      case 'component':
        parseResult[compId] = parseComponent(compId, temp, parserContext);
        break;
    }
  });

  return parseResult;
};

export default ComponentCollectionParser;

/**
 * 解析pubprops、 获取解析好的actions解析组件本身的props [用到value、changeValue]
 * 在真实渲染之前,props都会改变
 * 1. props 解析器处理一次
 * 2. props 渲染的时候处理一次
 */
