import React from 'react';
import { Tooltip } from 'antd';
// import { TooltipPropsWithOverlay, TooltipPropsWithTitle } from 'antd/lib/tooltip';
import { basePickPropsCstr, basePropsMapCstr, assertPropsKey } from '../utils';
import { AllUI } from '../types';

/**
 * IUB-DSL组件描述上的A属性由真实组件的B属性实现
 */
export const toolTipPropsMapList = {
  tipContent: 'title'
};
export const toolTipPropsKes = Object.keys(toolTipPropsMapList);

const pickBaseInputPropsKey = basePickPropsCstr(toolTipPropsKes);

const baseInpitPropsMap = basePropsMapCstr<any>(toolTipPropsMapList);

export const tootipCompName = AllUI.Tootip;

// ToolTip的类型
// React.ForwardRefExoticComponent<
// (TooltipPropsWithOverlay & React.RefAttributes<unknown>) |
// (TooltipPropsWithTitle & React.RefAttributes<unknown>)
// >;
/** TODO: 类型后续完善. 必传的,而且要转换的? */
const TootipFactory = ({
  id, children, tipContent, ...ohterProps
}) => {
  /** 下面三步确保props全部正确可用 */
  const allPropsKey = Object.keys(ohterProps);
  const canUsePropsKey = pickBaseInputPropsKey(allPropsKey);
  const actualProps = baseInpitPropsMap(ohterProps, canUsePropsKey);
  /**
   * 必要的断言
   */
  assertPropsKey(id, allPropsKey, canUsePropsKey);
  return (
    <Tooltip
      title={tipContent}
      key={id}
      {...actualProps}
    >{children}</Tooltip>
  );
};

export {
  TootipFactory
};
