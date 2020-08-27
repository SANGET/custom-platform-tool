import React, {
  useLayoutEffect,
  Fragment, useState, useCallback, useMemo, useEffect
} from "react";
import { ComponentElement, ActionTypes } from "@iub-dsl/core/types/component/collection";
import { isPlainObject } from "lodash";
import GetUIParser from "./ui";

const testWithSchemas = (text: string) => /^@\(schemas\)/.test(text);
const replaceWithSchemas = (text: string) => text.replace(/^@\(schemas\)/, '');

/**
 * 调度解析, 静态的props和需要被额外解析的props
 * @param props 组件的所有props
 */
const propsParserScheduler = (props) => {
  const propsKeys = Object.keys(props);
  let propsItem;
  const staticProps = {};
  const runProps = {};
  propsKeys.forEach((key) => {
    propsItem = props[key];
    if (typeof propsItem === 'string') {
      if (testWithSchemas(propsItem)) {
        runProps[key] = {
          type: 'stateManage',
          how: 'getState',
          filed: replaceWithSchemas(propsItem)
        };
      } else {
        staticProps[key] = propsItem;
      }
    }
    // 如: 低代码的描述
    if (isPlainObject(propsItem)) {}
  });

  return {
    staticProps, runProps
  };
};

const styleParserScheduler = (style) => {
  const styleKeys = Object.keys(style);
  let styleItem;
  const staticStyle = {};
  const runStyle = {};
  styleKeys.forEach((key) => {
    styleItem = style[key];
    if (typeof styleItem === 'string') {
      if (testWithSchemas(styleItem)) {
        runStyle[key] = {
          type: 'stateManage',
          how: 'getState',
          filed: replaceWithSchemas(styleItem)
        };
      } else {
        staticStyle[key] = styleItem;
      }
    }
    // 如: 低代码的描述
    if (isPlainObject(styleItem)) {}
  });

  return {
    staticStyle, runStyle
  };
};

const actionParserScheduler = (actons) => {

};

const resolveRunProps = (IUBRuntimeContext, runProps) => {
  let temp;
  return Object.keys(runProps).reduce((res, key) => {
    temp = runProps[key];
    // console.log(temp);
    res.sourcePath[key] = temp.filed;
    if (isPlainObject(temp)) {
      res.resolveVal[key] = IUBRuntimeContext[temp.type][temp.how](temp.filed);
    } else {
      res.resolveVal[key] = '';
    }
    return res;
  }, {
    resolveVal: {},
    sourcePath: {}
  });
};

const resolveRunStyle = (IUBRuntimeContext, runStyle) => {
  let temp;
  let stateValue;
  return Object.keys(runStyle).reduce((res, key) => {
    temp = runStyle[key];
    // console.log(temp);
    if (isPlainObject(temp)) {
      stateValue = IUBRuntimeContext[temp.type][temp.how](temp.filed);
      // 低代码!!
      if (key === 'display') {
        res[key] = stateValue ? 'block' : 'none';
      }
    } else {
      res[key] = '';
    }
    return res;
  }, {});
};

/**
 * 解析要素
 * 1. 获取组件「组件Comp」
 * 2. 解析props「静态props、动态增强解析的props」
 * 3. 事件容器绑定
 *
 * 1. 组件特有props // 实际上,应该是并不知道的, 而是有内部隔离的实现
 * 2. 需求公共props
 * 3. 需求的style
 * 4. 业务逻辑导致的style
 * 5. 业务逻辑导致props
 */
const parseComponent = (compId: string, componentElement: ComponentElement, parserContext) => {
  const CompConstructor: React.FC<any> = GetUIParser(componentElement.componentType);
  const { actions = {}, props = {}, style = {} } = componentElement;

  const { staticProps, runProps } = propsParserScheduler(props);

  const { staticStyle, runStyle } = styleParserScheduler(style);

  //  解析动作
  let resolvedEvents;

  // CompConstructor
  return (IUBRuntimeContext) => {
    if (!resolvedEvents) {
      resolvedEvents = Object.keys(actions || {}).reduce((res, key) => {
        res[key] = parserContext.bindAction(actions[key].actionID)(IUBRuntimeContext);
        return res;
      }, {});
    }
    // TODO: 是否再包裹一层
    // console.log({ staticProps, runProps });
    // console.log({ staticStyle, runStyle });

    // useEffect(() => {
    //   if (Reflect.has(newEvents, 'onMount')) {
    //     newEvents.onMount();
    //   }
    //   return () => {
    //     console.log('unMount');
    //   };
    // }, []);
    const { resolveVal, sourcePath } = resolveRunProps(IUBRuntimeContext, runProps);

    return (
      <CompConstructor
        id={compId}
        events={resolvedEvents}
        sourcePath={sourcePath}
        // setStyle={staticStyle}
        style= {{
          ...resolveRunStyle(IUBRuntimeContext, runStyle)
        }}
        {
          ...staticProps
        }
        {
          ...resolveVal
        }
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
  /** 一次解析仅有一个解析后的Comp */
  const resolvedComp = {};
  const parseResult = {};
  let temp: ComponentElement;
  const componentIdArr = Object.keys(componentCollection);

  componentIdArr.forEach((compId) => {
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
