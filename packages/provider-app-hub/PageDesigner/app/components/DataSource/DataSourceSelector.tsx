import React from 'react';
import { CloseModal, ShowModal } from '@infra/ui';
import { DataSourceBinder } from "./DataSourceBinder";

export const DataSourceSelector = ({
  onAddDataSource,
  datasources
}) => {
  return (
    <div>
      数据源
      <span
        onClick={(e) => {
          const modalID = ShowModal({
            title: '添加数据源',
            children: () => {
              return (
                <DataSourceBinder
                  bindedDataSources={datasources}
                  onSubmit={(submitData) => {
                    // console.log(submitData);
                    onAddDataSource(submitData);
                    CloseModal(modalID);
                  }}
                />
              );
            }
          });
        }}
      >
        +
      </span>
    </div>
  );
};
