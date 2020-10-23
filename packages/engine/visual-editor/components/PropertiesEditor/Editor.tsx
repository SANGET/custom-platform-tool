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
  PageMetadata,
} from '../../data-structure';
import { takePropItemConfig } from './takePropItemConfig';
import { entityStateMergeRule } from './entityStateMergeRule';
import { PropItemRendererProps } from './types';
import { GroupPanel, GroupPanelData } from '../GroupPanel';
import { VEAppDispatcher } from '../../core';

export type PropPanelData = GroupPanelData[]

export type UpdateEntityStateOfEditor = (entityState: WidgetEntityState) => void
export type InitEntityStateOfEditor = (entityState: WidgetEntityState) => void

export interface PropertiesEditorProps {
  pageMetadata: PageMetadata
  /** 选中的 entity */
  propItemGroupingData: PropPanelData
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
  /** 更改元数据 */
  ChangeMetadata: VEAppDispatcher['ChangeMetadata']
}

const debounce = new Debounce();

/**
 * 包装默认值
 */
const wrapDefaultValues = (propItemMeta: PropItemMeta): NextEntityState[] => {
  const { defaultValues, whichAttr } = propItemMeta;
  const _defaultValues = whichAttr.map((attr) => ({
    attr,
    value: defaultValues ? defaultValues[attr] : null,
  }));
  return _defaultValues;
};

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

      const _defaultEntityState = this.getEntityDefaultState();
      initEntityState(_defaultEntityState);

      this.hasDefaultEntityState = true;
      this.setState({
        entityState: _defaultEntityState
      });
    }
  }

  /**
   * 设置组件实例状态的默认值
   */
  getEntityDefaultState = () => {
    const bindPropItems = this.getPropItemMetadatas();
    let defaultWidgetState: WidgetEntityState = {};

    Array.isArray(bindPropItems)
    && bindPropItems.forEach((bindedPropConfig) => {
      const propItemMeta = this.takePropItemMeta(bindedPropConfig);

      if (propItemMeta) {
        const _defaultValues = wrapDefaultValues(propItemMeta);
        defaultWidgetState = entityStateMergeRule(defaultWidgetState, _defaultValues);
      }
    });

    return defaultWidgetState;
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

  takePropItemMeta = (bindedPropConfig: PropItemRefs | PropItemCompAccessSpec) => {
    const {
      selectedEntity,
      propItemData,
    } = this.props;
    if (!bindedPropConfig) return null;
    /** 如果 bindedPropConfig 是 PropItemRefs */
    const { defaultValues } = bindedPropConfig;
    const propID = this.getPropItemID(bindedPropConfig);

    /** 覆盖属性项的定义 */
    const override = {
      defaultValues
    };

    const propOriginConfigItem = propItemData[propID];

    /** 通过传入 entity 来提取 propItemMeta */
    const propItemMeta = takePropItemConfig(propOriginConfigItem, override);
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
   * 判断是否存在 PropertiesConfig
   */
  hasPropertiesConfig = () => {
    const {
      widgetBindedPropItemsMeta,
    } = this.props;
    return widgetBindedPropItemsMeta && (!!widgetBindedPropItemsMeta.propItemRefs || !!widgetBindedPropItemsMeta.rawPropItems);
  }

  getPropItemID = (propItemMeta: PropItemRefs | PropItemMeta) => {
    const { id, propID } = propItemMeta;
    return id || propID;
  }

  bindPropItems = this.getPropItemMetadatas()

  propItemRenderer = (propItemID, groupType) => {
    /** TODO: 优化性能 */
    const currPropItemConfig = this.bindPropItems.find((item) => {
      const propID = this.getPropItemID(item);
      return propID === propItemID;
    });
    if (!currPropItemConfig) return null;
    const {
      propItemRenderer, propItemData, widgetBindedPropItemsMeta, ChangeMetadata
    } = this.props;
    const bindedPropConfig = propItemData[propItemID];
    const propItemMeta = this.takePropItemMeta(bindedPropConfig);

    /** 如果没有绑定属性项，则直接返回 */
    if (!propItemMeta) return null;

    const editingAttr = this.getEditingAttr(propItemMeta, bindedPropConfig);
    // if (typeof bindedPropConfig !== 'function') {
    //   editingAttr = this.getEditingAttr(propItemMeta, bindedPropConfig);
    // } else {
    //   editingAttr = propItemMeta.whichAttr;
    // }

    /** 将实例状态回填到属性项 */
    const activeState = this.getPropItemValue(this.state.entityState, editingAttr);
    return (
      <div
        key={propItemMeta.id}
      >
        {
          propItemRenderer({
            propItemValue: activeState,
            ChangeMetadata,
            changeEntityState: (nextValue) => {
              /** 更新自身的数据 */
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
  }

  render() {
    const { propItemGroupingData } = this.props;

    return (
      <div
        className="entity-prop-editor"
      >
        <GroupPanel
          panelData={propItemGroupingData}
          itemRenderer={this.propItemRenderer}
        />
      </div>
    );
  }
}

export default PropertiesEditor;
