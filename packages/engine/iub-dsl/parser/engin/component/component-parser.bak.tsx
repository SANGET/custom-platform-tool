import React, {
  Fragment, useState, useCallback, useMemo, useEffect
} from "react";
import { ComponentElement, ActionTypes } from "@iub-dsl/core/types/component/collection";
import { UserBehavior } from "@iub-dsl/core";
import GetUIParser from "./ui";

interface ComponentParseRes {
  [compID: string]: JSX.Element
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

interface EntityComp {
  (param: EntityCompParam, context): JSX.Element;
}

const getfield = (str: string) => {
  return str ? str.replace('@(schemas)', 'pageRuntimeState.').split('.').map((_) => _.trim()) : [];
};

const posfield = (posArr, parserContext) => {
  return posArr.reduce((res, pos) => {
    res = res[pos] || res.state[pos];
    return res;
  }, parserContext);
};

const parsePublicProps = (props) => {
  return props;
};

// 额外的转换
const transformInputChange = (fn, compInfo, context) => {
  return (value, elm): unknown => {
    // console.log(value, elm);
    // console.log(context);
    // 统一接口规范处理
    let { field } = compInfo;
    field = field.replace('@(schemas)', '');
    context.setPageRuntimeState({
      [field]: value
    });
    return fn({
      value, elm, field, context
    });
  };
};

// 处理弹窗选择的
const transformInputClick = (fn, compInfo, context) => {
  // Demo: 1、显示页面、2、等待页面信号 3、值的改变  ==>  数据变更关系
  return (e: Event) => {
    // 表达式解析的结果
    context.setPageRuntimeState({
      data_UUID: true
    });
    console.log(fn, compInfo, context);
  };
};

const transformSelectorChange = (fn, compInfo, context) => {
  return (e) => {
    console.log(e);
  };
};

const transformButtonClick = (fn, compInfo, context) => {
  return (e: Event) => {
    e.preventDefault();
    e.stopPropagation();
    const queryParam = context.dataCollection.getCollectionData('user');
    console.log(queryParam);
    return fn(e, queryParam);
  };
};

// 额外的转换 -- EDN Demo用

// const sysConfigKey = ['value', ]
const resolveSysString = (str: string, context) => {
  if (/@\(schemas\)/.test(str)) {
    str = str.replace('@(schemas)', '');
    return context.pageRuntimeState[str];
  }
  return str;
};

const sysCompConfigParser = (compConfig, context) => {
  return Object.keys(compConfig).reduce((res, confKey) => {
    const compConfigItem = compConfig[confKey];
    if (typeof compConfigItem === 'string') {
      res[confKey] = resolveSysString(compConfigItem, context);
      // res[confKey] = JSON.stringify(res[confKey]);
      if (typeof res[confKey] === 'object') {
        res[confKey] = res[confKey].show;
      }
    } else {
      res[confKey] = compConfigItem;
    }
    return res;
  }, {});
};

const parseComponent = (compId, componentElement: ComponentElement, parserContext) => {
  const pubPropsRes = parsePublicProps(componentElement.props);
  let temp: ActionTypes;
  const compUseActions = typeof componentElement.actions === 'object' ? componentElement.actions : {};
  const actions = Object.keys(compUseActions).reduce((r, actionType) => {
    temp = compUseActions[actionType];
    r[actionType] = temp.type === 'actionRef' ? parserContext.bindAction(temp.actionID) : () => {};
    if (actionType === 'onChange' && componentElement.component.type === 'Input') {
      r[actionType] = transformInputChange(r[actionType], componentElement.component, parserContext);
    } else if (actionType === 'onClick' && componentElement.component.type === 'Button') {
      r[actionType] = transformButtonClick(r[actionType], componentElement.component, parserContext);
    } else if (actionType === 'onClick' && componentElement.component.type === 'Input') {
      r[actionType] = transformInputClick(r[actionType], componentElement.component, parserContext);
    } else if (actionType === 'onChange' && componentElement.component.type === 'Selector') {
      r[actionType] = transformSelectorChange(r[actionType], componentElement.component, parserContext);
    }
    return r;
  }, {} as ActionAnalysisResult);

  // 接口反射、中间件、代理??

  const UIParser = GetUIParser(componentElement.component.type);

  // 解析组件特定的参数
  const compConfig = UIParser.parseCompProps(
    sysCompConfigParser(componentElement.component, parserContext)
  );

  // TODO: 异步组件

  return UIParser.RenderComp({
    pubPropsRes,
    actions,
    compId,
    componentConfig: compConfig
  });
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

interface EntityCompParam {
  props: { [str: string]: unknown };
  actions: ActionAnalysisResult;
  dataSource?: any;
  id: string;
  value?: string;
  text?: string;
}

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
const parseComponent2 = (compId: string, componentElement: ComponentElement, parserContext) => {
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
const ComponentCollectionParser2 = (
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
/**
 * 解析pubprops、 获取解析好的actions解析组件本身的props [用到value、changeValue]
 * 在真实渲染之前,props都会改变
 * 1. props 解析器处理一次
 * 2. props 渲染的时候处理一次
 */
