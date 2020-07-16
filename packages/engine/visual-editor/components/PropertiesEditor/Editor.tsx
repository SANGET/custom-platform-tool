/**
 * PropEditor
 */
import React, { useState, useEffect } from 'react';
import { Input, Button } from '@infra/ui';
import { propertiesItemCollection } from '../../mock-data';
import { mergeDeep } from '../CanvasStage/utils/deepmerge';
import { EditorComponentEntity, EditorEntityState, EditorPropertyItem } from '../../types';
import useUpdateState from './useUpdateState';
import useEntityState from './useEntityState';
import { SaveEntitiesStateStore } from '../../app/actions';

const extractPropConfig = (propItemConfig, entity) => {
  if (typeof propItemConfig === 'function') return propItemConfig(mergeDeep({}, entity));
  return propItemConfig;
};

interface PropItemRendererProps {
  entity
  propItemConfig
  componentState
  propID: string
  onChange: (value: any, propItem: EditorPropertyItem) => void
}

/**
 * 属性项渲染器
 * 根据属性项的 type 选择对应的组件进行渲染
 */
const PropItemRenderer: React.FC<PropItemRendererProps> = ({
  entity,
  propItemConfig,
  componentState,
  propID,
  onChange,
}) => {
  // console.log(propItemConfig);
  const propConfigRes = extractPropConfig(propItemConfig, entity);
  const { label, component, type } = propConfigRes;

  /** 将 ID 写入 propItemConfig */
  propConfigRes.id = propID;
  let Com;
  switch (component.type) {
    case 'Input':
      Com = (
        <Input
          value={componentState || ''}
          onChange={(value) => {
            // console.log(e.target.value);
            onChange(value, propConfigRes);
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
  /** 保存属性的回调 */
  saveEntitiesStateStore: SaveEntitiesStateStore
  /** 默认的表单数据state */
  defaultEntityState?: EditorEntityState
}

/**
 * 属性编辑器面板
 */
const PropertiesEditor: React.FC<PropertiesEditorProps> = ({
  selectedEntity,
  defaultEntityState = {},
  editorConfig,
  saveEntitiesStateStore
}) => {
  // console.log(selectedEntity);
  const { properties } = selectedEntity;
  const hasProps = !!properties?.propRefs;

  /** 用于管理 Editor 中所有控件产生的值 */
  const [entityState, updateEntityState] = useEntityState(defaultEntityState);
  const [updateState, clickToUpdate] = useUpdateState();

  return (
    <div>
      {
        hasProps && (
          Array.isArray(properties.propRefs)
          && properties.propRefs.map((propID) => {
            /**
             * 将实例状态回填到属性项
             */
            const activeState = entityState?.propOriginState ? entityState.propOriginState[propID] : undefined;
            const currValue = activeState?.value;
            const propItemConfig = propertiesItemCollection[propID];
            return (
              <div
                key={propID}
              >
                <PropItemRenderer
                  componentState={currValue}
                  onChange={(nextValue, propConfigRes) => {
                    /**
                     * 性能优化部分
                     */
                    const prevState = currValue;
                    if (nextValue === prevState) return;

                    /**
                     * 更新数据
                     */
                    updateEntityState(propConfigRes, nextValue);
                  }}
                  propID={propID}
                  propItemConfig={propItemConfig}
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
            saveEntitiesStateStore(selectedEntity.id, entityState);
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
