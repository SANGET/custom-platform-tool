/**
 * @description 渲染每个部件实际的结构的函数
 * TODO: 未完条件和状态, 控制结构
 */
import React from "react";

/**
 * 渲染list结构 「结构渲染」
 */
export const renderStructInfoListRenderer = (
  renderStructInfoList: any[],
  compRendererFCList
) => {
  const renderer: any[] = [];
  const structLength = renderStructInfoList.length;
  for (let i = 0; i < structLength; i++) {
    renderer.push(renderStructInfoRenderer(renderStructInfoList[i], compRendererFCList));
  }
  return renderer;
};

/**
 * 渲染单个结构 「结构渲染」
 */
const renderStructInfoRenderer = (
  renderStructInfo,
  compRendererFCList
) => {
  const { mark, childrenStructInfo } = renderStructInfo;
  const Comp = compRendererFCList[mark];

  const childrens = childrenStructInfo?.length
    ? renderStructInfoListRenderer(childrenStructInfo, compRendererFCList) : undefined;

  return ({ extralProps }) => {
    const actualChild = childrens?.map((Ch, i) => <Ch extralProps={extralProps} key={mark + i}/>);
    return (<Comp extralProps={extralProps} key={mark} children={actualChild} />);
  };
};
