import React from 'react';
import { Input, Table, ShowModal } from '@infra/ui';
import { TableEditor } from './TableEditor';

export const EditableTable = () => {
  return (
    <div>
      <span
        className="btn"
        onClick={(e) => {
          e.stopPropagation();
          ShowModal({
            title: '编辑表格',
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
        Edit
      </span>
      Editable table
    </div>
  );
};
