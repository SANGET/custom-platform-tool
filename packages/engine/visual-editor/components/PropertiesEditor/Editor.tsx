/**
 * PropEditor
 */
import React from 'react';
import { Input, Button } from '@infra/ui';
import { Debounce } from '@mini-code/base-func';
import {
  EditorEntity, EditorEntityState, EditorPropertyItem,
  ComponentBindPropsConfig,
} from '../../types';
import useUpdateState from './useUpdateState';
import { PropItemRenderer as PropItemRendererDefault } from './PropItemRenderer';
import { extractPropConfig } from './extractPropConfig';
import { entityStateMergeRule } from './entityStateMergeRule';
import { PropItemRendererProps } from './types';

export type UpdateEntityStateOfEditor = (entityState: EditorEntityState) => void
export type InitEntityStateOfEditor = (entityState: EditorEntityState) => void

export interface PropertiesEditorProps {
  /** 选中的 entity */
  selectedEntity: EditorEntity
  propItemDeclares: any
  /** 属性项组合配置 */
  propertiesConfig: ComponentBindPropsConfig
  /** 属性编辑器的配置，通过该配置生成有层级结构的属性编辑面板 */
  editorConfig?: any
  /** 默认的表单数据state */
  defaultEntityState?: EditorEntityState
  /** 保存属性 */
  updateEntityState: UpdateEntityStateOfEditor
  /** 初始化实例 */
  initEntityState: InitEntityStateOfEditor
  /** 每个属性项的渲染器 */
  propItemRenderer?: (props: PropItemRendererProps) => JSX.Element
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

const debounce = new Debounce();

/**
 * 设置实例状态的默认值
 */
class DefaultEntityStateManager {
  private state = {}

  getState = () => {
    return this.state;
  }

  setState = (
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
        initEntityState,
      } = this.props;

      /** 这段代码会执行在 render 之后 */
      const _defaultEntityState = defaultEntityStateManager.getState();
      // console.log(_defaultEntityState);
      initEntityState(_defaultEntityState);

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
  updateEntityStateForSelf = (propItemConfig, value) => {
    this.setState(({ entityState }) => {
      const nextState = entityStateMergeRule(entityState, { propItemConfig, value });
      return {
        entityState: nextState
      };
    });
  }

  /**
   * 合并 properties 配置
   */
  mergePropConfig = () => {
    const {
      propertiesConfig,
    } = this.props;
    const { propRefs = [], rawProp = [] } = propertiesConfig;
    const bindProps = [
      ...propRefs,
      ...rawProp
    ];
    return bindProps;
  }

  defaultPropItemRenderer = (props) => {
    return (
      <PropItemRendererDefault {...props} />
    );
  }

  /**
   * 渲染每个属性项
   */
  renderPropItem = () => {
    const {
      selectedEntity,
      propItemDeclares,
      propItemRenderer = this.defaultPropItemRenderer
    } = this.props;
    const { entityState } = this.state;
    // const { bindProps } = selectedEntity;
    const bindProps = this.mergePropConfig();

    return Array.isArray(bindProps)
    && bindProps.map((propConfig) => {
      let propID: string;
      let propOriginConfigItem;
      let propItemConfig;
      if (typeof propConfig === 'string') {
        propID = propConfig;

        /**
         * @important
         *
         * 此配置为函数，需要在此做过滤
         */
        propOriginConfigItem = propItemDeclares[propID];
        propItemConfig = extractPropConfig(propOriginConfigItem, selectedEntity);

        /**
         * 通过传入 entity 来提取 propItemConfig
         */
      } else {
        propItemConfig = extractPropConfig(propConfig, selectedEntity);
        propID = propItemConfig.id;
      }

      /**
       * 将实例状态回填到属性项
       */
      const activeState = entityState
        ? entityState[propID]
        : undefined;

      /** 确保 propItemConfig 的 ID 与集合中的 ID 一致 */
      propItemConfig.id = propID;

      if (!this.hasDefaultEntityState) {
        /**
         * 设置初始化状态的实例状态初始值
         *
         * 如果没有被初始化，则返回空的组件节点，等待组件属性的值被初始化后再做下一步渲染
         */
        defaultEntityStateManager.setState(propItemConfig);
        return (
          <div key={propID}></div>
        );
      }

      return (
        <div
          key={propID}
        >
          {
            propItemRenderer({
              componentState: activeState,
              onChange: (nextValue, propConfigRes) => {
                /**
                 * 性能优化部分
                 */
                const prevState = activeState;
                if (nextValue === prevState) return;

                /**
                 * 更新数据
                 */
                this.updateEntityStateForSelf(propConfigRes, nextValue);

                debounce.exec(() => {
                  this.props.updateEntityState(this.state.entityState);
                }, 300);
              },
              propID,
              propItemConfig
            })
          }
          {/* <PropItemRenderer
            componentState={activeState}
            onChange={(nextValue, propConfigRes) => {
              const prevState = activeState;
              if (nextValue === prevState) return;
              this.updateEntityStateForSelf(propConfigRes, nextValue);

              debounce.exec(() => {
                this.props.updateEntityState(this.state.entityState);
              }, 300);
            }}
            propID={propID}
            propItemConfig={propItemConfig}
          /> */}
        </div>
      );
    });
  }

  /**
   * 判断是否存在 PropertiesConfig
   */
  hasPropertiesConfig = () => {
    const {
      propertiesConfig,
    } = this.props;
    return propertiesConfig && (!!propertiesConfig.propRefs || !!propertiesConfig.rawProp);
  }

  render() {
    // const {
    //   updateEntityState
    // } = this.props;
    // const { entityState } = this.state;
    const hasProps = this.hasPropertiesConfig();

    const propFormDOM = hasProps && this.renderPropItem();

    return (
      <div
        className="entity-prop-editor"
      >
        {/* <div className="action-area mb10">
          <StateBtn onClick={(e) => {
            updateEntityState(entityState);
          }}
          />
        </div> */}
        {
          propFormDOM
        }
      </div>
    );
  }
}

export default PropertiesEditor;
