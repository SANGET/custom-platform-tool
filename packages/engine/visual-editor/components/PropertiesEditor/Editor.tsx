/**
 * PropEditor
 */
import React from 'react';
import produce from 'immer';
import { Debounce } from '@mini-code/base-func';
import {
  WidgetEntity, WidgetEntityState, PropItemMeta,
  WidgetBindPropItemsType,
  PropItemsCollection,
  PropItemRefs,
  PropItemCompAccessSpec,
  EditAttr,
  NextEntityStateType,
  NextEntityState,
} from '../../data-structure';
import { takePropItemConfig } from './takePropItemConfig';
import { entityStateMergeRule } from './entityStateMergeRule';
import { PropItemRendererProps } from './types';
import { GroupPanel, GroupPanelData } from '../GroupPanel';

export type PropPanelData = GroupPanelData

export type UpdateEntityStateOfEditor = (entityState: WidgetEntityState) => void
export type InitEntityStateOfEditor = (entityState: WidgetEntityState) => void

export interface PropertiesEditorProps {
  /** 选中的 entity */
  propPanelData: PropPanelData
  selectedEntity: WidgetEntity
  propItemData: PropItemsCollection
  /** 组件绑定的属性项配置 */
  widgetBindedPropItemsMeta: WidgetBindPropItemsType
  /** 属性编辑器的配置，通过该配置生成有层级结构的属性编辑面板 */
  editorConfig?: any
  /** 默认的表单数据state */
  defaultEntityState?: WidgetEntityState
  /** 保存属性 */
  updateEntityState: UpdateEntityStateOfEditor
  /** 初始化实例 */
  initEntityState: InitEntityStateOfEditor
  /** 每个属性项的渲染器 */
  propItemRenderer: (props: PropItemRendererProps) => JSX.Element
}

const debounce = new Debounce();

/**
 * 包装默认值
 */
const wrapDefaultValues = (propItemMeta: PropItemMeta): NextEntityState[] => {
  const { defaultValues, whichAttr } = propItemMeta;
  const _defaultValues = defaultValues ? whichAttr.map((attr) => ({
    attr,
    value: defaultValues[attr],
  })) : [];
  return _defaultValues;
};

/**
 * 设置实例状态的默认值
 */
class EntityDefaultStateManager {
  private state = {}

  getState = () => {
    return this.state;
  }

  setState = (
    propItemMeta: PropItemMeta
  ) => {
    const _defaultValues = wrapDefaultValues(propItemMeta);
    this.state = entityStateMergeRule(this.state, _defaultValues);
    return this.state;
  }
}

const entityDefaultStateManager = new EntityDefaultStateManager();

interface PropertiesEditorState {
  entityState: WidgetEntityState
}

/**
 * 属性编辑器面板
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
      const _defaultEntityState = entityDefaultStateManager.getState();
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
   * TODO: 做更强的状态管理工具
   */
  updateEntityStateForSelf = (nextValue: NextEntityStateType) => {
    this.setState(({ entityState }) => {
      const _nextValue = Array.isArray(nextValue) ? nextValue : [nextValue];
      const nextState = entityStateMergeRule(entityState, _nextValue);
      return {
        entityState: nextState
      };
    });
  }

  /**
   * 获取属性项的元数据
   */
  getPropItemMetadatas = () => {
    const {
      widgetBindedPropItemsMeta,
    } = this.props;
    const { propItemRefs = [], rawPropItems = [] } = widgetBindedPropItemsMeta;
    const bindPropItems = [
      ...propItemRefs,
      ...rawPropItems
    ];
    return bindPropItems;
  }

  /**
   * 获取属性项需要的值
   * @param entityState
   * @param propItemMeta
   */
  getPropItemValue = (entityState: WidgetEntityState, editAttr: EditAttr) => {
    const _editAttr = Array.isArray(editAttr) ? [...editAttr] : [editAttr];
    const res = {};
    _editAttr.forEach((attr) => {
      res[attr] = entityState[attr];
    });
    return res;
  }

  takePropItemMeta = (bindedPropConfig: PropItemRefs | PropItemCompAccessSpec): PropItemMeta => {
    const {
      selectedEntity,
      propItemData,
    } = this.props;
    let propOriginConfigItem;
    let propItemMeta: PropItemMeta;
    if (typeof bindedPropConfig === 'function') {
      /** 如果 bindedPropConfig 是 PropItemCompAccessSpec */
      propItemMeta = takePropItemConfig(bindedPropConfig, selectedEntity);
      // propID = propItemMeta.id;
    } else {
      /** 如果 bindedPropConfig 是 PropItemRefs */
      const { propID, defaultValues } = bindedPropConfig;

      /** 覆盖属性项的定义 */
      const override = {
        defaultValues
      };

      propOriginConfigItem = propItemData[propID];

      /** 通过传入 entity 来提取 propItemMeta */
      propItemMeta = takePropItemConfig(propOriginConfigItem, selectedEntity, override);
    }
    return propItemMeta;
  }

  /**
   * 1. 获取属性项编辑的属性的 key
   * 2. 重要规则之一
   */
  getEditingAttr = (propItemMeta: PropItemMeta, bindedPropConfig: PropItemRefs) => {
    const { editAttr } = bindedPropConfig;
    return editAttr || propItemMeta.whichAttr;
  }

  /**
   * 逐个属性项渲染
   */
  renderPropItems = () => {
    const {
      propItemRenderer
    } = this.props;
    const { entityState } = this.state;
    // const { bindPropItems } = selectedEntity;
    const bindPropItems = this.getPropItemMetadatas();

    return Array.isArray(bindPropItems)
    && bindPropItems.map((bindedPropConfig) => {
      const propItemMeta = this.takePropItemMeta(bindedPropConfig);

      /** 如果没有绑定属性项，则直接返回 */
      if (!propItemMeta) return null;

      let editingAttr;
      if (typeof bindedPropConfig !== 'function') {
        editingAttr = this.getEditingAttr(propItemMeta, bindedPropConfig);
      } else {
        editingAttr = propItemMeta.whichAttr;
      }

      /** 将实例状态回填到属性项 */
      const activeState = this.getPropItemValue(entityState, editingAttr);

      if (!this.hasDefaultEntityState) {
        /**
         * !!!设置初始化状态的实例状态初始值
         * 如果没有被初始化，则返回空的组件节点，等待组件属性的值被初始化后再做下一步渲染
         */
        entityDefaultStateManager.setState(propItemMeta);
        return null;
      }

      return (
        <div
          key={propItemMeta.id}
        >
          {
            propItemRenderer({
              propItemValue: activeState,
              changeEntityState: (nextValue) => {
                // TODO: 完善 onChange
                /**
                 * 性能优化
                 */
                // const prevState = activeState;
                // if (nextValue === prevState) return;

                /**
                 * 更新自身的数据
                 */
                this.updateEntityStateForSelf(nextValue);

                /** 延后更新整个应用的数据 */
                debounce.exec(() => {
                  this.props.updateEntityState(this.state.entityState);
                }, 100);
              },
              propItemMeta
            })
          }
        </div>
      );
    });
  }

  /**
   * 判断是否存在 PropertiesConfig
   */
  hasPropertiesConfig = () => {
    const {
      widgetBindedPropItemsMeta,
    } = this.props;
    return widgetBindedPropItemsMeta && (!!widgetBindedPropItemsMeta.propItemRefs || !!widgetBindedPropItemsMeta.rawPropItems);
  }

  propItemRenderer = () => {

  }

  render() {
    const hasProps = this.hasPropertiesConfig();

    const propFormDOM = hasProps && this.renderPropItems();

    return (
      <div
        className="entity-prop-editor"
      >
        {/* <GroupPanel
        panelData={{}}
        itemRenderer={this.propItemRenderer}
        /> */}
        {
          propFormDOM
        }
      </div>
    );
  }
}

export default PropertiesEditor;
