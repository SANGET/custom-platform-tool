import React from 'react';
import { ShowModal } from '@infra/ui';

export interface EditBtnProps {
  editorRenderer: (modalOptions) => JSX.Element
}

export const EditBtn: React.FC<EditBtnProps> = ({
  editorRenderer,
}) => {
  return (
    <span
      className="default btn"
      onClick={(e) => {
        e.stopPropagation();
        ShowModal({
          title: '编辑表格',
          width: `80vw`,
          children: (modalOptions) => editorRenderer(modalOptions)
        });
      }}
    >
      编辑
    </span>
  );
};
