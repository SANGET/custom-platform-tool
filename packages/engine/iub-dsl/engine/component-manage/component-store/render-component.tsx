import React, { useEffect, useMemo } from "react";
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
      [propInfo?.key]: propInfo?.val
    }), {});
    const childrens = childrenRenderStruct?.length ? baseRenderCompStruct({
      renderStruct: childrenRenderStruct,
      compPropsList,
      RenderCompList,
      originConf
    }) : undefined;
    // console.log('renderStructReMake');

    /** 1. 传入扩展的props 2. 渲染所有子级 */
    return (extralProps) => {
      const ctxx = {};

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
      }, [compProps]);
      return RenderComp;
    };
  });
};

/** 渲染前锁定阶段 */
const RenderComp = (RenderCompList) => {
  return ({
    renderStruct,
    compPropsList,
    originConf
  }): React.FC<any> => {
    /** 渲染前锁定阶段 -- End */
    const RenderCompFn = React.memo((extralProps) => {
      /** 渲染 */
      useEffect(() => {
        console.log(1111);
      }, []);
      /** 放在哪才是最好的, 才可以控制不会一直渲染 */
      const RenderComponentList = useMemo(() => {
        console.log(1);
        const Comps = baseRenderCompStruct({
          renderStruct,
          compPropsList,
          RenderCompList,
          originConf
        });
        return Comps;
      }, [renderStruct, compPropsList, RenderCompList]);
      const RenderComponent = useMemo(() => {
        console.log(2);
        return RenderComponentList.map((Comp, i) => <Comp key={i} {...extralProps}/>);
      }, [extralProps]);

      return RenderComponent;
      // return RenderComponentList;
    });

    return RenderCompFn;
  };
};

export {
  RenderComp
};
