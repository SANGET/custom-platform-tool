import React, { useState, useEffect } from "react";
import { Link } from "multiple-page-routing";
import { Button, Table } from "antd";
import { ColumnsType } from "antd/lib/table";
import { CloseModal, ShowModal } from "@infra/ui";
import dayjs from "dayjs";
import { delPageServices, getPageListServices } from "../services/apis";
import { CreatePage } from "./CreatePage";

const pageTypeMenu = {
  2: '页面'
};

const pageListColumns: ColumnsType = [
  {
    key: 'index',
    dataIndex: 'index',
    title: '序号',
    render: (text, _, index) => index + 1
  },
  {
    key: 'name',
    dataIndex: 'name',
    title: '页面名称'
  },
  {
    key: 'type',
    dataIndex: 'type',
    title: '页面类型',
    render: (text) => pageTypeMenu[text]
  },
  {
    key: 'belongToMenuId',
    dataIndex: 'belongToMenuId',
    title: '归属模块'
  },
  {
    key: 'gmtCreate',
    dataIndex: 'gmtCreate',
    title: '创建时间',
    render: (date) => dayjs(date).format('YYYY-MM-DD HH:mm:ss')
  },
  {
    key: 'action',
    title: '操作',
    render: (text, { id, name }) => {
      return (
        <>
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
          <span
            className="link-btn ml10"
            onClick={(e) => {
              delPageServices(id);
            }}
          >
            删除
          </span>
        </>
      );
    },
  },
];

type UsePageList = () => [any[], () => void]

const usePageList: UsePageList = () => {
  const [pageList, setPageList] = useState([]);
  const getPageList = () => {
    getPageListServices().then((pageListRes) => {
      setPageList(pageListRes?.result?.data);
    });
  };
  useEffect(() => {
    getPageList();
  }, []);
  return [pageList, getPageList];
};

const PageList: React.FC = (props) => {
  const [pageList, getPageList] = usePageList();
  return (
    <div className="container mx-auto">
      <div className="pu10">
        <Button
          onClick={(e) => {
          // console.log('asd');
            const modalID = ShowModal({
              title: '创建页面',
              width: 700,
              children: () => {
                return (
                  <div className="p20">
                    <CreatePage
                      onSuccess={(e) => {
                        CloseModal(modalID);
                        getPageList();
                      }}
                    />
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
        columns={pageListColumns}
      />
    </div>
  );
};

export default PageList;
