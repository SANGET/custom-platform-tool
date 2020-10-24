import React from 'react';
import { PropItemCompAccessSpec } from '@engine/visual-editor/data-structure';
import { CloseModal, PopModelSelector, ShowModal } from '@infra/ui';
import { FieldSelector, SelectedField } from './comp';

const takeBindColumnInfo = (selectedField: SelectedField) => {
  const { column, tableInfo } = selectedField;
  return `${tableInfo?.name}_${column?.name}`;
};

/** 属性项编辑的组件属性 */
const whichAttr = 'field';

/**
 * 绑定数据列
 */
export const FieldHelperSpec: PropItemCompAccessSpec = {
  id: 'prop_field',

  label: '列',

  whichAttr,

  useMeta: {
    schema: true
  },

  render({
    businessPayload,
    editingWidgetState,
    changeEntityState,
    changeMetadata,
    takeMeta,
    genMetaRefID,
  }) {
    const { interDatasources } = businessPayload;
    const metaRefID = editingWidgetState[whichAttr] || genMetaRefID('schema');
    const selectedField = takeMeta({
      metaAttr: 'schema',
      metaRefID
    }) as SelectedField;

    return (
      <PopModelSelector
        modelSetting={{
          title: '设置表达式',
          width: 900,
          children: ({ close }) => {
            return (
              <div>
                <FieldSelector
                  interDatasources={interDatasources}
                  defaultSelected={selectedField}
                  onSubmit={(val) => {
                    changeEntityState({
                      attr: whichAttr,
                      value: metaRefID
                    });
                    changeMetadata({
                      data: val,
                      metaAttr: 'schema',
                      dataRefID: metaRefID
                    });
                    close();
                  }}
                />
              </div>
            );
          }
        }}
      >
        {selectedField ? takeBindColumnInfo(selectedField) : '点击绑定字段'}
      </PopModelSelector>
    );
  }
};
