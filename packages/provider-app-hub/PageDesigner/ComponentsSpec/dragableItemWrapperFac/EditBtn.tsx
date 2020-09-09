import React from 'react';
import { ShowModal } from '@infra/ui';
import TableEditor from '../CompClass/Table/TableEditor';

export const EditBtn = (props) => {
  return (
    <span
      className="default btn"
      onClick={(e) => {
        e.stopPropagation();
        ShowModal({
          title: '编辑表格',
          width: `80vw`,
          children: () => {
            return (
              <TableEditor
                onChange={(value) => {
                  console.log(value);
                }}
              />
            );
          }
        });
      }}
    >
      编辑
    </span>
  );
};
