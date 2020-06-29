/**
 * PropEditor
 */
import React, { useState, useEffect } from 'react';
import { Input, Button } from '@infra/ui-interface';
import { propertiesItemCollection } from '../../core/access/mock-data';

const ComponentParser = ({
  propConfig,
  componentState,
  onChange,
}) => {
  // console.log(propConfig);
  const { label, component } = propConfig;
  let Com;
  switch (component.type) {
    case 'Input':
      Com = (
        <Input
          value={componentState || ''}
          onChange={(value) => {
            // console.log(e.target.value);
            onChange(value);
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

const PropertiesEditor = ({
  selectedEntity,
  defaultFormState = {},
  saveComponentPropStore
}) => {
  // console.log(selectedEntity);
  const { properties } = selectedEntity;
  const hasProps = !!properties?.propRefs;

  /** 用于管理 Editor 中所有控件产生的值 */
  const [formState, setFormState] = useState(defaultFormState);
  const [updateState, setUpdateState] = useState(false);

  const updateFormValues = (formID, value) => {
    setFormState({
      ...formState,
      [formID]: value
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
            const propConfig = propertiesItemCollection[propID];
            return (
              <div
                key={propID}
              >
                <ComponentParser
                  componentState={formState[propID]}
                  onChange={(nextValue, preValue) => {
                    /** 性能优化部分 */
                    if (nextValue === preValue) return;
                    updateFormValues(propID, nextValue);
                  }}
                  propConfig={propConfig}
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
