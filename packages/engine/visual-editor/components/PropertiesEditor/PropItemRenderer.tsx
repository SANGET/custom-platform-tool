import React from 'react';
import { getPropItem } from '../../spec/registerComp';
import { PropItemRendererProps } from './types';

/**
 * 属性项渲染器
 * 根据属性项的 type 选择对应的组件进行渲染
 */
export const PropItemRenderer: React.FC<PropItemRendererProps> = ({
  propItemConfig,
  propItemValue,
  propID,
  onChange,
}) => {
  const {
    label, propItemCompDef, type
  } = propItemConfig;
  const { type: componentType, defaultValue, ...propsForComponent } = propItemCompDef;

  /** 将 ID 写入 propItemConfig */
  // propItemConfig.id = propID;
  let Com;
  const { comp } = getPropItem(componentType);
  switch (componentType) {
    case 'Input':
      const Input = comp;
      Com = (
        <Input
          {...propsForComponent}
          value={propItemValue || ''}
          onChange={(value) => {
            // console.log(e.target.value);
            onChange(value, propItemConfig);
          }}
        />
      );
      break;
    case 'Selector':
      const Selector = comp;
      Com = (
        <Selector
          {...propsForComponent}
          value={propItemValue || ''}
          onChange={(value) => {
            // console.log(e.target.value);
            onChange(value, propItemConfig);
          }}
        />
      );
      break;
    default:
      break;
  }
  return (
    <div className="mb10">
      <div className="label mb5">{label}</div>
      <div className="content">{Com}</div>
    </div>
  );
};
