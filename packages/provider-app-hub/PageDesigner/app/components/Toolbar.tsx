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
    <Toolbar {...otherProps} />
  );
};

export default ToolbarCustom;
