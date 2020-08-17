import React from 'react';
import useEntityState from './useEntityState';
import { extractPropConfig } from './extractPropConfig';
import { propertiesItemCollection } from '../../mock-data';
import { PropItemRenderer } from './PropItemRenderer';

/**
 * 属性编辑器面板
 */
const FormManager: React.FC = ({
  defaultEntityState,
  selectedEntity,
  propRefs,
  beforeEachItemRender,
}) => {
  const hasDefaultEntityState = !!defaultEntityState;

  /**
   * 用于管理 Editor 中所有控件产生的值
   */
  const [entityState, updateEntityState] = useEntityState(defaultEntityState || {});

  const propFormDOM = propRefs.map((propID) => {
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

    const  beforeEachItemRender();

    if (!hasDefaultEntityState) {
      /**
         * 设置初始化状态的实例状态初始值
         *
         * 如果没有被初始化，则返回空的组件节点，等待组件属性的值被初始化后再做下一步渲染
         */
      defaultEntityStateManager.setState(selectedEntity, propItemConfig);
      return (
        <div key={propID}></div>
      );
    }

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
  });

  return propFormDOM;
};

export default FormManager;
