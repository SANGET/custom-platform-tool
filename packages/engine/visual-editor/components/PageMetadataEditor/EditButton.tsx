import React from 'react';
import { Button, ShowModal } from '@infra/ui';
import { PageMetadataEditor } from './PageMetadataEditor';

const editPageMetadata = (onOK, onCancel) => {
  ShowModal({
    title: '编辑页面属性',
    children: () => {
      return (
        <PageMetadataEditor />
      );
    }
  });
};

export const EditButton = ({
  onOK, onCancel
}) => {
  return (
    <div>
      <Button
        onClick={() => editPageMetadata(onOK, onCancel)}
      >
          编辑页面属性
      </Button>
    </div>
  );
};
