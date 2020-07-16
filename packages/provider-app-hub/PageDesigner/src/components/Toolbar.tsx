import React from 'react';
import { Button } from '@infra/ui';

import Toolbar from '@engine/visual-editor/components/Toolbar';

interface ToolbarCustomProps {
  onReleasePage?: () => void
}

const ToolbarCustom = ({
  onReleasePage,
  ...otherProps
}) => {
  return (
    <div>
      <Button onClick={(e) => {
        onReleasePage && onReleasePage();
      }}
      >
        发布页面
      </Button>
      <Toolbar {...otherProps} />
    </div>
  );
};

export default ToolbarCustom;
