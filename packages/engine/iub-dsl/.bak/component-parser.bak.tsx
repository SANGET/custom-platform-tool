import React, {
  useContext, useState, useMemo, useEffect
} from 'react';
import { AllComponentType } from "@iub-dsl/types";
import { cloneDeep } from 'lodash';
import { HyInput, HyToolTip } from '../ui';
import componentConf from './mock';

/**
 * 存在问题
 * 1. useMemo, 没有起作用每次都是新的实例: 已解决, 最外层到最内层都要包裹
 * 2. ComponentList应该是渲染时绑定/还是解析时绑定
 * 3. 递归生成结构问题
 *  1. 根据配置文件和最大结构生成可以渲染的配置结构
 *  2. 全局配置以及其他配置添加等问题
 * 4. 同一个结构递归渲染
 *  1. 更新问题,不能局部更新: 已解决, 最外层到最内层都要包裹
 *  2. 暴露接口问题 {最重要的问题}
 *
 * 新问题
 * 1. props, 是全局还是局部, 如果全局需要划分模块不
 *
 * 链路
 * 1. 调度对应的组件解析器
 * 2. 高阶函数组合配置传入
 * 3. 解析组件
 *  1. 获取所有有效的propsKey
 *  2. 分组每个组件使用的props
 *  3. 根据完整结构, 生成可以渲染的结构
 * 4. 根据渲染的结构, 进行渲染组件 「递归」
 *  1. 渲染结构的时候, 可以根据状态管理, 控制结构的渲染
 *  2. 可以传入外部额外的props 「如: auth」
 */

const globalInputConf = {};
const globalDefaultOptions = {};

const formItemProps = ['label'];
const markTipProps = ['markTip', 'tipContent'];
const inputProps = ['unit', 'placeholder', 'suffix'];

const inputCompAllCanUseProps = [
  {
    compTag: 'formItem',
    canUseProps: formItemProps,
  },
  {
    compTag: 'markTip',
    canUseProps: markTipProps,
  },
  {
    compTag: 'input',
    canUseProps: inputProps,
  },
];

/** 这份结构是和antd相关的, props是和业务相关的 */
/** props应该独立, 结构不应该与其耦合 */
const inputCompCanRenderFullStruct = [
  {
    compTag: 'formItem',
    canSkip: true,
    /** 某个特定的结构, 所需要的props特定 */
    canUseProps: formItemProps,
    canUsegroupProps: [],
    children: [
      {
        compTag: 'markTip',
        canUseProps: markTipProps,
        canSkip: true,
        children: [
          {
            compTag: 'input',
            canUseProps: inputProps,
            canSkip: false,
          }
        ]
      }
    ]
  }
];
/** 外部影响的欠缺考虑 */
// !! TODO 递归问题
/**
 * 生成渲染配置
 * 1. 渲染的结构
 * 2. 渲染用到的props
 * @params 不需要参与递归改变的参数
 */
const genInputRenderConfFn = (allConfKey: string[], originConf) => {
  const useCompPropsList = {};
  const originRes: any = {
    useCompPropsList,
    renderStruct: []
  };
  // TODO: 这个也可能参与递归
  const conf = cloneDeep(originConf);
  /**
   * 递归作用
   * 1. 标记平级组件和props
   * 2. 真实可渲染的配置结构
   * @param mark 基础标识
   * @param struct 渲染的结构
   * @param result
   */
  const genInputRenderConf = (
    baseMark,
    struct: any = inputCompCanRenderFullStruct,
    renderStruct = originRes.renderStruct
  ) => {
    struct.forEach((structItem, index) => {
      try {
        const {
          canUseProps, compTag, children, canSkip
        } = structItem;
        const mark = `${baseMark}-${compTag}-${index}`;
        const useProps: {
          key: string,
          value: any
        }[] = [];
        canUseProps.forEach((propKey) => {
          if (allConfKey.includes(propKey)) {
            useProps.push({
              key: propKey,
              value: conf[propKey]
            });
          }
        });
        if (useProps.length) {
          const newRenderStruct = [];
          renderStruct.push({
            compTag,
            mark,
            renderStruct: newRenderStruct
          });
          useCompPropsList[mark] = useProps;
          children?.length && genInputRenderConf(mark, children, newRenderStruct);
          return;
        }
        if (canSkip && children?.length) {
          genInputRenderConf(mark, children, renderStruct);
        }
      } catch (e) {
        console.log(e);
      }
    });
    return originRes;
  };
  return genInputRenderConf;
};

const getInputCompAllConfKeys = (conf) => Object.keys(conf);

// !! TODO 传值与暴露的问题
const baseRenderCompStruct = ({
  renderStruct,
  compPropsList,
  RenderCompList,
  originConf
}) => {
  /** 此处的结构可以根据条件改变 */
  return renderStruct.map((structInfo) => {
    const { compTag, mark, renderStruct: childrenRenderStruct } = structInfo;
    const Comp = RenderCompList[compTag];
    /** 此处的props是key-value形式 */
    const compProps = compPropsList[mark].reduce((res, propInfo) => ({
      ...res,
      [propInfo?.key]: propInfo?.value
    }), {});
    const childrens = childrenRenderStruct?.length ? baseRenderCompStruct({
      renderStruct: childrenRenderStruct,
      compPropsList,
      RenderCompList,
      originConf
    }) : undefined;
    // console.log('renderStructReMake');

    return (extralProps) => {
      console.log(mark);
      const actualChild = childrens?.map((Ch, i) => <Ch key={mark + i} {...extralProps}/>);
      const RenderComp = useMemo(() => {
        return <Comp key={mark} {...compProps} {...extralProps} children={actualChild} />;
      }, [compProps]);
      return RenderComp;
    };
  });
};

/**
 * 应该根据最大渲染结构扫描conf
 * 并且使用的props与其结构有引用关系
 */
let temm;
const defaultInputParser = (id, conf, options) => {
  const allConfKeys = getInputCompAllConfKeys(conf);

  const genConf = genInputRenderConfFn(allConfKeys, conf);

  const { renderStruct, useCompPropsList } = genConf(id);
  console.log(id, conf, options);

  console.log(renderStruct, useCompPropsList);

  const RenderComp = (RenderCompList) => {
    const RenderCompFn = React.memo((extralProps) => {
      useEffect(() => {
        console.log(1111);
      }, []);
      /** 放在哪才是最好的, 才可以控制不会一直渲染 */
      const RenderComponentList = useMemo(() => {
        console.log(1);
        const Comps = baseRenderCompStruct({
          renderStruct,
          compPropsList: useCompPropsList,
          RenderCompList,
          originConf: conf
        });
        return Comps;
      }, [renderStruct, useCompPropsList, RenderCompList, conf]);
      const RenderComponent = useMemo(() => {
        console.log(2);
        return RenderComponentList.map((Comp, i) => <Comp key={i} {...extralProps}/>);
      }, [extralProps]);

      return RenderComponent;
      // return RenderComponentList;
    });

    return RenderCompFn;
  };
  return RenderComp;
};

const inputCompParser = (id, conf, options = {}) => {
  return defaultInputParser(id, {
    ...globalInputConf,
    ...conf
  }, {
    ...globalDefaultOptions,
    ...options
  });
};

const compParseScheduler = (id, confItem, options) => {
  const { compType } = confItem;
  switch (compType) {
    case AllComponentType.Input:
      return inputCompParser(id, confItem, options);
    default:
      return () => {};
  }
};

const componentParser = (conf = componentConf, options?) => {
  const allCompId = Object.keys(conf);

  const compParseRes: any = {};
  let confItem;
  allCompId.forEach((id) => {
    confItem = conf[id];
    compParseRes[id] = compParseScheduler(id, confItem, options);
  });
  return compParseRes;
};

export default componentParser;
