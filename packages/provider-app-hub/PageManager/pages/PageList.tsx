import React, { useState, useEffect } from "react";
import { Link } from "multiple-page-routing";
import { Button, Table } from "antd";
import { ShowModal } from "@infra/ui";
import { getPageListServices } from "../services/apis";
import { CreatePage } from "./CreatePage";

const columns = [
  {
    key: 'name',
    dataIndex: 'name',
    title: '页面名称'
  },
  {
    key: 'action',
    title: '操作',
    render: (text, { id, name }) => {
      return (
        <Link
          to={`/page-designer?${id}`}
          params={{
            title: name,
            /** 必须要的页面 id */
            pageID: id
          }}
        >
          编辑
        </Link>
      );
    },
  },
];

const PageList: React.FC = (props) => {
  const [pageList, setPageList] = useState([]);
  useEffect(() => {
    getPageListServices().then((pageListRes) => {
      setPageList(pageListRes?.result?.data);
    });
  }, []);

  return (
    <div className="p20">
      <div className="pu10">
        <Button
          onClick={(e) => {
          // console.log('asd');
            ShowModal({
              title: '创建页面',
              width: 700,
              children: () => {
                return (
                  <div className="p20">
                    <CreatePage />
                  </div>
                );
              }
            });
          }}
        >
        创建页面
        </Button>
      </div>
      <Table
        dataSource={pageList}
        rowKey={'id'}
        columns={columns}
      />
    </div>
  );
};

export default PageList;
