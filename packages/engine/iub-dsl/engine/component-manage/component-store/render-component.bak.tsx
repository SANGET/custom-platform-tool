import React, { useEffect, useMemo, useState } from "react";
import { ActualRenderInfo } from "./types/renderStruct";
import { AllUI } from "../UI-factory/types";
import { useCompProps } from "../tempfn";

/**
 * 渲染list结构的组件
 * @param actualRenderInfo
 * @param context
 */
const actualRenderInfoListRenderer = (
  actualRenderInfo: ActualRenderInfo[],
  // context: {getWidget},
  context: any,
) => {
  const renderer: any[] = [];
  const structLength = actualRenderInfo.length;
  for (let i = 0; i < structLength; i++) {
    renderer.push(actualRenderInfoRenderer(actualRenderInfo[i], context, { index: i }));
  }
  return renderer;
};

/**
 * 渲染单个组件
 * @param actualRenderInfo 单个组件信息
 * @param context 上下文
 * @param options 渲染选项
 */
const actualRenderInfoRenderer = (
  actualRenderInfo: ActualRenderInfo,
  { getWidget, ...otherCtx }: any,
  options?: { index: number }
) => {
  const {
    compTag, mark, renderStruct, propsKeys, propsMap
  } = actualRenderInfo;
  const Comp = getWidget(compTag);

  /** 结构不变, children不变 */
  const childrens = renderStruct?.length
    ? actualRenderInfoListRenderer(renderStruct, { getWidget, ...otherCtx }) : undefined;

  // 区分静态,和动态很有必要, propsMap无太大必要
  // console.log(propsKeys, propsMap);

  return (extralProps) => {
    // useInputCompProps(propsMap);
    // TODO: 问题在这个Props中
    let compProps = {};
    switch (compTag) {
      case AllUI.NormalInput:
        // compProps = useInputCompProps(propsMap)?.compProps || {};
        compProps = useFormInputPops(propsMap, otherCtx)?.compProps || {};
        break;
      case AllUI.FormItem:
        compProps = useCompProps(propsMap, otherCtx)?.compProps || {};
        break;
      case AllUI.WidgetError:
      default:
        compProps = useCompProps(propsMap, otherCtx)?.compProps || {};
        break;
    }

    const actualExtralProps = useMemo(() => {
      return extralProps;
    }, [extralProps]);

    const actualChild = childrens?.map((Ch, i) => <Ch key={mark + i} {...actualExtralProps}/>);
    const RenderComp = useMemo(() => {
      return <Comp
        {...compProps} {...actualExtralProps}
        // key、id、children 都应该在后面
        key={mark} id={mark}
        children={actualChild}
      />;
    }, [
      compProps,
      actualExtralProps // 监测额外的全局属性
    ]);
    return RenderComp;
  };
};

/**
 * 处理输入框属性的hooks「此函数临时放在此处」
 * @param propsMap 传入组件的属性的处理
 */
const useFormInputPops = (propsMap, otherCtx) => {
  const { compProps, setCompProps } = useCompProps(propsMap, otherCtx);

  /** 测试内容 */
  // useEffect(() => {
  //   let timer;
  //   if (Math.random() > 0.3) {
  //     timer = setTimeout(() => {
  //       setCompProps({ ...compProps, value: '后端获取的内容~~~', placeholder: '异步内容!!~~~~!!' });
  //     }, 5000);
  //   }
  //   return () => {
  //     clearTimeout(timer);
  //   };
  // }, []);

  return { compProps, setCompProps };
};

/**
 * 渲染前锁定阶段
 * 锁定应该是parsecontext
 *  */
const RenderComp = (getWidget, otherCtx) => {
  console.log(otherCtx);

  return (actualRenderInfo: ActualRenderInfo[]) => {
    /** 渲染前锁定阶段 -- End */
    const RenderCompFn = React.memo<any>((extralProps) => {
      /** 渲染 */
      // useEffect(() => {
      // }, []);
      /** 放在哪才是最好的, 才可以控制不会一直渲染 */
      const RenderComponentList = useMemo(() => {
        const Comps = actualRenderInfoListRenderer(
          actualRenderInfo,
          { getWidget, ...otherCtx },
        );
        return Comps;
      }, [actualRenderInfo, getWidget]);
      const RenderComponent = useMemo(() => {
        return RenderComponentList.map((Comp, i) => <Comp key={i} {...extralProps}/>);
      }, [extralProps]);

      return RenderComponent;
    });

    return RenderCompFn;
  };
};

export {
  RenderComp
};
