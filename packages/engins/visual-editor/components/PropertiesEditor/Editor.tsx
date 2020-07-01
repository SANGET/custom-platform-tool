/**
 * PropEditor
 */
import React, { useState, useEffect } from 'react';
import { Input, Button } from '@infra/ui-interface';
import { propertiesItemCollection } from '../../core/access/mock-data';
import { mergeDeep } from '../CanvasStage/utils/deepmerge';

export type SaveComponentPropStore = (id: string, formState: any) => void

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
  selectedEntity: {}
  defaultFormState: {}
  saveComponentPropStore: SaveComponentPropStore
}

const PropertiesEditor = ({
  selectedEntity,
  defaultFormState = {},
  saveComponentPropStore
}: PropertiesEditorProps) => {
  // console.log(selectedEntity);
  const { properties } = selectedEntity;
  const hasProps = !!properties?.propRefs;

  /** 用于管理 Editor 中所有控件产生的值 */
  const [formState, setFormState] = useState(defaultFormState);
  const [updateState, setUpdateState] = useState(false);

  const updateFormValues = (formID, value, propType) => {
    setFormState({
      ...formState,
      [formID]: {
        propType,
        value
      }
    });
  };

  let timmer;

  const clickToUpdate = () => {
    clearTimeout(timmer);
    setUpdateState(true);

    timmer = setTimeout(() => {
      setUpdateState(false);
    }, 1000);
  };

  useEffect(() => {
    return () => {
      clearTimeout(timmer);
    };
  }, []);

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
            saveComponentPropStore(selectedEntity.id, formState);
            clickToUpdate();
          }}
        >
          保存属性{updateState ? '成功' : ''}
        </Button>
      </div>
    </div>
  );
};

export default PropertiesEditor;
