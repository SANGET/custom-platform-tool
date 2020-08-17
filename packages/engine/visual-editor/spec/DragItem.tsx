import React, { useState } from 'react';
import { useDrag } from 'react-dnd';
import { ItemTypes } from './types';

/**
 * 作用于 dragItem 传递到 drop 容器的参数配置
 */
export type DragItemConfig = any

export interface DragItemProps extends React.HTMLAttributes<HTMLDivElement> {
  children: any;
  dragItemClass: any;
  dragConfig?: DragItemConfig
}

/**
 * 拖拽容器
 */
const DragItem: React.FC<DragItemProps> = ({
  children, dragItemClass, dragConfig,
  ...other
}) => {
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
    <div
      {...other}
      ref={drag}
    >
      {children}
    </div>
  );
};

export default DragItem;
