/**
 * CanvasStage
 */
import React from 'react';
import { LayoutRenderer } from '@engine/layout-renderer';
import {
  LayoutInfoActionReducerState,
  TempEntity,
  EditorComponentEntity,
  PageMetadata
} from '@engine/visual-editor/types';
import {
  DragableItemTypes,
  dragableItemWrapperFac, WrapperFacOptions, DragableItemWrapperFac, GetStateContext, WrapperItemClockEvent
} from '@engine/visual-editor/spec';
import { Debounce } from '@mini-code/base-func';

import { constructCompClass, constructTempEntity } from '@engine/visual-editor/core/utils/component-constructor';
import { Dispatcher } from '../../core/actions';
import DropStageContainer from './DropStageContainer';
import { DnDContext } from '../../spec/DragItem';
import { getItemFromNestingItems } from '../../core/utils';
import { SelectEntityState } from '../../core/types';

/**
 * 中央舞台组件的 props
 */
export interface CanvasStageProps extends Dispatcher {
  /** 组件包接入规范  */
  dragableItemWrapper?: DragableItemWrapperFac
  /** 页面的状态 */
  pageEntityState?: {
    style: CSSStyleRule
  }
  /** 页面元数据 */
  pageMetadata: PageMetadata
  /** 布局信息 */
  layoutNodeInfo: LayoutInfoActionReducerState
  /** 选中的组件实例 */
  selectedInfo: SelectEntityState
  /** 点击舞台的事件回调 */
  onStageClick?: () => void
}

const debounceAddTempEntity = new Debounce();

/**
 * 中央舞台组件
 */
class CanvasStage extends React.Component<CanvasStageProps> {
  /** 用于记录最后拖拽的实例的 idx */
  lastMoveIdx!: number | undefined

  /** 用于记录被拖动的实例的原 idx */
  dragItemOriginIdx!: number | undefined

  getItemFromNesting = (nestingInfo) => {
    return getItemFromNestingItems(this.props.layoutNodeInfo, nestingInfo, 'body');
  }

  getLayoutNode = ({ nestingInfo }: GetStateContext) => {
    return this.getItemFromNesting(nestingInfo);
  }

  /**
   * 查看组件实例是否被选中
   * @param entityID entityID
   */
  getSelectedState = ({ id }: GetStateContext) => {
    return this.props.selectedInfo.id === id;
  };

  getEntityProps = ({ nestingInfo }: GetStateContext) => {
    return this.getItemFromNesting(nestingInfo)?.propState;
  };

  /**
   * 相应拖放的放的动作的过滤器
   * 用于实例化 componentClass 或者更新 componentEntity
   */
  dropDispatcher = (componentClass, dropCtx?: DnDContext) => {
    const {
      layoutNodeInfo,
      pageMetadata,
      AddEntity
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
      const entity = constructCompClass(itemClassCopy, {
        idCount: pageMetadata.lastCompID
      });
      _entity = entity;
      AddEntity(_entity, _idx);
    }

    this.lastMoveIdx = undefined;
  };

  deleteElement = (event, { idx, entity }) => {
    this.props.DelEntity(idx, entity);
  };

  /**
   * 点击选择组件实例的处理
   */
  onSelectEntityForClick: WrapperItemClockEvent = (clickEvent, actionCtx) => {
    const {
      SelectEntity,
      selectedInfo
    } = this.props;
    const { entity, idx, nestingInfo } = actionCtx;
    /** 如果已经被选择，则不需要再出发事件了 */
    if (nestingInfo.join('') === selectedInfo.nestingInfo.join('')) return;
    SelectEntity(entity, idx, nestingInfo);
  };

  /**
   * 响应元素的拖事件，作用于排序
   */
  onMove = (dragIndex, hoverIndex, dragItem?) => {
    /** 防止没有 dragIndex 的产生坏数据 */
    if (typeof dragIndex === 'undefined') return;
    // this.dragItemOriginIdx = dragIndex;
    /** 取消由进入画布时触发的添加临时组件 */
    debounceAddTempEntity.cancel();
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
    UpdateEntityState: this.props.UpdateEntityState
  };

  render() {
    const {
      layoutNodeInfo,
      pageEntityState,
      selectedInfo,
      onStageClick,
      DelEntity,
      dragableItemWrapper = dragableItemWrapperFac,
    } = this.props;
    // console.log(layoutNodeInfo);
    const hasNode = layoutNodeInfo.length > 0;

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
              triggerCondition={(dragItem) => {
                return dragItem && dragItem.type === DragableItemTypes.DragItemClass;
              }}
              accept={[DragableItemTypes.DragItemClass, DragableItemTypes.DragItemEntity]}
              onLeave={(item) => {
                /** 移出 item */
                typeof item.index !== 'undefined' && DelEntity(item.index, item);
              }}
              onEnter={(item) => {
                const layoutNodeInfoLen = layoutNodeInfo.length;
                /** 设置 dragClass 的 index，用于排序 */
                // eslint-disable-next-line no-param-reassign
                item.index = layoutNodeInfoLen;
                /**
                 * 延后将临时组件实例添加到画布，属于交互体验优化
                 */
                debounceAddTempEntity.exec(() => {
                  this.onMove(layoutNodeInfoLen, layoutNodeInfoLen, item);
                }, 100);
              }}
              onDrop={(_dragItemClass, dropOptions) => {
                if (dropOptions.type !== DragableItemTypes.DragItemClass) return;
                this.dropDispatcher(_dragItemClass);
              }}
              onStageClick={onStageClick}
              style={pageStyle}
            >
              {hasNode ? child : (
                <div>请从左边拖入组件</div>
              )}
            </DropStageContainer>
          )}
        />
      </div>
    );
  }
}

export default CanvasStage;
