/**
 * @author zxj
 *
 * 这里是画布与组件渲染的稳定抽象
 */

import React from 'react';
import {
  LayoutWrapperContext
} from '@engine/layout-renderer';
import styled from 'styled-components';
import classnames from 'classnames';
import { EditorEntityState, EditorComponentEntity, TEMP_ENTITY_ID } from '@engine/visual-editor/types';
import ComponentWrapperCom from '@engine/visual-editor/spec/template/ComponentWrapperCom';
import DragItem, {
  DragItemActions
} from './DragItem';
import { TempEntityTip } from './template/TempEntityTip';
import { ItemTypes } from './types';
// import { Debounce } from '@mini-code/base-func';

export interface GetStateContext {
  nestingInfo
  idx
}

export type GetEntityProps = (ctx: GetStateContext) => EditorEntityState | undefined
export type GetSelectedState = (ctx: GetStateContext) => boolean
export type GetLayoutNode = (ctx: GetStateContext) => EditorComponentEntity

export interface WrapperFacContext {
  /** 获取选中的组件实例的状态 */
  getSelectedState: GetSelectedState
  /** 获取组件实例的 props */
  getEntityProps: GetEntityProps
  /** 扁平的 node 结构 */
  getLayoutNode: GetLayoutNode
}

export interface WrapperFacActions extends DragItemActions {
  /** 响应组件点击事件 */
  onClick: (event, { entity: EditorComponentEntity, idx: number }) => void
  /** 响应组件点击事件 */
  onDelete: (event, { idx: number, entity: EditorComponentEntity }) => void
}

/**
 * 包装器的 options
 */
export interface WrapperFacOptions extends WrapperFacContext, WrapperFacActions {
}

/**
 * 包装器传给被包装的组件的 props
 */
export interface FacToComponentProps extends LayoutWrapperContext {
  onClick
  currEntity: EditorComponentEntity
  entityState: EditorEntityState
}

export type DragableItemWrapperFac = (
  wrapperFacOptions: WrapperFacOptions
) => (
  props: LayoutWrapperContext
) => JSX.Element

const DragableItemWrapper = styled.div`
  position: relative;
  &:hover {
    >.state-mark {
      border-color: #a6bcf8;
    }
  }
  &.hovering {
    >.state-mark {
      border-color: #a6bcf8;
    }
  }
  &.selected {
    >.state-mark {
      border-color: #376BFB;
    }
  }
`;

// const debounce = new Debounce();

/**
 * 可视化编辑器引擎的组件抽象实现
 */
export const dragableItemWrapperFac: DragableItemWrapperFac = (
  {
    onDrop, onMove, onClick, onDelete,
    getLayoutNode, getSelectedState, getEntityProps,
    // getHoveringEntity, setHoveringEntity
  },
) => (propsForChild) => {
  const {
    id, idx, nestingInfo, children
  } = propsForChild;
  const isSelected = getSelectedState({ idx, nestingInfo });
  const entityState = getEntityProps({ idx, nestingInfo });
  const currEntity = getLayoutNode({ idx, nestingInfo });
  // const isHovering = getHoveringEntity(id);
  const classes = classnames([
    // isHovering && 'hovering',
    isSelected && 'selected',
  ]);
  const isTempEntity = currEntity._state === TEMP_ENTITY_ID;

  return isTempEntity ? <TempEntityTip key={id} /> : (
    <DragableItemWrapper
      className={classes}
      key={id}
    >
      <DragItem
        id={id}
        index={idx}
        onDrop={onDrop}
        onMove={onMove}
        dragItemClass={currEntity}
        type={ItemTypes.DragItemEntity}
        accept={[ItemTypes.DragItemEntity, ItemTypes.DragItemClass]}
      >
        <ComponentWrapperCom
          {...propsForChild}
          onClick={(e) => {
            e.stopPropagation();
            onClick(e, { entity: currEntity, idx });
          }}
          currEntity={currEntity}
          entityState={entityState}
        >
          {children}
        </ComponentWrapperCom>
        <div
          className="t_red rm-btn"
          onClick={(e) => {
            e.stopPropagation();
            onDelete(e, { idx, entity: currEntity });
          }}
        >
        删除
        </div>
      </DragItem>
      <div className="hoving state-mark fill"></div>
      <div className="selected state-mark fill"></div>
    </DragableItemWrapper>
  );
};
