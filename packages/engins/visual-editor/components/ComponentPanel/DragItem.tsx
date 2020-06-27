import React from 'react';
import { useDrag } from 'react-dnd';
import { ItemTypes } from './types';

const DragItem = ({
  children, item, ...other
}) => {
  const [collectedPropsForDrag, drag] = useDrag({
    item: {
      originItem: item,
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
