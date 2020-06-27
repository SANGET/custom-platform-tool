import React from 'react';
import { useDrag } from 'react-dnd';
import { ItemTypes } from './types';

export interface DragItemProps {
  children: any;
  entity: any;
}

const DragItem = ({
  children, entity, ...other
}: DragItemProps) => {
  const [collectedPropsForDrag, drag] = useDrag({
    item: {
      entity,
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
