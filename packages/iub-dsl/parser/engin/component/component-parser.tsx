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
