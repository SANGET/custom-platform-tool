/**
 * PropEditor
 */
import React, { useState, useEffect } from 'react';
import { Input, Button } from '@infra/ui-interface';
import { propertiesItemCollection as PropertiesItemCollection } from '../../mock-data';
import { mergeDeep } from '../CanvasStage/utils/deepmerge';
import { EditorComponentEntity, EditorEntityProperties } from '../../types';
import useUpdateState from './useUpdateState';
import useFormState from './useFormState';
import { SaveEntityPropsStore } from '../../app/useEntityPropsStore';

const extractPropConfig = (propConfig, entity) => {
  if (typeof propConfig === 'function') return propConfig(mergeDeep({}, entity));
  return propConfig;
};

const ComponentParser = ({
  entity,
  propConfig,
  componentState,
  onChange,
}) => {
  // console.log(propConfig);
  const propConfigRes = extractPropConfig(propConfig, entity);
  const { label, component, type } = propConfigRes;
  let Com;
  switch (component.type) {
    case 'Input':
      Com = (
        <Input
          value={componentState || ''}
          onChange={(value) => {
            // console.log(e.target.value);
            onChange(value, type);
          }}
        />
      );
      break;
    default:
      break;
  }
  return (
    <div className="mb10">
      <span className="label mr5">{label}</span>
      <span className="content">{Com}</span>
    </div>
  );
};

export interface PropertiesEditorProps {
  /** 选中的 entity */
  selectedEntity: EditorComponentEntity
  /** 属性编辑器的配置，通过该配置生成有层级结构的属性编辑面板 */
  editorConfig?: {}
  /** */
  propertiesItemCollection?: {}
  /** 保存属性的回调 */
  saveEntityPropsStore: SaveEntityPropsStore
  /** 默认的表单数据state */
  defaultFormState?: EditorEntityProperties
}

const PropertiesEditor = ({
  selectedEntity,
  defaultFormState = {},
  propertiesItemCollection,
  editorConfig,
  saveEntityPropsStore
}: PropertiesEditorProps) => {
  // console.log(selectedEntity);
  const { properties } = selectedEntity;
  const hasProps = !!properties?.propRefs;

  /** 用于管理 Editor 中所有控件产生的值 */
  const [formState, updateFormValues] = useFormState(defaultFormState);
  const [updateState, clickToUpdate] = useUpdateState();

  return (
    <div>
      {
        hasProps && (
          Array.isArray(properties.propRefs)
          && properties.propRefs.map((propID) => {
            const activeFormState = formState[propID];
            const currValue = activeFormState?.value;
            const propConfig = propertiesItemCollection[propID];
            return (
              <div
                key={propID}
              >
                <ComponentParser
                  componentState={currValue}
                  onChange={(nextValue, propType) => {
                    /**
                     * 性能优化部分
                     */
                    const prevState = currValue;
                    if (nextValue === prevState) return;

                    /**
                     * 更新数据
                     */
                    updateFormValues(propID, nextValue, propType);
                  }}
                  propConfig={propConfig}
                  entity={selectedEntity}
                />
              </div>
            );
          })
        )
      }
      <div className="action-area">
        <Button
          color={updateState ? 'green' : 'blue'}
          onClick={(e) => {
            saveEntityPropsStore(selectedEntity.id, formState);
            clickToUpdate();
          }}
        >
          保存属性{updateState ? '成功' : ''}
        </Button>
      </div>
    </div>
  );
};

PropertiesEditor.defaultProps = {
  propertiesItemCollection: PropertiesItemCollection
};

export default PropertiesEditor;
