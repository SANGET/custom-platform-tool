import React from 'react';
import { Button, ShowModal } from '@infra/ui';
import { getPreviewUrl } from '@provider-app/config/getPreviewUrl';

import { previewAppService } from '@provider-app/services';
import { EditButton } from "./PDPageMetadataEditor/EditButton";

const ReleaseBtn = ({
  onReleasePage
}: ToolbarCustomProps) => {
  const [loading, setLoading] = React.useState(false);
  return (
    <Button
      loading={loading}
      onClick={(e) => {
        setLoading(true);
        onReleasePage?.().finally(() => {
          setTimeout(() => setLoading(false), 800);
        });
      }}
    >
      保存
    </Button>
  );
};

interface ToolbarCustomProps {
  onReleasePage?: () => Promise<unknown>
  appLocation
}

const ToolbarCustom: React.FC<ToolbarCustomProps> = ({
  onReleasePage,
  appLocation
}) => {
  const previewUrl = getPreviewUrl(appLocation);
  return (
    <div className="flex items-center px-2" style={{ height: '100%' }}>
      <span className="text-gray-500">新手教程制作中，敬请期待</span>
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
          // $R_P.get('/manage/v1/application/preview/')
          previewAppService('1319181529431285760');
          ShowModal({
            title: `PC 预览 ${previewUrl}`,
            modalType: 'side',
            position: 'bottom',
            maxHeightable: false,
            children: () => {
              const previewUrl = getPreviewUrl(appLocation);
              console.log(previewUrl);
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
              const previewUrl = getPreviewUrl(appLocation);
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
      <ReleaseBtn onReleasePage={onReleasePage} />
      {/* <Button
          className="mr10"
        >
          返回
        </Button> */}
    </div>
  );
};

export default ToolbarCustom;
