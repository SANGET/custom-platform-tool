import React from 'react';
import { useDrag } from 'react-dnd';
import { ItemTypes } from './types';

export interface DragItemProps {
  children: any;
  entityClass: any;
}

const DragItem = ({
  children, entityClass, ...other
}: DragItemProps) => {
  const [{ isDragging }, drag] = useDrag({
    item: {
      entityClass,
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
