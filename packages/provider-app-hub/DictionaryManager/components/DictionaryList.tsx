import React, { useState, useEffect, useReducer } from "react";
import { Link } from "multiple-page-routing";
import {
  Button, Table, Form, Input
} from "antd";
import { ColumnsType } from "antd/lib/table";
import { CloseModal, ShowModal } from "@infra/ui";
import dayjs from "dayjs";
import {
  delDictionaryServices, getDictionaryListServices, getListOfDictionaryServices, getListOfDictionaryChildServices, delChildOfDictionaryServices
} from "../services/apis";
import { CreateDictionary } from "./CreateDictionary";

const getChildListColumns = ({
  onDel, dictionaryId
}): ColumnsType => [
  {
    key: 'index',
    dataIndex: 'index',
    title: '序号'
  },
  {
    key: 'code',
    dataIndex: 'code',
    title: '编码'
  },
  {
    key: 'name',
    dataIndex: 'name',
    title: '名称',
    className: 'no-padding',
    render: (text, record) => {
      return <div style={{ color: record.renderFontColor, backgroundColor: record.renderBgColor }}>{text}</div>;
    }
  },
  {
    key: 'sort',
    dataIndex: 'sort',
    title: '排序',
    render: (text) => text || '--'
  },
  {
    key: 'action',
    title: '',
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
            配置子项
          </Link>
          <span
            className="link-btn ml10"
            onClick={(e) => {
              delChildOfDictionaryServices({ dictionaryId, pid: id }).then((canIDelete) => {
                canIDelete && onDel();
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
type UseChildsListData = (any) => [any[], (param: any) => void]
const mockListOfDictionary = {
  id: "1297784696196964352",
  createdBy: "1295915065878388737",
  gmtCreate: 1598250957000,
  modifiedBy: "1295915065878388737",
  gmtModified: 1598250957000,
  code: "0",
  name: "建筑物",
  pid: null,
  renderBgColor: "#fff",
  renderFontColor: "#fff",
  sort: "1",
  level: 1,
  path: "1297784696196964352",
  hasChild: true
};
const useListOfDictionary: UseChildsListData = (param) => {
  const { pindex, id } = param;
  const [dictionaryChildList, setDictionaryChildList] = useReducer((state, action) => {
    switch (action.type) {
      case 'setListOfDictionary':
        return action.name.map((item, index) => {
          item.index = `${pindex + 1}.${index + 1}`;
          return item;
        });
      case 'setListOfDictionaryChild':
        const tmpl = JSON.parse(JSON.stringify(state));
        /** id 匹配的数据才进行children并入 */
        return tmpl.map((item1) => {
          if (item1.id in action.name) {
            item1.children = action.name[item1.id].map((item2, index) => {
              item2.index = `${item1.index}.${index + 1}`;
              return item2;
            });
          }
          return item1;
        });
    }
  }, [mockListOfDictionary]);
  const getListData = (requestParam) => {
    getListOfDictionaryServices(requestParam).then((dictionaryListRes) => {
      setDictionaryChildList({
        type: 'setListOfDictionary',
        name: dictionaryListRes.map((item) => {
          if (item.hasChild) {
            item.children = [];
          }
          return item;
        })
      });
    });
  };
  useEffect(() => {
    getListData({ id });
  }, []);
  return [dictionaryChildList, setDictionaryChildList];
};
const DictionaryChildren: React.FC = (props) => {
  const { id, pindex, handleSearch } = props;
  const [childList, setChildList] = useListOfDictionary({ id, pindex });
  const ListColumns = React.useMemo(() => {
    return getChildListColumns({
      dictionaryId: id,
      onDel: () => {
        console.log('del');
        handleSearch({});
      }
    });
  }, []);
  return (
    <Table
      dataSource={childList}
      rowKey={'id'}
      columns={ListColumns}
      pagination = {false}
      expandable = {{
        onExpand: (expanded, record) => {
          if (!expanded) return;
          getListOfDictionaryChildServices({ dictionaryId: id, pid: record.id }).then((list) => {
            setChildList({
              type: 'setListOfDictionaryChild',
              name: { [record.id]: list }
            });
          });
        }
      }}
    />
  );
};

type UseListData = (any) => [{list: any[], total: number}, (param: any) => void]

const mockDictionary = {
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

const useDictionaryList: UseListData = (param) => {
  const [dictionaryList, setDictionaryList] = useState({ list: [mockDictionary], total: 1 });
  const getListData = (paramTmpl) => {
    const {
      name, description, offset, size
    } = paramTmpl;
    const requestParam = { offset, size };
    name && Object.assign(requestParam, { name });
    description && Object.assign(requestParam, { description });
    getDictionaryListServices(requestParam).then((dictionaryListRes) => {
      setDictionaryList({
        list: dictionaryListRes?.data,
        total: dictionaryListRes?.total
      });
    });
  };
  useEffect(() => {
    getListData(param);
  }, []);
  return [dictionaryList, getListData];
};
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
              delDictionaryServices(id).then((canIDelete) => {
                canIDelete && onDel();
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
const DictionaryList: React.FC = (props) => {
  const [page, setPage] = useState({ size: 10, offset: 0 });
  const [dictionaryList, getListData] = useDictionaryList(page);
  const [form] = Form.useForm();
  const ListColumns = React.useMemo(() => {
    return getListColumns({
      onDel: () => {
        console.log('del');
        handleSearch({});
      }
    });
  }, []);
  /** 搜索工程， 可接受 offset（从0开始）, size */
  const handleSearch = (pageParam) => {
    debugger;
    const dataParam = form.getFieldsValue(['name', 'description']);
    getListData({ ...dataParam, ...pageParam });
  };
  /** 更换页码或更换每页行数 */
  const handleChangePage = (offset, size) => {
    setPage({ offset: offset - 1, size });
    handleSearch({ offset: offset - 1, size });
  };
  return (
    <div className="page-list-data">
      <Form form={form} className="flex">
        <Form.Item
          label="字典名称"
          name="name"
          className="flex-1"
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="字典描述"
          name="description"
          className="flex-1"
        >
          <Input />
        </Form.Item>
        <Form.Item className="flex-1">
          <Button
            type="primary"
            className="float-right"
            onClick={(e) => {
              form.resetFields();
              handleChangePage(1, page.size);
            }}
          > 清空</Button>
          <Button
            type="primary"
            className="float-right mr10"
            onClick={(e) => {
              handleSearch({});
            }}
          > 搜索</Button>
        </Form.Item>
      </Form>
      <div className="float-right">
        <Button
          type = "primary"
          onClick={(e) => {
            const modalID = ShowModal({
              title: '新增字典',
              width: 700,
              children: () => {
                return (
                  <div className="p20">
                    <CreateDictionary
                      onSuccess={() => {
                        CloseModal(modalID);
                        handleSearch({});
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
        dataSource={dictionaryList.list}
        rowKey={'id'}
        columns={ListColumns}
        expandable={{
          rowExpandable: (record) => !record.showDictionaryChildren,
          expandedRowRender: (record, index) => <DictionaryChildren key = {record.id} id={record.id} pindex = {index} handleSearch = {handleSearch}/>
        }}
        pagination={{
          pageSizeOptions: ['10', '20', '30', '40', '50', '100'],
          showSizeChanger: true,
          total: dictionaryList.total,
          onChange: handleChangePage,
          current: page.offset + 1,
          onShowSizeChange: handleChangePage
        }}
      />
    </div>
  );
};

export default DictionaryList;
