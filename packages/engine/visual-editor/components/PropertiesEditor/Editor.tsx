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
  PropItemRenderContext,
  ChangeEntityState,
} from '../../data-structure';
import { entityStateMergeRule } from './entityStateMergeRule';
import { GroupPanel, GroupPanelData } from '../GroupPanel';
import { VEAppDispatcher } from '../../core';

/** 从组件定义的属性项的元数据 */
export type PropItemConfigFormWidgetMeta = PropItemCompAccessSpec | PropItemRefs

/**
 * 属性项的 map
 */
interface PropItemMetaMap {
  [propID: string]: PropItemMeta
}

export type PropPanelData = GroupPanelData[]

export type UpdateEntityStateOfEditor = (entityState: WidgetEntityState) => void
export type InitEntityStateOfEditor = (entityState: WidgetEntityState) => void

/**
 * 属性项的渲染器标准接口
 */
export interface PropItemRendererProps {
  propItemMeta: PropItemMeta
  renderCtx: PropItemRenderContext
}

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

function makeArray<T>(item: T | T[]): T[] {
  return Array.isArray(item) ? item : [item];
}

/**
 * 包装默认值
 */
const wrapDefaultValues = (propItemMeta: PropItemMeta): NextEntityState[] => {
  const { defaultValues, whichAttr } = propItemMeta;
  const _defaultValues = makeArray(whichAttr).map((attr) => ({
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
    let defaultWidgetState: WidgetEntityState = {};
    const { bindPropItemsMap } = this;

    for (const propID in bindPropItemsMap) {
      const propItemMeta = bindPropItemsMap[propID];

      if (propItemMeta) {
        const _defaultValues = wrapDefaultValues(propItemMeta);
        defaultWidgetState = entityStateMergeRule(defaultWidgetState, _defaultValues);
      }
    }

    return defaultWidgetState;
  }

  /**
   * 更新此组件内部的表单状态
   *
   * TODO: 做更强的状态管理工具
   */
  updateEntityStateForSelf = (nextValue: NextEntityStateType) => {
    this.setState(({ entityState }) => {
      const _nextValue = makeArray(nextValue);
      const nextState = entityStateMergeRule(entityState, _nextValue);
      return {
        entityState: nextState
      };
    });
  }

  /**
   * 将组件绑定的属性项转换成 PropItemMetaMap
   */
  getPropItemMetadatas = (): PropItemMetaMap => {
    const {
      widgetBindedPropItemsMeta,
      propItemData
    } = this.props;
    const { propItemRefs = [], rawPropItems = [] } = widgetBindedPropItemsMeta;
    const propItemMetaMap = {};

    /**
     * 将 propItemRefs 转换成 PropItemMeta
     */
    propItemRefs.forEach((refItem) => {
      const { propID, editAttr, ...overrideOptions } = refItem;
      const propItemMetaFormCollection = propItemData[propID];
      const mergedPropItemMeta = produce(propItemMetaFormCollection, (draft) => {
        if (editAttr) draft.whichAttr = editAttr;
        Object.assign(draft, overrideOptions);
        return draft;
      });
      propItemMetaMap[propID] = mergedPropItemMeta;
    });
    rawPropItems.forEach((item) => {
      if (item) propItemMetaMap[item.id] = item;
    });
    return propItemMetaMap;
  }

  bindPropItemsMap = this.getPropItemMetadatas()

  /**
   * 获取属性项需要的值
   * @param entityState
   * @param propItemMeta
   */
  getPropItemValue = (entityState: WidgetEntityState, editAttr: EditAttr) => {
    const _editAttr = makeArray(editAttr);
    const res = {};
    _editAttr.forEach((attr) => {
      res[attr] = entityState[attr];
    });
    return res;
  }

  changeEntityState: ChangeEntityState = (nextValue) => {
    /** 更新自身的数据 */
    this.updateEntityStateForSelf(nextValue);

    /** 延后更新整个应用的数据 */
    debounce.exec(() => {
      this.props.updateEntityState(this.state.entityState);
    }, 100);
  }

  genMetaRefID = (metaAttr: string) => {
    const { pageMetadata } = this.props;
    if (!metaAttr) throw Error('请传入 metaAttr，否则逻辑无法进行');
    const meta = pageMetadata[metaAttr];
    const metaID = meta ? String(Object.keys(pageMetadata[metaAttr]).length + 1) : '1';
    const prefix = metaAttr;
    return `${prefix}_${metaID}`;
  }

  /**
   * 获取 meta
   */
  takeMeta = (options) => {
    const { pageMetadata } = this.props;
    const { metaAttr, metaRefID } = options;
    return metaRefID ? pageMetadata[metaAttr]?.[metaRefID] : pageMetadata[metaAttr];
  }

  /**
   * prop item 渲染器
   * @param propItemID
   * @param groupType
   */
  propItemRendererSelf = (propItemID, groupType) => {
    const { selectedEntity } = this.props;
    const propItemMeta = this.bindPropItemsMap[propItemID];

    /** 如果组件没有绑定该属性项，则直接返回 */
    if (!propItemMeta) return null;

    const {
      propItemRenderer, ChangeMetadata: changeMetadata
    } = this.props;

    const editingAttr = propItemMeta.whichAttr;

    /** 将实例状态回填到属性项 */
    const activeState = this.getPropItemValue(this.state.entityState, editingAttr);
    return (
      <div
        key={propItemID}
      >
        {
          propItemRenderer({
            propItemMeta,
            renderCtx: {
              businessPayload: {},
              editingWidgetState: activeState,
              widgetEntity: selectedEntity,
              genMetaRefID: this.genMetaRefID,
              takeMeta: this.takeMeta,
              changeMetadata,
              changeEntityState: this.changeEntityState,
            }
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
          itemRenderer={this.propItemRendererSelf}
        />
      </div>
    );
  }
}

export default PropertiesEditor;
