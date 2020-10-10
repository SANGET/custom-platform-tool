import React, {
  useEffect, useMemo, useState, useContext
} from "react";
import { RenderCompInfoItem } from "./types/renderStruct";
import { DefaultCtx } from "../../IUBDSLRuntimeContainer";
import { AllUI } from "../UI-factory/types";

/**
 * 渲染前锁定阶段
 * 锁定应该是parsecontext
 *  */
const getCompRenderer = (
  getWidget: (compTag: AllUI) => React.FC<any>
) => (
  // info: RenderCompInfoItem
  info: any
) => {
  const {
    compTag, mark, propsKeys, propsMap, dynamicProps, staticProps
  } = info;
  const Comp = getWidget(compTag);

  return ({ children, extralProps: actralExtralProps }) => {
    const { useDynamicPropHandle } = useContext(DefaultCtx);
    const actralDyamicProps = useDynamicPropHandle?.(dynamicProps) || {};

    // ! 全局透传的extralProps一改全改:: 谨慎
    // const actralExtralProps = useMemo(() => {
    //   return extralProps;
    // }, [extralProps]);
    const actralComp = useMemo(() => {
      console.log('compReRender: ', mark);
      return (
        <Comp
          {...staticProps}
          {...actralExtralProps}
          {...actralDyamicProps}
          children={children}
        />
      );
    }, [staticProps, actralExtralProps, actralDyamicProps]);

    return actralComp;
  };
};

const widgetRenderer = (rendeInfo: any[]) => {
  const RenderCompFn = React.memo<any>((extralProps) => {
    const RenderComponent = useMemo(() => {
      return rendeInfo.map((Comp, i) => <Comp key={i} {...extralProps}/>);
    }, [extralProps]);

    return RenderComponent;
  });

  return RenderCompFn;
};

export {
  getCompRenderer,
  widgetRenderer
};
