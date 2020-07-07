import React from 'react';
import { useDrag } from 'react-dnd';
import { ItemTypes } from './types';

/**
 * 作用于 dragItem 传递到 drop 容器的参数配置
 */
export type DragItemConfig = {}

export interface DragItemProps {
  children: any;
  dragItemClass: any;
  dragConfig?: DragItemConfig
}

/**
 * 拖拽容器
 */
const DragItem = ({
  children, dragItemClass, dragConfig, ...other
}: DragItemProps) => {
  const [{ isDragging }, drag] = useDrag({
    item: {
      dragConfig,
      dragItemClass,
      type: ItemTypes.DragComponent
    },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  });
  return (
    <div {...other} ref={drag}>
      {children}
    </div>
  );
};

export default DragItem;
