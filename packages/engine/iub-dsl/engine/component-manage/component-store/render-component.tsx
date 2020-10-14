import React, {
  useEffect, useMemo, useState, useContext
} from "react";
import { RenderCompInfoItem } from "./types/renderStruct";
import { DefaultCtx } from "../../IUBDSLRuntimeContainer";
import { AllUI } from "../UI-factory/types";

let casee;

/**
 * 生成每个小组件的渲染器
 * @returns React.FC
 */
const genCompRenderFC = (
  getWidget: (compTag: AllUI) => React.FC<any>
) => (
  // info: RenderCompInfoItem
  info: any
) => {
  const {
    compTag, mark, propsKeys, propsMap, dynamicProps, staticProps
  } = info;
  const Comp = getWidget(compTag);

  // ! 要控制组件是否更新的最好的办法就是生成组件的deep「deep包含有事件的组件」「难」
  return ({ children, extralProps: actualExtralProps }) => {
    const { useDynamicPropHandle } = useContext(DefaultCtx);
    const actualDynamicPros = useDynamicPropHandle?.(dynamicProps) || {};

    // ! 全局透传的extralProps一改全改:: 谨慎
    // const actualExtralProps = useMemo(() => {
    //   return extralProps;
    // }, [extralProps]);

    const renderedComp = useMemo(() => {
      // console.count(mark);
      return (
        <Comp
          key={mark}
          {...staticProps}
          {...actualDynamicPros}
          {...actualExtralProps}
          children={children}
        />
      );
    }, [children, actualDynamicPros, staticProps, actualExtralProps]);

    return renderedComp;
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
  genCompRenderFC,
  widgetRenderer
};
