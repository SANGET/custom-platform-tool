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
  context: {getWidget},
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
  { getWidget }: {getWidget},
  options?: { index: number }
) => {
  return (extralProps) => {
    const {
      compTag, mark, renderStruct, propsKeys, propsMap
    } = actualRenderInfo;
    const Comp = getWidget(compTag);
    // useInputCompProps(propsMap);
    let compProps;
    switch (compTag) {
      case AllUI.BaseInput:
        // compProps = useInputCompProps(propsMap)?.compProps || {};
        compProps = useFormInputPops(propsMap)?.compProps || {};
        break;
      case AllUI.FormItem:
        compProps = useCompProps(propsMap)?.compProps || {};
        break;
      case AllUI.Error:
      default:
        compProps = useCompProps(propsMap)?.compProps || {};
        break;
    }

    const childrens = renderStruct?.length
      ? actualRenderInfoListRenderer(renderStruct, { getWidget }) : undefined;

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
const useFormInputPops = (propsMap) => {
  const { compProps, setCompProps } = useCompProps(propsMap);

  /** 测试内容 */
  useEffect(() => {
    let timer;
    if (Math.random() > 0.3) {
      timer = setTimeout(() => {
        setCompProps({ ...compProps, value: '后端获取的内容~~~', placeholder: '异步内容!!~~~~!!' });
      }, 5000);
    }
    return () => {
      clearTimeout(timer);
    };
  }, []);

  return { compProps, setCompProps };
};

/**
 * 渲染前锁定阶段
 * 锁定应该是parsecontext
 *  */
const RenderComp = (getWidget) => {
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
          { getWidget },
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
