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
import { EditorEntityState, EditorComponentEntity } from '@engine/visual-editor/types';
import { DragItemDrop, DragItemDrag, DragItemMove } from './DragItem';
// import { Debounce } from '@mini-code/base-func';

export type GetEntityProps = (id: string) => EditorEntityState
export type GetSelectedState = (id: string) => boolean
export type GetHoveringEntity = (id: string) => boolean
export type SetHoveringEntity = (id: string) => void
export type GetLayoutNode = (idx: number) => EditorComponentEntity

// export interface WrapperOveringTipContext {
//   /** 获取组件实例的 props */
//   setHoveringEntity: SetHoveringEntity
//   /** 获取组件实例的 props */
//   getHoveringEntity: GetHoveringEntity
// }

export interface WrapperFacContext {
  /** 获取选中的组件实例的状态 */
  getSelectedState: GetSelectedState
  /** 获取组件实例的 props */
  getEntityProps: GetEntityProps
  /** 扁平的 node 结构 */
  getLayoutNode: GetLayoutNode
}

export interface WrapperFacActions {
  /** 响应组件的“放”事件 */
  onDrop: DragItemDrop
  /** 响应组件的“拖”事件 */
  onDrag?: DragItemDrag
  /** 响应组件点击事件 */
  onClick: (event, { entity: EditorComponentEntity, idx: number }) => void
  /** 响应组件点击事件 */
  onMove: DragItemMove
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
interface FacToComponentPropsTemp extends WrapperFacOptions, LayoutWrapperContext {
  currEntity: EditorComponentEntity
}

export type FacToComponentProps = Omit<FacToComponentPropsTemp, 'getLayoutNode', 'onDelete'>

export type ContainerWrapperFac = (
  wrapperComponent: React.ElementType<FacToComponentProps>,
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
 * wrapper 生成器
 */
export const dragableItemWrapperFac: ContainerWrapperFac = (
  WrapperComponent,
  {
    onDrop, onMove, onClick, onDelete,
    getLayoutNode, getSelectedState, getEntityProps,
    // getHoveringEntity, setHoveringEntity
  },
) => (propsForChild) => {
  const { id, idx, children } = propsForChild;
  const isSelected = getSelectedState(id);
  // const isHovering = getHoveringEntity(id);
  const classes = classnames([
    // isHovering && 'hovering',
    isSelected && 'selected',
  ]);
  const currEntity = getLayoutNode(idx);

  return (
    <DragableItemWrapper
      className={classes}
      key={id}
    >
      <WrapperComponent
        {...propsForChild}
        onClick={(e) => {
          e.stopPropagation();
          onClick(e, { entity: currEntity, idx });
        }}
        onDrop={onDrop}
        currEntity={currEntity}
        getSelectedState={getSelectedState}
        getEntityProps={getEntityProps}
        onMove={onMove}
      >
        {children}
      </WrapperComponent>
      <div
        className="t_red rm-btn"
        onClick={(e) => {
          e.stopPropagation();
          onDelete(e, { idx, entity: currEntity });
        }}
      >
        删除
      </div>
      <div className="hoving state-mark fill"></div>
      <div className="selected state-mark fill"></div>
    </DragableItemWrapper>
  );
};
