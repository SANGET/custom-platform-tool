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
    <div className="flex items-center px-2" style={{ height: '100%' }}>
      <span className="text-gray-500">新手教程，敬请期待</span>
      <span className="flex"></span>
      {/* <EditButton
          className="mr10"
          onOK={(e) => {}}
          onCancel={(e) => {}}
        >
          页面配置
        </EditButton> */}
      <Button
        hola
        color="default"
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
        color="default"
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
        onClick={(e) => {
          onReleasePage && onReleasePage();
        }}
      >
          保存
      </Button>
      {/* <Button
          className="mr10"
        >
          返回
        </Button> */}
    </div>
  );
};

export default ToolbarCustom;
