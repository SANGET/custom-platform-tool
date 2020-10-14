import React, { useState, useEffect, useReducer } from "react";
import {
  Button, Table, Form, Input, ConfigProvider, Col
} from "antd";
import zhCN from 'antd/es/locale/zh_CN'; // 引入中文包
import { ColumnsType } from "antd/lib/table";
import dayjs from "dayjs";
import { ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons';
import lodash from 'lodash';
import CreateModal from "./CreateModal";
import {
  delDictionaryServices, getDictionaryListServices, getListOfDictionaryServices, getListOfDictionaryChildServices, delChildOfDictionaryServices,
  postDictionary, editDictionary, editChildOfDictionary, moveChildOfDictionary
} from "../services/apiAgents";
import CreateDictionary from "./CreateDictionary";

/** 过滤弹窗返回的数据 */
const filterParamFromModal = (modalParam) => {
  const { dictName, dictDescription, children } = modalParam;
  return {
    name: dictName,
    description: dictDescription,
    items: children.map((item) => {
      const {
        name, code, id, renderBgColor, renderFontColor
      } = item;
      return {
        name, code, id, renderBgColor, renderFontColor
      };
    })
  };
};
/** 字典子项的字段配置 */
const getChildListColumns = ({
  refreshTable, dictionaryId, setModalConfig, childList, setChildList
}): ColumnsType => [
  {
    key: 'decorativeIndex',
    dataIndex: 'decorativeIndex',
    title: '序号',
    width: 210,
    ellipsis: { showTitle: true },
    render: (text) => text.split('.').map((item) => item - 0 + 1).join('.')
  },
  {
    key: 'code',
    dataIndex: 'code',
    title: '编码',
    ellipsis: { showTitle: true },
    width: 200
  },
  {
    key: 'name',
    dataIndex: 'name',
    title: '名称',
    className: 'no-padding',
    ellipsis: { showTitle: true },
    render: (text, record) => {
      return <div className="ellipsis" style={{ color: record.renderFontColor, backgroundColor: record.renderBgColor }}>{text}</div>;
    }
  },
  {
    key: 'sort',
    dataIndex: 'sort',
    title: '排序',
    width: 80,
    ellipsis: { showTitle: true },
    render: (text) => text || '--'
  },
  {
    key: 'action',
    title: '操作',
    width: 200,
    render: (text, record, index) => {
      const {
        id, length, sort, decorativeIndex, decorativeId
      } = record;
      return (
        <div className="child-operation">
          {index !== 0 ? (<ArrowUpOutlined
            style={{ color: '#488CF0', fontSize: '14px' }}
            onClick={(e) => {
              moveChildOfDictionary({
                dictionaryId,
                items: [{ id, sort: childList[index - 1].sort }, { id: childList[index - 1].id, sort }]
              }).then((canIMove) => {
                canIMove && refreshTable([decorativeId, childList[index - 1].decorativeId]);
              });
            }}
            className="link-btn"
          />) : null}
          {index !== length - 1 ? (<ArrowDownOutlined
            style={{ color: '#488CF0', fontSize: '14px' }}
            className="link-btn"
            onClick={(e) => {
              moveChildOfDictionary({
                dictionaryId,
                items: [{ id, sort: childList[index + 1].sort }, { id: childList[index + 1].id, sort }]
              }).then((canIMove) => {
                canIMove && refreshTable([decorativeId, childList[index + 1].decorativeId]);
              });
            }}
          />) : null}
          {decorativeIndex.split('.').length < 6 ? (<span
            className="link-btn"
            onClick={(e) => {
              /** 获取对应子项列表数据，传递给弹窗展示 */
              getListOfDictionaryChildServices({ dictionaryId, pid: id }).then((childListOfChild) => {
                const idTmpl = `${new Date().valueOf()}`;
                setModalConfig({
                  type: 'changeSome',
                  name: {
                    modalVisible: true,
                    modalTitle: '配置子项',
                    /** 配置子项不需要展示字典名称和字典描述 */
                    showDictionaryConfig: false,
                    operateParam: {
                      childList: childListOfChild.length !== 0 ? childListOfChild
                        : [{
                          editable: true, id: idTmpl, renderBgColor: '#fff', renderFontColor: '#000'
                        }],

                      editingKeyFirst: childListOfChild.length === 0 && idTmpl
                    },
                    handleAft: (paramFromModal) => {
                      const { items } = filterParamFromModal(paramFromModal);
                      /** 保存数据并刷新子项列表 */
                      editChildOfDictionary({ items, dictionaryId, pid: id }).then((canIEdit) => {
                        if (!canIEdit) return;
                        setModalConfig({ type: 'changeSome', name: { modalVisible: false } });
                        refreshTable([decorativeId]);
                        const previousChildList = childList.slice();
                        previousChildList[index] = { ...previousChildList[index], children: [] };
                        setChildList({
                          type: 'setListOfDictionaryPure',
                          name: previousChildList
                        });
                      });
                    }
                  }
                });
              });
            }}
          >
            配置子项
          </span>) : null}
          {decorativeIndex.split('.').length < 6 ? (<span
            className="link-btn"
            onClick={(e) => {
              delChildOfDictionaryServices({ dictionaryId, pid: id }).then((canIDelete) => {
                /** 删除成功后需要刷新子项列表 */
                canIDelete && refreshTable([decorativeId]);
              });
            }}
          >
            删除子项
          </span>) : null}
        </div>
      );
    },
  },
];
type UseChildsListData = (any) => [any[], (param: any) => void, (param: any) => void]

/** 子项列表默认展示数据 */
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
/** 子项列表数据的数据操做 */
const useListOfDictionary: UseChildsListData = (param) => {
  const { pindex, id, gmtModified } = param;
  const [dictionaryChildList, setDictionaryChildList] = useReducer((state, action) => {
    switch (action.type) {
      case 'setListOfDictionary':
        const { length } = action.name;
        return action.name.map((item, index) => {
          item.length = length;
          item.decorativeIndex = `${pindex}.${index}`;
          item.decorativeId = `${id}.${item.id}`;
          return item;
        });
      case 'setListOfDictionaryPure':
        return action.name;
      case 'setListOfDictionaryChild':
        const tmpl = JSON.parse(JSON.stringify(state));
        /** id 匹配的数据才进行children并入 */
        for (const decorativeIndex in action.name) {
          /** 字典子项需要先去掉字典项的索引 */
          const originalIndexs = lodash.drop(decorativeIndex.split('.'));
          /** 变更为访问路径 */
          const prefixPath = originalIndexs.join('.children.');
          const tailPath = 'children';
          /** 需要挂载的上级 */
          const parent = lodash.get(tmpl, prefixPath, {});
          const parentDecorativeId = parent.decorativeId;
          /** 数据长度 */
          const lengthCurrent = action.name[decorativeIndex].length;
          parent[tailPath] = action.name[decorativeIndex].map((item, index) => {
            item.length = lengthCurrent;
            item.decorativeIndex = `${decorativeIndex}.${index}`;
            item.decorativeId = `${parentDecorativeId}.${item.id}`;
            return item;
          });
        }
        return tmpl;
    }
    return state;
  }, []);
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
  }, [gmtModified]);
  return [dictionaryChildList, setDictionaryChildList, getListData];
};
/** 子项列表控件 */
const DictionaryChildren: React.FC = (props) => {
  const {
    id, pindex, setModalConfig, gmtModified, expandedDictionaryChildKeys, setExpandedDictionaryChildKeys
  } = props;
  const [childList, setChildList, getListData] = useListOfDictionary({ id, pindex, gmtModified });
  const ListColumns = React.useMemo(() => {
    return getChildListColumns({
      childList,
      setModalConfig,
      setChildList,
      refreshTable: (unExpandKeys) => {
        // getListData({ id });
        const newExpandedDictionaryChildKeys = unExpandKeys.reduce((arr, unExpandedKey) => {
          return arr.filter((expandedKey) => !expandedKey.includes(unExpandedKey));
        }, expandedDictionaryChildKeys);
        setExpandedDictionaryChildKeys(newExpandedDictionaryChildKeys);
      },
      dictionaryId: id,
    });
  }, [childList]);
  return (
    <Table
      className="dictionary-children"
      dataSource={childList}
      rowKey={'decorativeId'}
      columns={ListColumns}
      pagination = {false}
      expandable = {{
        defaultExpandedRowKeys: [],
        expandedRowKeys: expandedDictionaryChildKeys,
        indentSize: 10,
        onExpand: (expanded, record) => {
          if (!expanded) {
            setExpandedDictionaryChildKeys(lodash.without(expandedDictionaryChildKeys, record.decorativeId));
            return;
          }
          setExpandedDictionaryChildKeys([...expandedDictionaryChildKeys, record.decorativeId]);
          getListOfDictionaryChildServices({ dictionaryId: id, pid: record.id }).then((list) => {
            setChildList({
              type: 'setListOfDictionaryChild',
              name: {
                [record.decorativeIndex]: list.map((item) => {
                  if (item.hasChild) {
                    item.children = [];
                  }
                  return item;
                })
              }
            });
          });
        }
      }}
    />
  );
};

interface Idictionary {
  name: string
  id: string
  description?: string
  modifiedUserName: string
  gmtModified: number
}
type UseListData = (any) => [{
  list: Idictionary[],
  total: number},
(param: any) => void]

/** 字典列表 mock 数据 */
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

/** 字典列表数据的数据操作 */
const useDictionaryList: UseListData = (param) => {
  const [dictionaryList, setDictionaryList] = useState<{list: Idictionary[], total: number}>({ list: [mockDictionary], total: 1 });
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

/** 字典列表的字段配置 */
const getListColumns = ({
  refreshTable, setModalConfig, dictionaryConfig
}): ColumnsType => [
  {
    key: 'index',
    width: 80,
    dataIndex: 'index',
    title: '序号',
    ellipsis: { showTitle: true },
    render: (text, _, index) => index + 1
  },
  {
    key: 'name',
    dataIndex: 'name',
    title: '字典名称',
    width: 200,
    render: (text) => text || '--',
    ellipsis: { showTitle: true },
  },
  {
    key: 'description',
    dataIndex: 'description',
    title: '字典描述',
    width: 200,
    render: (text) => text || '--',
    ellipsis: { showTitle: true },
  },
  {
    key: 'modifiedUserName',
    dataIndex: 'modifiedUserName',
    width: 160,
    title: '最后修改人',
    render: (text) => text || '--',
    ellipsis: { showTitle: true },
  },
  {
    key: 'gmtModified',
    dataIndex: 'gmtModified',
    title: '最后修改时间',
    width: 180,
    ellipsis: { showTitle: true },
    render: (date) => dayjs(date).format('YYYY-MM-DD HH:mm:ss')
  },
  {
    key: 'action',
    title: '操作',
    width: 120,
    render: (text, record) => {
      const { id, name, description } = record;
      return (
        <>
          <span
            className="link-btn"
            onClick={(e) => {
              getListOfDictionaryServices({ id }).then((childList) => {
                setModalConfig({
                  type: 'changeSome',
                  name: {
                    modalVisible: true,
                    modalTitle: '编辑字典',
                    showDictionaryConfig: true,
                    operateParam: {
                      dictName: name,
                      dictDescription: description,
                      childList
                    },
                    handleAft: (paramFromModal) => {
                      const param = filterParamFromModal(paramFromModal);
                      editDictionary({ ...param, id }).then((canIEdit) => {
                        if (!canIEdit) return;
                        const { expandedDictionaryChildKeys } = dictionaryConfig;
                        refreshTable({ ...dictionaryConfig, expandedDictionaryChildKeys: lodash.without(expandedDictionaryChildKeys, id) });
                        setModalConfig({ type: 'changeSome', name: { modalVisible: false } });
                      });
                    }
                  }
                });
              });
            }}
          >
            编辑
          </span>
          <span
            className="link-btn ml10"
            onClick={(e) => {
              delDictionaryServices(id).then((canIDelete) => {
                canIDelete && refreshTable(dictionaryConfig);
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

/** 字典编辑弹窗的数据操作 */
const useModalConfig = () => {
  const [modalConfig, setModalConfig] = useReducer((state, action) => {
    if (action.type === 'changeSome') {
      return {
        ...state, ...action.name
      };
    }
    return state;
  }, {
    modalVisible: false,
    modalTitle: '',
    showDictionaryConfig: true,
    operateParam: {},
    handleAft: () => {}
  });
  return [modalConfig, setModalConfig];
};

/** 字典列表控件 */
const DictionaryList: React.FC = (props) => {
  const [modalConfig, setModalConfig] = useModalConfig();
  const [dictionaryConfig, setDictionaryConfig] = useReducer((state, action) => {
    return { ...state, ...action };
  }, {
    size: 10,
    offset: 0,
    name: '',
    description: '',
    expandedDictionaryKeys: []
  });
  const [expandedDictionaryChildKeys, setExpandedDictionaryChildKeys] = useState([]);
  const [dictionaryList, getListData] = useDictionaryList(dictionaryConfig);
  const [form] = Form.useForm();
  /** 搜索工程， 可接受 offset（从0开始）, size */
  const handleSearch = () => {
    const dataParam = form.getFieldsValue(['name', 'description']);
    setDictionaryConfig(dataParam);
  };
  const refreshTable = (dictionaryConfigTmpl) => {
    getListData(dictionaryConfigTmpl);
    setDictionaryConfig({ ...dictionaryConfigTmpl, expandedDictionaryKeys: [] });
    setExpandedDictionaryChildKeys([]);
  };
  /** 更换页码或更换每页行数 */
  const handleChangePage = (offset, size) => {
    setDictionaryConfig({ offset: offset - 1, size });
  };
  useEffect(() => {
    refreshTable(dictionaryConfig);
  }, [dictionaryConfig.size, dictionaryConfig.offset, dictionaryConfig.description, dictionaryConfig.name]);

  const ListColumns = React.useMemo(() => {
    return getListColumns({
      refreshTable,
      dictionaryConfig,
      setModalConfig
    });
  }, [dictionaryConfig]);
  return (
    <ConfigProvider locale={zhCN}>
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
                handleSearch();
                handleChangePage(1, dictionaryConfig.size);
              }}
            > 清空</Button>
            <Button
              type="primary"
              className="float-right mr10"
              onClick={(e) => {
                handleSearch();
              }}
            > 搜索</Button>
          </Form.Item>
        </Form>
        <div className="float-right">
          <Button
            type = "primary"
            onClick={(e) => {
              const id = `${new Date().valueOf()}`;
              setModalConfig({
                type: 'changeSome',
                name: {
                  modalVisible: true,
                  modalTitle: '新增字典',
                  showDictionaryConfig: true,
                  operateParam: {
                    name: '',
                    description: '',
                    childList: [{
                      editable: true, id, renderBgColor: '#fff', renderFontColor: '#000'
                    }],
                    editingKeyFirst: id
                  },
                  handleAft: (paramFromModal) => {
                    const param = filterParamFromModal(paramFromModal);
                    postDictionary(param).then((canIPost) => {
                      if (!canIPost) return;
                      refreshTable(dictionaryConfig);
                      setModalConfig({ type: 'changeSome', name: { modalVisible: false } });
                    });
                  }
                }
              });
            }}
          >
          新建
          </Button>
        </div>

        <Col span={24}>
          <Table
            className="w-full"
            dataSource={dictionaryList.list}
            rowKey={'id'}
            columns={ListColumns}
            expandable={{
              expandedRowKeys: dictionaryConfig.expandedDictionaryKeys,
              onExpand: (expanded, record) => {
                const { expandedDictionaryKeys } = dictionaryConfig;
                if (!expanded) {
                  setDictionaryConfig({ expandedDictionaryKeys: lodash.without(expandedDictionaryKeys, record.id) });
                  return;
                }
                setDictionaryConfig({ expandedDictionaryKeys: [...expandedDictionaryKeys, record.id] });
              },
              expandedRowRender: (record, index) => (
                <DictionaryChildren
                  expandedDictionaryChildKeys = {expandedDictionaryChildKeys}
                  setExpandedDictionaryChildKeys = {setExpandedDictionaryChildKeys}
                  key = {record.id}
                  id={record.id}
                  gmtModified={record.gmtModified}
                  pindex = {index}
                  setModalConfig = {setModalConfig}
                />)
            }}
            pagination={{
              pageSizeOptions: ['10', '20', '30', '40', '50', '100'],
              showSizeChanger: true,
              total: dictionaryList.total,
              onChange: handleChangePage,
              current: dictionaryConfig.offset + 1,
              onShowSizeChange: handleChangePage
            }}
          /></Col>
        <CreateModal
          width="800px"
          title={modalConfig.modalTitle}
          modalVisible={modalConfig.modalVisible}
          onCancel={() => setModalConfig({ type: 'changeSome', name: { modalVisible: false } })}
        >
          <CreateDictionary
            config = {modalConfig}
            onOk={modalConfig.handleAft}
            onCancel={() => setModalConfig({ type: 'changeSome', name: { modalVisible: false } })}
          />
        </CreateModal>
      </div>
    </ConfigProvider>
  );
};

export default DictionaryList;
