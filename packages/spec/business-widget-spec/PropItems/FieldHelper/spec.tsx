import React from 'react';
import { PropItemCompAccessSpec } from '@engine/visual-editor/data-structure';
import { CloseModal, ShowModal } from '@infra/ui';
import { FieldSelector, SelectedField } from './comp';

const takeBindColumnInfo = (selectedField: SelectedField) => {
  const { column, tableInfo } = selectedField;
  return `${tableInfo?.name}_${column?.name}`;
};

/**
 * 绑定数据列
 */
export const FieldHelperSpec: PropItemCompAccessSpec = () => ({
  id: 'prop_field',

  label: '列',

  whichAttr: ['field'],

  render({
    interDatasources,
    changeEntityState,
    widgetEntityState
  }) {
    // console.log(widgetEntityState);
    const selectedField = widgetEntityState.field as SelectedField;
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
                    interDatasources={interDatasources}
                    defaultSelected={selectedField}
                    onSubmit={(val) => {
                      console.log(val);
                      changeEntityState({
                        // field: val
                        attr: 'field',
                        value: val
                      });
                      // onChange([
                      //   { value: val, attr: 'exp' },
                      //   /** 需要将 value 清空 */
                      //   { attr: 'defValue', value: null }
                      // ]);
                      CloseModal(modalID);
                    }}
                  />
                </div>
              );
            }
          });
        }}
      >
        {selectedField.column ? takeBindColumnInfo(selectedField) : '点击绑定字段'}
      </div>
    );
  }
});
