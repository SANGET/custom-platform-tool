import React from 'react';
import { Button } from 'antd';
import { ButtonProps } from 'antd/lib/button';

import { assertPropsKey, basePickPropsCstr, basePropsMapCstr } from '../utils';
import { AllUI } from '../types';
// TODO
import { OmitExtral } from '../../../types';

/**
 * IUB-DSL组件描述上的A属性由真实组件的B属性实现
 */
export const normalButtonPropsMapList = {
  text: 'text',
  actions: 'actions',
  // TODO 解析的时候的props和传入的不对应
  // onClick: 'onClick'
};
export const normalButtonPropsKeys = Object.keys(normalButtonPropsMapList);

const pickNormalButtonPropsKey = basePickPropsCstr(normalButtonPropsKeys);

const normalButtonPropsMap = basePropsMapCstr<ButtonProps>(normalButtonPropsMapList);
export const normalButtonCompName = AllUI.NormalButton;

interface NormalButtonPropsExtral {
  key: string;
  text: string;
}

export type NormalButtonProps = OmitExtral<ButtonProps, NormalButtonPropsExtral>

/**
 * 按钮组件的工厂函数,
 * 根据不同的props生产不同的Button
 */
export const NormalButtonFactory: React.FC<NormalButtonProps> = React.memo(
  ({
    id, text, onClick, ...otherProps
  }) => {
    /** 下面三步确保props全部正确可用 */
    const allPropsKey = Object.keys(otherProps);
    const canUsePropsKey = pickNormalButtonPropsKey(allPropsKey);
    const actualProps: ButtonProps = normalButtonPropsMap(otherProps, canUsePropsKey);
    /** 必要的断言 */
    assertPropsKey(id || 'NormalButtonFactory', allPropsKey, canUsePropsKey);

    return (
      <Button
        type="primary"
        size='middle'
        onClick={(e) => onClick?.(e)}
        {...actualProps}
      >
        {text}
      </Button>

    );
  }
);
