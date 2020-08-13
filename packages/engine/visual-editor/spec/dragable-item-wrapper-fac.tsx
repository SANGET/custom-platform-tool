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
import { LayoutInfoActionReducerState } from '@engine/visual-editor/core/reducers/layout-info';
import { EditorEntityState, EditorComponentEntity } from '@engine/visual-editor/types';
// import { Debounce } from '@mini-code/base-func';

export type GetEntityProps = (id: string) => EditorEntityState
export type GetSelectedState = (id: string) => boolean
export type GetHoveringEntity = (id: string) => boolean
export type SetHoveringEntity = (id: string) => void

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
  flatLayoutNodes: LayoutInfoActionReducerState
}

export interface WrapperFacActions {
  /** 响应组件的“方”事件 */
  onDrop: (entity, containerID?) => void;
  /** 响应组件点击事件 */
  onClick: (event, entity: EditorComponentEntity) => void;
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

export type FacToComponentProps = Omit<FacToComponentPropsTemp, 'flatLayoutNodes'>

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
    onDrop, onClick,
    flatLayoutNodes, getSelectedState, getEntityProps,
    // getHoveringEntity, setHoveringEntity
  },
) => (propsForChild) => {
  const { id, children } = propsForChild;
  const isSelected = getSelectedState(id);
  // const isHovering = getHoveringEntity(id);
  const classes = classnames([
    // isHovering && 'hovering',
    isSelected && 'selected',
  ]);
  return (
    <DragableItemWrapper
      // onMouseEnter={(e) => {
      //   // debounce.cancel();
      //   setHoveringEntity(id);
      // }}
      // onMouseLeave={(e) => {
      //   // debounce.exec(() => setHoveringEntity(''), 300);
      //   setHoveringEntity('');
      // }}
      className={classes}
      key={id}
    >
      <WrapperComponent
        {...propsForChild}
        onClick={onClick}
        onDrop={onDrop}
        currEntity={flatLayoutNodes[id]}
        getSelectedState={getSelectedState}
        getEntityProps={getEntityProps}
      >
        {children}
      </WrapperComponent>
      <div className="hoving state-mark fill"></div>
      <div className="selected state-mark fill"></div>
    </DragableItemWrapper>
  );
};
