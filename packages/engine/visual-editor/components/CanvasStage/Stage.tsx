/**
 * CanvasStage
 */
import React from 'react';
import { Button, Grid } from '@infra/ui';
import { LayoutRenderer } from '@engine/layout-renderer';
import { SelectEntityState } from '@engine/visual-editor/core/reducers';
import { LayoutInfoActionReducerState } from '@engine/visual-editor/core/reducers/layout-info';
import { ItemTypes } from '@engine/visual-editor/spec/types';
import {
  EntitiesStateStore,
  EditorPageEntity,
  TempEntity,
  EditorComponentEntity
} from '@engine/visual-editor/types';
import {
  dragableItemWrapperFac, WrapperFacOptions, DragableItemWrapperFac
} from '@engine/visual-editor/spec/dragable-item-wrapper-fac';
import { constructCompClass, constructTempEntity } from '@engine/visual-editor/core/utils/component-constructor';
import { Dispatcher } from '../../core/actions';
import { pageProperties } from '../../mock-data/page-perproties';
import DropStageContainer from './DropStageContainer';
import { DnDContext } from '../../spec/DragItem';

const PAGE_ENTITY_ID = '__PAGE__ENTITY__ID__';

const PageEntity: EditorPageEntity = {
  id: PAGE_ENTITY_ID,
  pageID: '',
  bindProps: {
    rawProp: pageProperties
  },
};

/**
 * 中央舞台组件的 props
 */
export interface CanvasStageProps extends Dispatcher {
  /** 组件包接入规范  */
  dragableItemWrapper?: DragableItemWrapperFac
  /** 页面元数据 */
  pageMetadata: any
  /** 布局信息 */
  layoutNodeInfo: LayoutInfoActionReducerState
  /** 选中的组件实例 */
  selectedEntities: SelectEntityState
  /** 组件实例的状态集合 */
  entitiesStateStore: EntitiesStateStore
}

/**
 * 中央舞台组件
 */
class CanvasStage extends React.Component<CanvasStageProps> {
  /** 用于记录最后拖拽的实例的 idx */
  lastMoveIdx!: number | undefined

  /** 用于记录被拖动的实例的原 idx */
  dragItemOriginIdx!: number | undefined

  componentDidMount() {
    this.props.SelectEntity(PageEntity);
  }

  getLayoutNode = (entityIdx: number) => {
    return this.props.layoutNodeInfo[entityIdx];
  }

  /**
   * 查看组件实例是否被选中
   * @param entityID entityID
   */
  getSelectedState = (entityID: string) => {
    return !!this.props.selectedEntities.selectedList[entityID];
  };

  getEntityProps = (entityID: string) => {
    return this.props.entitiesStateStore[entityID];
  };

  /**
   * 相应拖放的放的动作的过滤器
   * 用于实例化 componentClass 或者更新 componentEntity
   */
  dropDispatcher = (componentClass, dropCtx?: DnDContext) => {
    const {
      layoutNodeInfo,
    } = this.props;
    const { id: parentID = null, idx } = dropCtx || {};
    let _idx = idx;
    if (typeof _idx === 'undefined') {
      if (typeof this.lastMoveIdx === 'undefined') {
        _idx = layoutNodeInfo.length;
      } else {
        _idx = this.lastMoveIdx;
      }
    }

    const itemClassCopy = Object.assign({}, componentClass);
    if (parentID) {
      itemClassCopy.parentID = parentID;
    }
    let _entity = itemClassCopy;

    /** 如果已经实例化的组件 */
    const isMotify = itemClassCopy._state === 'active';

    if (!isMotify) {
      /** 实例化组件类 */
      const entity = constructCompClass(itemClassCopy);
      _entity = entity;
      this.addElement(_entity, _idx);
    }

    /** 选中被操作的组件 */
    // setTimeout(() => SelectEntity(_entity));
    this.lastMoveIdx = undefined;
  };

  addElement = (entity, idx) => {
    this.props.AddEntity(entity, idx);
  }

  deleteElement = (event, { idx, entity }) => {
    this.props.DelEntity(idx);
  };

  /**
   * 点击选择组件实例的处理
   */
  onSelectEntityForClick = (clickEvent, { entity, idx }) => {
    const {
      SelectEntity
    } = this.props;
    SelectEntity(entity);
  };

  /**
   * 响应元素的拖事件，作用于排序
   */
  onMove = (dragIndex, hoverIndex, dragItem?) => {
    /** 防止没有 dragIndex 的产生坏数据 */
    if (typeof dragIndex === 'undefined') return;
    // this.dragItemOriginIdx = dragIndex;
    const {
      layoutNodeInfo,
      SortingEntity,
    } = this.props;
    let dragEntity: TempEntity | EditorComponentEntity = layoutNodeInfo[dragIndex];
    let replaceItem = false;
    if (!dragEntity) {
      /** 如果没有实例，则创建临时实例 */
      dragEntity = constructTempEntity();
      replaceItem = true;
    }
    /** 将最后的实例 idx 存储下来 */
    this.lastMoveIdx = hoverIndex;
    SortingEntity(dragIndex, hoverIndex, dragEntity, {
      replace: replaceItem
    });
  }

  /**
   * 接入标准的上下文
   */
  wrapperContext: WrapperFacOptions = {
    getLayoutNode: this.getLayoutNode,
    getSelectedState: this.getSelectedState,
    getEntityProps: this.getEntityProps,
    onDrop: this.dropDispatcher,
    onMove: this.onMove,
    onDelete: this.deleteElement,
    onClick: this.onSelectEntityForClick,
  };

  render() {
    const {
      entitiesStateStore,
      layoutNodeInfo,
      SelectEntity,
      DelEntity,
      dragableItemWrapper = dragableItemWrapperFac,
    } = this.props;

    const selectPage = () => {
      SelectEntity(PageEntity);
    };

    const pageEntityState = entitiesStateStore[PAGE_ENTITY_ID];
    const pageStyle = pageEntityState?.style;

    return (
      <div
        className="canvas-stage-container"
      >
        <LayoutRenderer
          layoutNode={layoutNodeInfo}
          componentRenderer={dragableItemWrapper(
            this.wrapperContext,
          )}
          RootRender={(child) => (
            <DropStageContainer
              triggerCondition={(dragItem) => dragItem && dragItem.type === ItemTypes.DragItemClass}
              accept={[ItemTypes.DragItemClass, ItemTypes.DragItemEntity]}
              onLeave={(item) => {
                /** 移出 item */
                typeof item.index !== 'undefined' && DelEntity(item.index);
              }}
              onEnter={(item) => {
                const layoutNodeInfoLen = layoutNodeInfo.length;
                /** 设置 dragClass 的 index，用于排序 */
                // eslint-disable-next-line no-param-reassign
                item.index = layoutNodeInfoLen;
                this.onMove(layoutNodeInfoLen, layoutNodeInfoLen, item);
              }}
              onDrop={(_dragItemClass, dropOptions) => {
                if (dropOptions.type !== ItemTypes.DragItemClass) return;
                this.dropDispatcher(_dragItemClass);
              }}
              onStageClick={(e) => {
                selectPage();
              }}
              style={pageStyle}
            >
              {child}
            </DropStageContainer>
          )}
        />
      </div>
    );
  }
}

export default CanvasStage;
