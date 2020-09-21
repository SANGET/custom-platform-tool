import React from 'react';
import CanvasStage from '@engine/visual-editor/components/CanvasStage';
import { dragableItemWrapperFac } from '../register-comp/Renderer/dragableItemWrapperFac';

const CanvasStageCustom = (props) => {
  return (
    <div style={{ height: '100%' }}>
      <CanvasStage
        dragableItemWrapper={dragableItemWrapperFac}
        {...props}
      />
    </div>
  );
};

export default CanvasStageCustom;
