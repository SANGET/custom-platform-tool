import React from 'react';
import CanvasStage from '@engine/visual-editor/components/CanvasStage';
import { dragableItemWrapperFac } from '../../ComponentsSpec/dragableItemWrapperFac';

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
