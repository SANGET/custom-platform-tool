import React from 'react';
import { Input, Selector } from '@infra/ui';

const selectTypes = {
  costomValue: '自定义',
  expression: '表达式',
  variable: '变量',
};

export const ValueHelper = ({
  fxHelper,
  value,
  onChange,
}) => {
  const [selectedItem, setSelectedItem] = React.useState('costomValue');
  let Comp;
  switch (selectedItem) {
    case 'costomValue':
      Comp = (
        <Input value={value} onChange={onChange} />
      );
      break;
    case 'expression':
      Comp = (
        <div className="px-4 py-2">点击设置表达式</div>
      );
      break;
    case 'variable':

      break;
  }

  return (
    <div className="value-helper">
      <div className="mb-2">
        <Selector
          needCancel={false}
          value={selectedItem}
          values={selectTypes}
          onChange={(val) => setSelectedItem(val)}
        />
      </div>
      <div>
        {Comp}
      </div>
    </div>
  );
};
