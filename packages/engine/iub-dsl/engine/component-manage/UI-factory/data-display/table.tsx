import React from 'react';
import { Table as NormalTable } from 'antd';
import { SmileOutlined } from '@ant-design/icons';
import { basePickPropsCstr, basePropsMapCstr, assertPropsKey } from '../utils';
import { AllUI } from '../types';

/**
 * IUB-DSL组件描述上的A属性由真实组件的B属性实现
 */
export const normalTablePropsMapList = {
  columns: 'columns',
  dataSource: 'dataSource'
};
export const normalTablePropsKes = Object.keys(normalTablePropsMapList);

const pickBaseInputPropsKey = basePickPropsCstr(normalTablePropsKes);

const normalTablePropsMap = basePropsMapCstr<any>(normalTablePropsMapList);

export const normalTableCompName = AllUI.NormalTable;

const TableFactory = ({
  id, children, ...ohterProps
}) => {
  /** 下面三步确保props全部正确可用 */
  const allPropsKey = Object.keys(ohterProps);
  const canUsePropsKey = pickBaseInputPropsKey(allPropsKey);
  const actualProps = normalTablePropsMap(ohterProps, canUsePropsKey);
  console.log(actualProps);

  /**
   * 必要的断言
   */
  assertPropsKey(id, allPropsKey, canUsePropsKey);
  return (
    <NormalTable
      rowKey='id'
      {...actualProps}
    />
  );
};

export {
  TableFactory
};
