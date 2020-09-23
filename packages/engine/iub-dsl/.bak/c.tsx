import React, {
  useContext, useState, useMemo, useEffect
} from 'react';
import { AllComponentType } from "@iub-dsl/types";
import { Form } from 'antd';
import { GetUI, HyFromItem } from "./getUI";
import TableFactory from './UI-factory/data-display/table';
import TableText from './UI-factory/data-display/table2';
import { HyInput, HyToolTip } from '../ui';

const C = React.createContext<any>({});
interface BaseConf<T = AllComponentType> {
  label: string; // *
  value: string; // *
  unit: string; // *

  /** 提示信息 */
  placeholder: string; // 显示在文本框背部
  /** 文字提示 */
  markTip: string; // 悬浮的文字提示

  /** 数据源相关 */
  compCode: string; // 控件编码
  compId: string;
  compType: T;
  schemasQuote: string;
  // dataType \ dataLength

}

const dynamicPropsCreatorFn = () => {

};

const withParser = () => {

};

const withInputParser = (dynamicPropsCreator, conf, option) => {
  return withParser();
};

// 分
const sud = (ctx, { key, value }) => {
  if (key === 'label') {
    ctx.formItem[key] = value;
  } else if (key === 'markTip') {
    ctx.markTip.tipContent = value;
  } else if (!['schemasQuote', 'compType', 'compId', 'compCode'].includes(key)) {
    if (key === 'unit') key = 'suffix';
    ctx.input[key] = value;
  }
};

// 内部结构, 如何影响外部结构
const makeRenderStruct = (keys: string[]) => {
  const renderStruct: any[] = [];
  // keys.includes('label');
  const newStruct = {
    compTag: 'formItem',
    children: []
  };
  renderStruct.push(newStruct);
  // eslint-disable-next-line no-multi-assign
  const sRender: any[] = newStruct.children = [];

  const newStruct2 = {
    compTag: 'markTip',
    children: []
  };
  sRender.push(newStruct2);
  // eslint-disable-next-line no-multi-assign
  const sRender2: any[] = newStruct2.children = [];

  const newStruct3 = {
    compTag: 'input',
    children: []
  };
  sRender2.push(newStruct3);
  return renderStruct;
};
let key = 0;
const renderFn = (compList, CompStruct, confCtx) => {
  return CompStruct.map((info) => {
    const Comp = compList[info.compTag];
    const props = confCtx[info.compTag];
    const Childrens = info.children.length ? renderFn(compList, info.children, confCtx) : undefined;
    // return <Comp key={++key} {...props} children={children} />;
    return (extralProps) => {
      const Ch = Childrens && Childrens.map((Children, i) => <Children key={i + key} {...extralProps}/>);
      return <Comp key={++key} {...props} {...extralProps} children={Ch} />;
    };
  });
};

/**
 * parser阶段
 * 1. 划分,更多细小颗粒度的组件/调度解析, 生成可以被影响的结构 「预备状态」
 * 2. 组装状态
 */
const inputParser = (conf) => {
  // 共享属性、似有属性
  const staticProps = ['label', 'placeholder', 'compCode', 'compId'];

  const dynamicProps = ['value', 'unit', 'markTip', 'schemasQuote'];

  const ctx = {
    formItem: {},
    markTip: {},
    input: {}
  };

  // 调度属性,子解析
  const confKeys = Object.keys(conf);
  confKeys.forEach((key) => {
    sud(ctx, { key, value: conf[key] });
  });
  console.log(ctx);

  // 动态可以被state影响的渲染结构
  const renderStruct = makeRenderStruct(confKeys);

  return function renderComp(RenderCompList) {
    const Fn = (props) => {
      console.log(1);

      // eslint-disable-next-line react-hooks/rules-of-hooks
      const actualChildProps = useMemo(() => {
        return {};
      }, [props]);
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const Component = useMemo(() => {
        // return renderFn(RenderCompList, renderStruct, ctx);
        const Comps = renderFn(RenderCompList, renderStruct, ctx);
        console.log(Comps);
        return Comps.map((Comp, i) => <Comp key={i} {...props}/>);
      }, [renderStruct, actualChildProps]);

      return Component;
    };

    return Fn;
  };
};

export const componentParser = () => {
  const conf: BaseConf<AllComponentType.Input> = {
    label: '位置名称',
    value: '',
    unit: '位',
    placeholder: '请输入位置名称',
    markTip: '详细真实的位置名称',
    tipContent: '详细真实的位置名称',
    compCode: 'compId1',
    compId: 'compId1',
    compType: AllComponentType.Input,
    schemasQuote: '$(schemas).dId1'
  };
  const renderCompList = {
    formItem: Form.Item,
    markTip: HyToolTip,
    input: HyInput
  };
  const Component = inputParser(conf)(renderCompList);
  console.log(Component);

  return Component;
};
