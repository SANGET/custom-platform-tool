import React, { useMemo, useContext } from "react";
import { DefaultCtx } from "../../IUBDSLRuntimeContainer";
import { AllUI } from "../UI-factory/types";
import { RenderCompInfoItem } from "./types";

/**
 * 生成每个小组件的渲染器
 * @returns React.FC
 */
const genCompRenderFC = (
  getWidget: (compTag: AllUI) => React.FC<any>
) => (
  info: RenderCompInfoItem
) => {
  const {
    compTag, mark, propsKeys, propsMap, dynamicProps, staticProps
  } = info;
  const Comp = getWidget(compTag);

  return ({ children, extralProps: actualExtralProps }) => {
    // TODO: dynamicProps 有undefined情况
    const { useDynamicPropHandle, useFn, cachCtx } = useContext(DefaultCtx);
    const actualDynamicPros = useDynamicPropHandle?.(dynamicProps) || {};

    const eventProps = useFn?.(dynamicProps) || {};

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
          {...eventProps}
          children={children}
        />
      );
    }, [children, actualDynamicPros, staticProps, actualExtralProps, eventProps]);

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
