import React, { useState, useEffect } from "react";
import { Link } from "multiple-page-routing";
import { Button, Table } from "antd";
import { ColumnsType } from "antd/lib/table";
import { CloseModal, ShowModal } from "@infra/ui";
import dayjs from "dayjs";
import { delDictionaryServices, getDictionaryListServices } from "../services/apis";
import { CreateDictionary } from "./CreateDictionary";

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
    title: '字典名称'
  },
  {
    key: 'description',
    dataIndex: 'description',
    title: '字典描述',
    render: (text) => text || '--'
  },
  {
    key: 'modifiedUserName',
    dataIndex: 'modifiedUserName',
    title: '最后修改人'
  },
  {
    key: 'gmtModified',
    dataIndex: 'gmtModified',
    title: '最后修改时间',
    render: (date) => dayjs(date).format('YYYY-MM-DD HH:mm:ss')
  },
  {
    key: 'action',
    title: '操作',
    render: (text, { id, name }) => {
      return (
        <>
          <Link
            to='/page-designer'
            pathExtend={id}
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
              delDictionaryServices(id).then(() => {
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
  createdUserName: null,
  modifiedUserName: "用户名",
  id: "1298450358628130816",
  createdBy: null,
  gmtCreate: 1598409664352,
  modifiedBy: "1295915065878388737",
  gmtModified: 1598409664352,
  code: "dict_nihaoty",
  name: "你好ty",
  description: "位置管理",
  items: []
};

const useDictionaryList: UseListData = () => {
  const [listData, setDictionaryList] = useState([mockData]);
  const getListData = () => {
    getDictionaryListServices().then((dictionaryListRes) => {
      setDictionaryList(dictionaryListRes?.result?.data);
    });
  };
  useEffect(() => {
    getListData();
  }, []);
  return [listData, getListData];
};

const DictionaryList: React.FC = (props) => {
  const [listData, getListData] = useDictionaryList();
  const ListColumns = React.useMemo(() => {
    return getListColumns({
      onDel: () => {
        console.log('del');
        getListData();
      }
    });
  }, []);
  return (
    <div className="page-list-data">
      <div className="float-left">字典列表</div>
      <div className="floa-right">
        <Button
          onClick={(e) => {
          // console.log('asd');
            const modalID = ShowModal({
              title: '新增字典',
              width: 700,
              children: () => {
                return (
                  <div className="p20">
                    <CreateDictionary
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
          新建
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

export default DictionaryList;
