/**
 * DropContainer
 */
import React from 'react';
import { useDrop, DropTargetHookSpec } from 'react-dnd';
import styled from 'styled-components';
import classnames from 'classnames';

import { isNodeInChild } from '@engine/visual-editor/utils/node-filter';
import { ItemTypes } from '@engine/visual-editor/spec/types';
import { DragItemClass, DropCollectType, EntitiesStateStore } from '@engine/visual-editor/types';
import { Call } from '@mini-code/base-func';

const DropContainerWrapper = styled.div`
  /* min-height: 50vh; */
  /* background-color: rgba(0,0,0, 0.05); */
  /* padding: 10px; */
  &.renderer {
  }
  &.overing {
    background-color: rgba(0,0,0, 0.08);
  }
`;

/**
 * 中央舞台组件的 props
 */
export interface DropContainerProps {
  onDrop
  onClick?
  isSelected?: boolean
  className?: boolean
  id: string
  children: React.ReactChild
  useDropOptions?: DropTargetHookSpec<DragItemClass, void, DropCollectType>
}

/**
 * 中央舞台组件
 */
const DropContainer: React.FC<DropContainerProps> = ({
  onDrop, onClick, className,
  isSelected, id, children,
  useDropOptions = {},
  ...other
}) => {
  const { accept = ItemTypes.DragItemClass } = useDropOptions;
  const [{ isOverCurrent }, drop] = useDrop<DragItemClass, void, DropCollectType>({
    ...useDropOptions,
    accept,
    /**
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
        isOver: monitor.isOver(),
        isOverCurrent: monitor.isOver({ shallow: true }),
        canDrop: monitor.canDrop(),
      };
    },
  });

  const classes = classnames([
    className,
    "relative",
    isOverCurrent && 'overing',
    isSelected && 'selected'
  ]);

  // console.log(layoutNestingNodeTree);

  return (
    <DropContainerWrapper
      {...other}
      ref={drop}
      onClick={(e) => {
        e.stopPropagation();
        Call(onClick, e);
      }}
      className={classes}
    >
      {children}
    </DropContainerWrapper>
  );
};

export default DropContainer;
