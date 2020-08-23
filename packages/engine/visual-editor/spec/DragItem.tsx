import React, { useState, useRef } from 'react';
import {
  useDrag, useDrop, DropTargetMonitor, XYCoord
} from 'react-dnd';
import { TargetType } from 'dnd-core';
import { HasValue } from '@mini-code/base-func';
import { ItemTypes } from './types';
import { DragItemClass, DropCollectType } from '../types';
import { isNodeInChild } from '../utils';

/**
 * DnD 的回调的 context
 */
export interface DnDContext {
  id: string
  idx: number
}

export type DragItemDrop = (entity, dnDContext: DnDContext) => void
export type DragItemDrag = (entity, dnDContext: DnDContext) => void
export type DragItemMove = (dragIndex: number, hoverIndex: number, compClass: any) => void
export type CancelDrag = (originalIndex: number) => void

/**
 * 作用于 dragItem 传递到 drop 容器的参数配置
 */
interface DragItem {
  index?: number
  type: string
}

/**
 * 可拖拽的 item 的 actions
 */
export interface DragItemActions {
  onDrop?: DragItemDrop
  /** 响应组件的“拖”事件 */
  onDrag?: DragItemDrag
  onMove?: DragItemMove
}

export interface DragItemProps<
  D = any, C = any
> extends DragItem,
  DragItemActions,
  Omit<React.HTMLAttributes<HTMLDivElement>, keyof DragItemActions | 'children'> {
  children: any
  dragItemClass: D
  dragConfig?: C
  accept?: TargetType
}

/**
 * 拖拽容器
 */
const DragItemComp: React.FC<DragItemProps> = ({
  children, dragItemClass, dragConfig, style,
  type, id, index, onMove, onDrop, onDrag,
  accept = [ItemTypes.DragItemEntity, ItemTypes.DragItemClass],
  ...other
}) => {
  const ref = useRef<HTMLDivElement>(null);

  const [{
    isOverCurrent,
    canDrop
  }, drop] = useDrop<DragItemClass, void, DropCollectType>({
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
          if (!isNodeInChildRes && onDrop) {
            onDrop({ ...componentClass }, { id, index });
          }
        });
      }
    },
    // canDrop: ({ dragItemClass: componentClass }, monitor) => {
    //   /** 不允许放到自身 */
    //   return componentClass.id !== id;
    // },
    collect: (monitor) => {
      return {
        // isOver: !!monitor.isOver(),
        isOver: monitor.isOver(),
        isOverCurrent: monitor.isOver({ shallow: true }),
        canDrop: monitor.canDrop(),
      };
    },
    hover: (item: DragItem, monitor: DropTargetMonitor) => {
      if (!ref.current || !onMove || !HasValue(index)) {
        return;
      }
      const dragIndex = item.index;
      const hoverIndex = index;

      // Don't replace items with themselves
      if (dragIndex === hoverIndex) {
        return;
      }

      // Determine rectangle on screen
      const hoverBoundingRect = ref.current?.getBoundingClientRect();

      // Get vertical middle
      const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;

      // Determine mouse position
      const clientOffset = monitor.getClientOffset();

      // Get pixels to the top
      const hoverClientY = (clientOffset as XYCoord).y - hoverBoundingRect.top;

      // Only perform the move when the mouse has crossed half of the items height
      // When dragging downwards, only move when the cursor is below 50%
      // When dragging upwards, only move when the cursor is above 50%

      // Dragging downwards
      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return;
      }

      // Dragging upwards
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return;
      }

      // Time to actually perform the action
      onMove && onMove(dragIndex, hoverIndex, item);

      // Note: we're mutating the monitor item here!
      // Generally it's better to avoid mutations,
      // but it's good here for the sake of performance
      // to avoid expensive index searches.
      // eslint-disable-next-line no-param-reassign
      item.index = hoverIndex;
    },
  });

  const [{ isDragging }, drag] = useDrag({
    item: {
      dragConfig,
      dragItemClass,
      type,
      id,
      index,
    },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  });

  const opacity = isDragging ? 0.5 : 1;
  // drag(ref);
  drag(drop(ref));

  return (
    <div
      {...other}
      style={Object.assign({}, style, {
        opacity
      })}
      ref={ref}
    >
      {children}
    </div>
  );
};

export default DragItemComp;
