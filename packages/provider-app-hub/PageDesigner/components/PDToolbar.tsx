import React from 'react';
import { Button, ShowModal } from '@infra/ui';
import { getPreviewUrl } from '@provider-app/config/getPreviewUrl';

import { EditButton } from "./PDPageMetadataEditor/EditButton";

interface ToolbarCustomProps {
  onReleasePage?: () => void
}

const ToolbarCustom: React.FC<ToolbarCustomProps> = ({
  onReleasePage,
  location
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
            ShowModal({
              title: 'PC 预览',
              modalType: 'side',
              position: 'bottom',
              maxHeightable: false,
              children: () => {
                const previewUrl = getPreviewUrl(location);
                return (
                  <div style={{
                    height: '90vh'
                  }}
                  >
                    <iframe src={previewUrl} width="100%" height="100%" frameBorder="0" />
                  </div>
                );
              }
            });
          }}
        >
          PC 预览
        </Button>
        <Button
          hola
          className="mr10"
          onClick={(e) => {
            ShowModal({
              title: 'Mobile 预览',
              width: 500,
              children: () => {
                const previewUrl = getPreviewUrl(location);
                return (
                  <div style={{
                    height: '70vh',
                  }}
                  >
                    <iframe src={previewUrl} width="100%" height="100%" frameBorder="0" />
                  </div>
                );
              }
            });
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
