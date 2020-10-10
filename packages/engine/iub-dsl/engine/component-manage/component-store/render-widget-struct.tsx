/**
 * @description 渲染每个部件实际的结构的函数
 * TODO: 未完条件和状态, 控制结构
 */
import React from "react";

/**
 * 渲染list结构 「结构渲染」
 */
export const renderInfoListRenderer = (
  actualRenderInfo: any[],
  compList
) => {
  const renderer: any[] = [];
  const structLength = actualRenderInfo.length;
  for (let i = 0; i < structLength; i++) {
    renderer.push(renderInfoRenderer(actualRenderInfo[i], compList));
  }
  return renderer;
};

/**
 * 渲染单个结构 「结构渲染」
 */
const renderInfoRenderer = (
  info,
  compList
) => {
  const { mark, childrenStructInfo } = info;
  const Comp = compList[mark];

  const childrens = childrenStructInfo?.length
    ? renderInfoListRenderer(childrenStructInfo, compList) : undefined;

  return ({ extralProps }) => {
    const actualChild = childrens?.map((Ch, i) => <Ch extralProps={extralProps} key={mark + i}/>);
    return (<Comp extralProps={extralProps} key={mark} children={actualChild} />);
  };
};
