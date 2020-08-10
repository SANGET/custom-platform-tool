/**
 * @author zxj
 *
 * 这里是画布与组件渲染的稳定抽象
 */

import React from 'react';
import {
  LayoutWrapperContext
} from '@engine/layout-renderer';
import { LayoutInfoActionReducerState } from '@engine/visual-editor/core/reducers/layout-info';
import { EditorEntityState, EditorComponentEntity } from '@engine/visual-editor/types';

export type GetEntityProps = (id: string) => EditorEntityState
export type GetSelectedState = (id: string) => boolean

export interface WrapperFacContext {
  /** 获取选中的组件实例的状态 */
  getSelectedState: GetSelectedState
  /** 获取组件实例的 props */
  getEntityProps: GetEntityProps
  /** 扁平的 node 结构 */
  flatLayoutNodes: LayoutInfoActionReducerState
}

/**
 * 包装器的 options
 */
export interface WrapperFacOptions extends WrapperFacContext {
  /** 响应组件的“方”事件 */
  onDrop: (entity, containerID?) => void;
  /** 响应组件点击事件 */
  onClick: (event, entity: EditorComponentEntity) => void;
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

/**
 * wrapper 生成器
 */
export const containerWrapperFac: ContainerWrapperFac = (
  WrapperComponent,
  {
    onDrop, onClick,
    flatLayoutNodes, getSelectedState, getEntityProps
  },
) => (propsForChild) => {
  const { id, children } = propsForChild;
  return (
    <WrapperComponent
      {...propsForChild}
      onClick={onClick}
      onDrop={onDrop}
      currEntity={flatLayoutNodes[id]}
      getSelectedState={getSelectedState}
      getEntityProps={getEntityProps}
      key={id}
    >
      {children}
    </WrapperComponent>
  );
};
