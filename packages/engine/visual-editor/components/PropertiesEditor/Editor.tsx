/**
 * PropEditor
 */
import React, { useState, useEffect } from 'react';
import { Input, Button } from '@infra/ui';
import { mergeDeep } from '@infra/utils/tools';
import { propertiesItemCollection } from '../../mock-data';
import {
  EditorComponentEntity, EditorEntityState, EditorPropertyItem,
  PropertyItemConfig, PropertyItemConfigFunc
} from '../../types';
import useUpdateState from './useUpdateState';
import useEntityState, { entityStateMergeRule } from './useEntityState';
import { SaveEntitiesStateStore } from '../../core/actions-hook';
import { PropItemRenderer } from './PropItemRenderer';

export interface PropertiesEditorProps {
  /** 选中的 entity */
  selectedEntity: EditorComponentEntity
  /** 属性编辑器的配置，通过该配置生成有层级结构的属性编辑面板 */
  editorConfig?: any
  /** 保存属性的回调 */
  saveEntitiesStateStore: SaveEntitiesStateStore
  /** 默认的表单数据state */
  defaultEntityState?: EditorEntityState
}

const StateBtn = ({
  onClick
}) => {
  const [updateState, clickToUpdate] = useUpdateState();
  return (
    <Button
      color={updateState ? 'green' : 'blue'}
      onClick={(e) => {
        clickToUpdate();
        onClick(e);
      }}
    >
    保存属性{updateState ? '成功' : ''}
    </Button>
  );
};

/**
 * 设置实例状态的默认值
 *
 * TODO: 合并下方的渲染，提高性能
 */
class DefaultEntityStateManager {
  private state = {}

  getState = () => {
    return this.state;
  }

  setState = (
    selectedEntity: EditorComponentEntity,
    propItemConfig
  ) => {
    const { defaultValue } = propItemConfig;
    this.state[propItemConfig.id] = entityStateMergeRule({}, {
      propItemConfig,
      value: defaultValue
    });
    return this.state;
  }
}

const defaultEntityStateManager = new DefaultEntityStateManager();

/**
 * 提取 prop config
 */
const extractPropConfig = (
  propItemConfig: PropertyItemConfigFunc,
  entity: EditorComponentEntity
): EditorPropertyItem => {
  if (typeof propItemConfig === 'function') {
    return propItemConfig(mergeDeep(entity));
  }
  return propItemConfig;
};

/**
 * 属性编辑器面板
 */
const PropertiesEditor: React.FC<PropertiesEditorProps> = ({
  selectedEntity,
  defaultEntityState,
  editorConfig,
  saveEntitiesStateStore
}) => {
  // console.log(selectedEntity);
  const { bindProperties } = selectedEntity;
  const hasProps = !!bindProperties?.propRefs;

  /**
   * 用于管理 Editor 中所有控件产生的值
   */
  const [entityState, updateEntityState] = useEntityState(defaultEntityState || {});

  const propFormDOM = hasProps && (
    Array.isArray(bindProperties.propRefs)
    && bindProperties.propRefs.map((propID) => {
      /**
       * 将实例状态回填到属性项
       */
      const activeState = entityState?.propOriginState
        ? entityState.propOriginState[propID]
        : undefined;
      const currValue = activeState?.value;

      /**
       * @important
       *
       * 此配置为函数，需要在此做过滤
       */
      const propItemConfigOrigin = propertiesItemCollection[propID];

      /** 通过传入 entity 来提取 propItemConfig */
      const propItemConfig = extractPropConfig(propItemConfigOrigin, selectedEntity);

      /** 设置初始化状态的实例状态初始值 */
      defaultEntityStateManager.setState(selectedEntity, propItemConfig);

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
  );

  /**
   * 初始化组件类时，绑定组件类的默认值
   */
  useEffect(() => {
    if (!defaultEntityState) {
      const _defaultEntityState = defaultEntityStateManager.getState();
      saveEntitiesStateStore(selectedEntity.id, _defaultEntityState);
    }
  }, []);

  return (
    <div>
      <div className="action-area mb10">
        <StateBtn onClick={(e) => {
          saveEntitiesStateStore(selectedEntity.id, entityState);
        }}
        />
      </div>
      {
        propFormDOM
      }
    </div>
  );
};

export default PropertiesEditor;
