import React from 'react';
import { Button } from '@infra/ui';

import { EditButton } from "./PageMetadataEditor/EditButton";

interface ToolbarCustomProps {
  onReleasePage?: () => void
}

const ToolbarCustom: React.FC<ToolbarCustomProps> = ({
  onReleasePage,
}) => {
  return (
    <div>
      <div className="p10">
        <EditButton
          hola
          className="mr10"
          onOK={(e) => {}}
          onCancel={(e) => {}}
        >
          页面配置
        </EditButton>
        <Button
          hola
          className="mr10"
          onClick={(e) => {
          }}
        >
          PC 预览
        </Button>
        <Button
          hola
          className="mr10"
          onClick={(e) => {
          }}
        >
          手机预览
        </Button>
        <Button
          className="mr10"
          onClick={(e) => {
            onReleasePage && onReleasePage();
          }}
        >
          保存
        </Button>
        <Button
          className="mr10"
        >
          返回
        </Button>
      </div>
    </div>
  );
};

export default ToolbarCustom;
