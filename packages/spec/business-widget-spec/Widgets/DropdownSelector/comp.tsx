/**
 * 在 form 表单中有标题的 Input 组件
 */
import React from 'react';
import { Selector } from '@infra/ui';

export const DropdownSelectorComp = ({
  title,
  value,
}) => {
  return (
    <div>
      {title}
      <Selector
        values={{
          1: '123',
          2: '321',
          3: '456',
        }}
      />
    </div>
  );
};
