import React, { useState } from 'react';
import styled from 'styled-components';
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

const DragItemWrapper = styled.div`
  position: relative;
  padding: 0.1px;
  &.overing {
    box-shadow: 0 0 1px 1px rgba(30,89,251, 0.5);
  }
`;

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
    <DragItemWrapper
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
    </DragItemWrapper>
  );
};

export default DragItemInCanvas;
