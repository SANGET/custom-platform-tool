import React from 'react';
import { Input, Selector, Button } from '@infra/ui';
import { EditorPropertyItem } from '../../types';

interface PropItemRendererProps {
  propItemConfig
  componentState
  propID: string
  onChange: (value: any, propItem: EditorPropertyItem) => void
}

/**
 * 属性项渲染器
 * 根据属性项的 type 选择对应的组件进行渲染
 */
export const PropItemRenderer: React.FC<PropItemRendererProps> = ({
  propItemConfig,
  componentState,
  propID,
  onChange,
}) => {
  const {
    label, component, type
  } = propItemConfig;
  const { type: componentType, defaultValue, ...propsForComponent } = component;

  /** 将 ID 写入 propItemConfig */
  // propItemConfig.id = propID;
  let Com;
  switch (componentType) {
    case 'Input':
      Com = (
        <Input
          {...propsForComponent}
          value={componentState || ''}
          onChange={(value) => {
            // console.log(e.target.value);
            onChange(value, propItemConfig);
          }}
        />
      );
      break;
    case 'Selector':
      Com = (
        <Selector
          {...propsForComponent}
          value={componentState || ''}
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
