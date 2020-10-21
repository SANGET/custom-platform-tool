import React from 'react';
import { CloseModal, ShowModal } from '@infra/ui';
import { PlusOutlined } from '@ant-design/icons';
import { DataSourceBinder } from "./DataSourceBinder";

export const DataSourceSelector = ({
  onAddDataSource,
  interDatasources
}) => {
  return (
    <div className="flex items-center">
      <span>
        数据源
      </span>
      <PlusOutlined
        onClick={(e) => {
          const modalID = ShowModal({
            title: '添加数据源',
            children: () => {
              return (
                <DataSourceBinder
                  bindedDataSources={interDatasources}
                  onSubmit={(submitData) => {
                    console.log(submitData);
                    onAddDataSource(submitData);
                    CloseModal(modalID);
                  }}
                />
              );
            }
          });
        }}
      />
    </div>
  );
};
