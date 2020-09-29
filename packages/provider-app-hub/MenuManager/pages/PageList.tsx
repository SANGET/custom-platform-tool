import React, { useState, useEffect } from "react";
import { Link } from "multiple-page-routing";
import { Button, Table } from "antd";
import { ColumnsType } from "antd/lib/table";
import { CloseModal, ShowModal } from "@infra/ui";
import dayjs from "dayjs";
import { delMenuServices, getMenuListServices } from "../services/apis";
import { CreatePage } from "./CreatePage";

const getListColumns = ({
  onDel
}): ColumnsType => [
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
          {/* <Link
            params={{
              title: name,
              pageID: id
            }}
          >
            编辑
          </Link> */}
          <span
            className="link-btn ml10"
            onClick={(e) => {
              delMenuServices(id).then(() => {
                onDel();
              });
            }}
          >
            删除
          </span>
        </>
      );
    },
  },
];

type UseListData = () => [any[], () => void]

const mockData = {
  id: '123',
  name: '321'
};

const usePageList: UseListData = () => {
  const [listData, setListData] = useState([]);
  const getListData = () => {
    getMenuListServices().then((pageListRes) => {
      setListData(pageListRes?.result);
    });
  };
  useEffect(() => {
    getListData();
  }, []);
  return [listData, getListData];
};

const PageList: React.FC = (props) => {
  const [listData, getListData] = usePageList();
  const ListColumns = React.useMemo(() => {
    return getListColumns({
      onDel: () => {
        console.log('del');
        getListData();
      }
    });
  }, []);
  console.log(listData);
  return (
    <div className="container mx-auto">
      <div className="pu10">
        <Button
          onClick={(e) => {
          // console.log('asd');
            const modalID = ShowModal({
              title: '创建菜单',
              width: 700,
              children: () => {
                return (
                  <div className="p20">
                    <CreatePage
                      onSuccess={(e) => {
                        CloseModal(modalID);
                        getListData();
                      }}
                    />
                  </div>
                );
              }
            });
          }}
        >
        创建菜单
        </Button>
      </div>
      <Table
        dataSource={listData}
        rowKey={'id'}
        columns={ListColumns}
      />
    </div>
  );
};

export default PageList;
