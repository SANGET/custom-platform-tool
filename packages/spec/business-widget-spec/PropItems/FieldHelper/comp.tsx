import React, { useState } from 'react';
import classnames from 'classnames';
import { Button } from '@infra/ui';

/**
 * 已选中的字段
 */
export interface SelectedField {
  column?: PD.Column
  tableInfo?: {
    id: string
    name: string
    type: string
  }
}

/**
 * 字段选择器的 props
 */
interface FieldSelectorProps {
  defaultSelected?: SelectedField
  interDatasources: PD.Datasources
  onSubmit: (col: SelectedField) => void
}

/**
 * 字段选择器
 * @param param0
 */
export const FieldSelector: React.FC<FieldSelectorProps> = ({
  defaultSelected = {
    column: undefined,
    tableInfo: undefined
  },
  interDatasources,
  onSubmit
}) => {
  const [selectColInfo, setSelectCol] = useState<SelectedField>(defaultSelected);
  return (
    <div className="field-selector p-5">
      <div className="flex">
        {
          interDatasources.map((datasourceItem) => {
            const {
              id,
              name, type,
              columns,
            } = datasourceItem;

            return (
              <div className="group p-2" key={id}>
                <div className="title font-bold text-md">{name}</div>
                <div className="list p-2">
                  {
                    columns.map((col) => {
                      const { id: colID, name: colName } = col;
                      const isSelected = selectColInfo?.column?.id === colID;
                      const colItemClassname = classnames([
                        'col-item',
                        'cursor-pointer',
                        isSelected ? 'text-red-600' : 'text-gray-600'
                      ]);
                      return (
                        <div
                          onClick={(e) => {
                            setSelectCol({
                              column: col,
                              tableInfo: {
                                id,
                                name,
                                type,
                              }
                            });
                          }}
                          className={colItemClassname}
                          key={colID}
                        >
                          {colName}
                        </div>
                      );
                    })
                  }
                </div>
              </div>
            );
          })
        }
      </div>
      <Button
        onClick={(e) => {
          selectColInfo && onSubmit?.(selectColInfo);
        }}
      >
        确定选择
      </Button>
    </div>
  );
};
