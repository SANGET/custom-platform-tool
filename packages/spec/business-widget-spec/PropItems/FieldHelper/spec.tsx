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
export const FieldHelperSpec: PropItemCompAccessSpec = {
  id: 'prop_field',

  label: '列',

  whichAttr: ['field'],

  useMeta: true,

  render({
    interDatasources,
    widgetEntityState,
    changeEntityState,
    changePageMeta,
    takeMeta,
    genMetaRefID,
  }) {
    const fieldMetaRedID = widgetEntityState.field || genMetaRefID('schema');
    const selectedField = takeMeta({
      metaAttr: 'schema',
      metaRefID: fieldMetaRedID
    }) as SelectedField;

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
                      changeEntityState({
                        attr: 'field',
                        value: fieldMetaRedID
                      });
                      changePageMeta({
                        data: val,
                        metaAttr: 'schema',
                        dataRefID: fieldMetaRedID
                      });
                      CloseModal(modalID);
                    }}
                  />
                </div>
              );
            }
          });
        }}
      >
        {selectedField ? takeBindColumnInfo(selectedField) : '点击绑定字段'}
      </div>
    );
  }
};
