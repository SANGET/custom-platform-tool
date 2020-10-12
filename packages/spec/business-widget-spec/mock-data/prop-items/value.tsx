import React from 'react';
import { PropItemConfig } from "@engine/visual-editor/data-structure";

const PropValue: PropItemConfig = (entity) => {
  return {
    id: 'prop_real_value',
    label: '值',
    whichAttr: 'defValue',
    propItemCompRender: ({ InterComp, fxHelper }) => {
      const { Input, Selector } = InterComp;
      return (
        <div className="value-helper">
          {/* <div>
            <Input />
          </div> */}
          <div>
            <Selector
              values={{
                defValue: '默认值',
                expression: '表达式',
                variable: '变量',
              }}
            />
          </div>
        </div>
      );
    }
    // propItemCompDef: {
    //   type: 'NormalInput',
    // }
  };
};

export default PropValue;
