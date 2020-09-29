import React from 'react';
import { Tooltip, Result } from 'antd';
import { SmileOutlined } from '@ant-design/icons';
import { basePickPropsCstr, basePropsMapCstr, assertPropsKey } from '../utils';
import { AllUI } from '../types';

/**
 * IUB-DSL组件描述上的A属性由真实组件的B属性实现
 */
export const errorPropsMapList = {
};
export const errorPropsKes = Object.keys(errorPropsMapList);

const pickBaseInputPropsKey = basePickPropsCstr(errorPropsKes);

const baseInpitPropsMap = basePropsMapCstr<any>(errorPropsMapList);

export const errorCompName = AllUI.Error;

const ErrorFactory = ({
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
    <Result
      style={{ padding: 10 }}
      icon={<SmileOutlined style={{ fontSize: 40 }} rotate={180} />}
      subTitle='哎呀组件找不到丫!'
    />
  );
};

export {
  ErrorFactory
};
