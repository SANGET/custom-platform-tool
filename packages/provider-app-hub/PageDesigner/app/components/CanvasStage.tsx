import React from 'react';
import CanvasStage from '@engine/visual-editor/components/CanvasStage';

const CanvasStageCustom = (props) => {
  return (
    <div style={{ height: '100%' }}>
      <CanvasStage {...props} />
    </div>
  );
};

export default CanvasStageCustom;
