/**
 * PropEditor
 */
import React from 'react';
import { Input, Button } from '@infra/ui';
import { propertiesItemCollection } from '../../mock-data';
import {
  EditorComponentEntity, EditorEntityState, EditorPropertyItem,
} from '../../types';
import useUpdateState from './useUpdateState';
import { PropItemRenderer } from './PropItemRenderer';
import { Dispatcher } from '../../core/actions';
import { extractPropConfig } from './extractPropConfig';
import { entityStateMergeRule } from './entityStateMergeRule';

export interface PropertiesEditorProps {
  /** 选中的 entity */
  selectedEntity: EditorComponentEntity
  /** 属性编辑器的配置，通过该配置生成有层级结构的属性编辑面板 */
  editorConfig?: any
  /** 默认的表单数据state */
  defaultEntityState?: EditorEntityState
  /** 保存属性的回调 */
  updateEntitiesStateStore: Dispatcher['UpdateEntityState']
  /** 初始化实例的回调 */
  initEntityState: Dispatcher['InitEntityState']
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
    this.state = entityStateMergeRule({}, {
      propItemConfig,
      value: defaultValue
    });
    return this.state;
  }
}

const defaultEntityStateManager = new DefaultEntityStateManager();

interface PropertiesEditorState {
  entityState: EditorEntityState
}

/**
 * 属性编辑器面板
 *
 * @description 由于此业务逻辑略复杂，React.FC 并不能满足，所以采用 ClassComponent，更好的组织优化逻辑
 */
class PropertiesEditor extends React.Component<
PropertiesEditorProps, PropertiesEditorState
> {
  state: PropertiesEditorState = {
    entityState: {}
  }

  /** 是否已经初始化过默认属性 */
  hasDefaultEntityState = false

  constructor(props) {
    super(props);
    const { defaultEntityState } = props;
    this.hasDefaultEntityState = !!defaultEntityState;
    if (this.hasDefaultEntityState) {
      this.state.entityState = defaultEntityState;
    }
  }

  componentDidMount() {
    if (!this.hasDefaultEntityState) {
      const {
        selectedEntity,
        initEntityState,
      } = this.props;
      const _defaultEntityState = defaultEntityStateManager.getState();
      console.log(_defaultEntityState);
      initEntityState(selectedEntity, _defaultEntityState);

      this.hasDefaultEntityState = true;
      this.setState({
        entityState: _defaultEntityState
      });
    }
  }

  /**
   * 更新此组件内部的表单状态
   *
   * TODO: 更强的状态管理工具
   */
  updateEntityState = (propItemConfig, value) => {
    this.setState(({ entityState }) => {
      const nextState = entityStateMergeRule(entityState, { propItemConfig, value });
      return {
        entityState: nextState
      };
    });
  }

  /**
   * 渲染每个属性项
   */
  renderPropItem = () => {
    const {
      selectedEntity,
    } = this.props;
    const { entityState } = this.state;
    const { bindProperties } = selectedEntity;

    return Array.isArray(bindProperties.propRefs)
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

      /** 确保 propItemConfig 的 ID 与集合中的 ID 一致 */
      propItemConfig.id = propID;

      if (!this.hasDefaultEntityState) {
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
              this.updateEntityState(propConfigRes, nextValue);
            }}
            propID={propID}
            propItemConfig={propItemConfig}
            entity={selectedEntity}
          />
        </div>
      );
    });
  }

  render() {
    const {
      selectedEntity,
      updateEntitiesStateStore
    } = this.props;
    const { entityState } = this.state;
    const { bindProperties } = selectedEntity;
    const hasProps = !!bindProperties?.propRefs;

    const propFormDOM = hasProps && this.renderPropItem();

    return (
      <div>
        <div className="action-area mb10">
          <StateBtn onClick={(e) => {
            updateEntitiesStateStore(selectedEntity, entityState);
          }}
          />
        </div>
        {
          propFormDOM
        }
      </div>
    );
  }
}

export default PropertiesEditor;
