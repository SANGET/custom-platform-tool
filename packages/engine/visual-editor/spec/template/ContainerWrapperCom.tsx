/**
 * 具体 container 实现的地方
 */

import React from 'react';
import styled from 'styled-components';
import { useDrop } from 'react-dnd';
import classnames from 'classnames';

import { isNodeInChild } from '@engine/visual-editor/utils/node-filter';
import { DragComponentClass, DropCollectType } from '@engine/visual-editor/types';
import { ItemTypes } from '../types';
import DragItem from './DragItemInCanvas';
import { FacToComponentProps } from '../wrapper-fac';

const ContainerWrapper = styled.div`
  position: relative;
  padding: 20px;
  background-color: rgba(0,0,0, 0.1);
  /* margin: 10px; */
  &:hover {
    background-color: rgba(0,0,0, 0.15);
  }
  &.overing {
    background-color: rgba(48, 95, 144, 0.5);
  }
  &.selected {
    /* box-shadow: 0 0 1px 3px rgba(127, 113, 185, 0.5); */
    >.state-mark {
      /* pointer-events: none; */
      border-color: blue;
    }
  }
`;

const containerLayoutParser = (layoutInfo): React.CSSProperties => {
  return {
    display: 'flex',
    flex: 1
  };
};

type ContainerWrapperComProps = FacToComponentProps

const ContainerWrapperCom: React.FC<ContainerWrapperComProps> = ({
  children,
  currEntity,
  id,
  node,
  onClick,
  getSelectedState,
  getEntityProps,
  onDrop
}) => {
  const isSelected = getSelectedState(id);
  const [{ isOverCurrent }, drop] = useDrop<DragComponentClass, void, DropCollectType>({
    accept: ItemTypes.DragComponent,
    /**
     * TODO: Fix bug，父容器拖动到子容器会出现问题
     *
     * ref: https://react-dnd.github.io/react-dnd/docs/api/use-drop
     */
    drop: ({ dragItemClass: componentClass }) => {
      /**
       * @important 重要策略
       *
       * 1. isOverCurrent 判断是否拖动在容器内
       * 2. isNodeInChild 判断自身是否拖到子容器中，避免嵌套
       */
      if (isOverCurrent) {
        setTimeout(() => {
          const isNodeInChildRes = isNodeInChild(id, componentClass.id);
          // console.log(isNodeInChildRes);
          if (!isNodeInChildRes) {
            onDrop({ ...componentClass }, id);
          }
        });
      }
    },
    canDrop: ({ dragItemClass: componentClass }, monitor) => {
      /** 不允许放到自身 */
      return componentClass.id !== id;
    },
    collect: (monitor) => {
      return {
        // isOver: !!monitor.isOver(),
        isOverCurrent: monitor.isOver({ shallow: true }),
      };
    },
  });

  const classes = classnames([
    isOverCurrent && 'overing',
    isSelected && 'selected'
  ]);

  const entityState = getEntityProps(id) || {};
  const { style } = entityState;
  const { layout: layoutProps } = node;
  // const _style = Object.assign({}, style, containerLayoutParser(layoutProps));

  // TODO: 修复 flex 布局的问题
  return (
    <div
      ref={drop}
      onClick={(e) => {
        e.stopPropagation();
        onClick(e, currEntity);
      }}
      className="relative"
    >
      <DragItem
        dragItemClass={currEntity}
      >
        <ContainerWrapper
          className={classes}
        >
          <div
            style={containerLayoutParser(layoutProps)}
          >
            {children}
          </div>
          <div className="state-mark fill"></div>
        </ContainerWrapper>
      </DragItem>
    </div>
  );
};

export default ContainerWrapperCom;
