import React from 'react';
import { Form } from 'antd';
import { FormItemProps } from 'antd/lib/form';
import { AllUI } from '../../types';
import { basePickPropsCstr, basePropsMapCstr, assertPropsKey } from '../../utils';

/**
 * IUB-DSL组件描述上的A属性由真实组件的B属性实现
 */
export const fromItemMapList = {
  label: 'label',
  labelColor: 'labelColor'
};
export const fromItemKes = Object.keys(fromItemMapList);

const pickFromItemPropsKey = basePickPropsCstr(fromItemKes);

const baseFromItemPropsMap = basePropsMapCstr<FormItemProps>(fromItemMapList);

const fromItemCompName = AllUI.BaseInput;

interface ExtralFromItemProps {
  id: string;
  labelColor: string
}

/**
 * 表单Item的工厂函数
 * @param param0 FormItemProps
 */
const FormItemFactory: React.FC<FormItemProps & ExtralFromItemProps> = (
  {
    id, children, label, labelColor, ...ohterProps
  }
) => {
  /** 下面三步确保props全部正确可用 */
  const allPropsKey = Object.keys(ohterProps);
  const canUsePropsKey = pickFromItemPropsKey(allPropsKey);
  const actualProps: FormItemProps = baseFromItemPropsMap(ohterProps, canUsePropsKey);
  /** 必要的断言 */
  assertPropsKey(id, allPropsKey, canUsePropsKey);
  return (
    <Form.Item
      key={id}
      label={<span style={{ color: labelColor || '#000' }}>{label}</span>} // TODO: 新组件
      {...actualProps}
    >
      {children}
    </Form.Item>
  );
};

export { FormItemFactory, fromItemCompName };
