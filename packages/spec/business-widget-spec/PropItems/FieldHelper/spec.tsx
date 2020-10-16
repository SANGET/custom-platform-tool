import React from 'react';
import { PropItemCompAccessSpec } from '@engine/visual-editor/data-structure';
import { CloseModal, ShowModal } from '@infra/ui';
import { FieldSelector } from './FieldSelector';

export const FieldHelperSpec: PropItemCompAccessSpec = () => ({
  id: 'prop_field',

  label: '列',

  whichAttr: ['field'],

  render({
    interDatasources
  }) {
    return (
      <div
        className="px-4 py-2 border"
        onClick={(e) => {
          const modalID = ShowModal({
            title: '设置表达式',
            width: 900,
            children: () => {
              return (
                <div>
                  <FieldSelector
                    interDatasources={exp}
                    onSubmit={(val) => {
                      onChange([
                        { value: val, attr: 'exp' },
                        /** 需要将 value 清空 */
                        { attr: 'defValue', value: null }
                      ]);
                      CloseModal(modalID);
                    }}
                  />
                </div>
              );
            }
          });
        }}
      >
        绑定字段
      </div>
    );
  }
});
