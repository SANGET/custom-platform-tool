import React, { useState } from 'react';
import { Call } from '@mini-code/base-func';
import classnames from 'classnames';
import DragItem, { DragItemProps } from '../DragItem';

/**
 * 作用于 dragItem 传递到 drop 容器的参数配置
 */
export type DragItemConfig = any

export interface DragItemInCanvasProps extends DragItemProps {
  children: any;
}

/**
 * 拖拽容器
 */
const DragItemInCanvas: React.FC<DragItemInCanvasProps> = ({
  children, className,
  onMouseEnter, onMouseLeave,
  ...propForDragItem
}) => {
  const [overing, setOvering] = useState(false);
  const classes = classnames(
    className,
    'drag-item',
    overing && 'overing'
  );
  return (
    <div
      onMouseEnter={(e) => {
        setOvering(true);
        Call(onMouseEnter, e);
      }}
      onMouseLeave={(e) => {
        setOvering(false);
        Call(onMouseLeave, e);
      }}
      className={classes}
    >
      <DragItem {...propForDragItem}>
        {children}
      </DragItem>
    </div>
  );
};

export default DragItemInCanvas;
