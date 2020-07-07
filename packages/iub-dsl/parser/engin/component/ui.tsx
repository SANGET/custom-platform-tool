import React, { Fragment } from "react";
import { Input, Button, Dropdown } from "@infra/ui-interface";
import { UserBehavior, ComponentType } from "@iub-dsl/core";
import * as Comps from '@iub-dsl/core/types/component/components';

type ActionAnalysisResult = {
  [action in UserBehavior]: (any) => unknown;
};
interface RenderUIParam {
  compId: string;
  componentConfig: ComponentType;
  pubPropsRes: any;
  actions: ActionAnalysisResult;
}
interface EntityCompParserRef {
  // (param: GetUIParam)
  renderComp(param: RenderUIParam): JSX.Element;
  parseCompProps(...args): any;
}

// UI隔离层

const FnWrap = (fn) => {
  return (...args) => {
    // console.log('包裹一层内部处理,处理成标准的输入');
    return fn(...args);
  };
};

const inputCompParser: EntityCompParserRef = {
  renderComp: ({
    compId, pubPropsRes, actions, componentConfig
  }) => {
    // 过滤组件支持的动作
    const canUseActions = Object.keys(actions).reduce((useActions: any, action) => {
      useActions[action] = FnWrap(actions[action]);
      // if (action === 'onChange') {
      //   useActions[action] = tramsformInputChange(useActions[action]);
      // }
      return useActions;
    }, {});

    return (<Fragment key={compId}>
      {componentConfig.label}: <input
        key={compId}
        defaultValue={typeof componentConfig.field === 'undefined' ? '' : componentConfig.field}
        {...pubPropsRes}
        {...canUseActions}
      />
    </Fragment>);
  },
  parseCompProps: (param) => {
    return param;
  }

};

const buttonCompParser: EntityCompParserRef = {
  renderComp: ({
    compId, pubPropsRes, actions, componentConfig
  }) => {
    const canUseActions = Object.keys(actions).reduce((useActions, action) => {
      // eslint-disable-next-line no-param-reassign
      useActions[action] = FnWrap(actions[action]);
      return useActions;
    }, {});

    return (<Button
      key={compId}
      {...pubPropsRes}
      {...canUseActions}
    >{componentConfig.text}</Button>);
  },
  parseCompProps: (param) => {
    return param;
  }
};

const selectorCompParser: EntityCompParserRef = {
  renderComp: () => {
    return (<select key="select" value="" onChange={(e) => {
      console.log(e.target.value);
    }}
    >
      <option key="test1" value="test1">测试数据1</option>
      <option key="test2" value="test2">测试数据2</option>
    </select>);
  },
  parseCompProps: (param) => {
    return param;
  }
};

const GetUIParser = (compType: string): EntityCompParserRef => {
  switch (compType) {
    case "Input":
      return inputCompParser;
    case "Button":
      return buttonCompParser;
    case "Selector":
      return selectorCompParser;
    default:
      return {
        renderComp: () => <div>组件获取异常</div>,
        parseCompProps: () => ({})
      };
  }
};

export default GetUIParser;
