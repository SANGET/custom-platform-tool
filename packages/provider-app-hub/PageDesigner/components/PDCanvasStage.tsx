import React from 'react';
import CanvasStage from '@engine/visual-editor/components/CanvasStage';
import { PDdragableItemWrapperFac } from './PDDragableItemWrapperFac';

const PDCanvasStage = (props) => {
  return (
    <div>
      <CanvasStage
        dragableItemWrapper={PDdragableItemWrapperFac}
        {...props}
      />
    </div>
  );
};

export default PDCanvasStage;
