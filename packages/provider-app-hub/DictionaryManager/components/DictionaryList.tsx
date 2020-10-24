import React, { useState, useEffect, useReducer } from "react";
import {
  Button, Table, Form, Input, ConfigProvider, Col
} from "antd";
import zhCN from 'antd/es/locale/zh_CN'; // 引入中文包
import { ColumnsType } from "antd/lib/table";
import dayjs from "dayjs";
import { ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons';
import lodash from 'lodash';
import { FormInstance } from 'antd/lib/form';
import CreateModal from "./CreateModal";
import {
  delDictionaryServices, getDictionaryListServices, getListOfDictionaryServices, getListOfDictionaryChildServices, delChildOfDictionaryServices,
  addDictionary, editDictionary, editChildOfDictionary, moveChildOfDictionary
} from "../services/apiAgents";
import CreateDictionary from "./CreateDictionary";
import {
  BUTTON_TYPE, DEF_VALUE, MODAL_TITLE, DICTIONARY_KEY, DICTIONARY_CHILD_KEY
} from '../constants';

const getChildOfDictionaryColumns = () => {
  return [{
    key: 'decorativeIndex',
    dataIndex: 'decorativeIndex',
    title: '序号',
    width: 210,
    ellipsis: { showTitle: true },
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
      return <div style={{ color: record.renderFontColor, backgroundColor: record.renderBgColor }}>{text}</div>;
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
      return (null
      // <div className="child-operation">
      //   {index !== 0 ? (<ArrowUpOutlined
      //     style={{ color: '#488CF0', fontSize: '14px' }}
      //     onClick={(e) => {
      //       moveChildOfDictionary({
      //         dictionaryId,
      //         items: [{ id, sort: childList[index - 1].sort }, { id: childList[index - 1].id, sort }]
      //       }).then((canIMove) => {
      //         canIMove && refreshTable([decorativeId, childList[index - 1].decorativeId]);
      //       });
      //     }}
      //     className="link-btn"
      //   />) : null}
      //   {index !== length - 1 ? (<ArrowDownOutlined
      //     style={{ color: '#488CF0', fontSize: '14px' }}
      //     className="link-btn"
      //     onClick={(e) => {
      //       moveChildOfDictionary({
      //         dictionaryId,
      //         items: [{ id, sort: childList[index + 1].sort }, { id: childList[index + 1].id, sort }]
      //       }).then((canIMove) => {
      //         canIMove && refreshTable([decorativeId, childList[index + 1].decorativeId]);
      //       });
      //     }}
      //   />) : null}
      //   {decorativeIndex.split('.').length < 6 ? (<span
      //     className="link-btn"
      //     onClick={(e) => {
      //       /** 获取对应子项列表数据，传递给弹窗展示 */
      //       getListOfDictionaryChildServices({ dictionaryId, pid: id }).then((childListOfChild) => {
      //         const idTmpl = `${new Date().valueOf()}`;
      //         setModalConfig({
      //           type: 'changeSome',
      //           name: {
      //             modalVisible: true,
      //             modalTitle: '配置子项',
      //             /** 配置子项不需要展示字典名称和字典描述 */
      //             showDictionaryConfig: false,
      //             operateParam: {
      //               childList: childListOfChild.length !== 0 ? childListOfChild
      //                 : [{
      //                   editable: true, id: idTmpl, renderBgColor: '#fff', renderFontColor: '#000'
      //                 }],

      //               editingKeyFirst: childListOfChild.length === 0 && idTmpl
      //             },
      //             handleAft: (paramFromModal) => {
      //               const { items } = filterParamFromModal(paramFromModal);
      //               /** 保存数据并刷新子项列表 */
      //               editChildOfDictionary({ items, dictionaryId, pid: id }).then((canIEdit) => {
      //                 if (!canIEdit) return;
      //                 setModalConfig({ type: 'changeSome', name: { modalVisible: false } });
      //                 refreshTable([decorativeId]);
      //                 const previousChildList = childList.slice();
      //                 previousChildList[index] = { ...previousChildList[index], children: [] };
      //                 setChildList({
      //                   type: 'setListOfDictionaryPure',
      //                   name: previousChildList
      //                 });
      //               });
      //             }
      //           }
      //         });
      //       });
      //     }}
      //   >
      //     配置子项
      //   </span>) : null}
      //   {decorativeIndex.split('.').length < 6 ? (<span
      //     className="link-btn"
      //     onClick={(e) => {
      //       delChildOfDictionaryServices({ dictionaryId, pid: id }).then((canIDelete) => {
      //         /** 删除成功后需要刷新子项列表 */
      //         canIDelete && refreshTable([decorativeId]);
      //       });
      //     }}
      //   >
      //     删除子项
      //   </span>) : null}
      // </div>
      );
    },
  },
  ];
};
class ChildListOfDictionary extends React.Component {
  state = {
    list: [],
    map: {}
  }

  componentDidMount() {
    this.initList(this.props.parentRecord?.id);
  }

  initMap = (list) => {
    const mapTmpl = {};
    list.forEach((item) => {
      mapTmpl[item[DICTIONARY_CHILD_KEY.ID]] = item;
    });
    this.setState({ map: mapTmpl });
  }

  decorateList = (list) => {
    const { parentDecorativeIndex } = this.props;
    return list.map((item, index) => {
      return {
        decorativeIndex: `${parentDecorativeIndex}.${index + 1}`,
        ...item
      };
    });
  }

  initList = (id) => {
    getListOfDictionaryServices({ id }).then((res) => {
      const list = this.decorateList(res);
      this.setState({ list });
      this.initMap(list);
    });
  }

  render() {
    const { list } = this.state;
    const columns = getChildOfDictionaryColumns();
    return (
      <Table
        rowKey={DICTIONARY_CHILD_KEY.ID}
        columns = {columns}
        dataSource = {list}
        pagination={false}
      />
    );
  }
}
/** 字典列表的字段配置 */
const getDictionaryColumns = ({
  getModalConfigOfEditDictionary, afterDel
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
      const { id } = record;
      return (
        <>
          <span
            className="link-btn"
            onClick={(e) => {
              getModalConfigOfEditDictionary(record);
            }}
          >
            编辑
          </span>
          <span
            className="link-btn ml10"
            onClick={(e) => {
              delDictionaryServices(id).then((canIDelete) => {
                canIDelete && afterDel(dictionaryConfig);
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

class DictionaryList extends React.Component {
  state = {
    modalConfig: {
      modalTitle: '',
      nameVisible: false,
      descVisible: false,
      list: [],
      name: '',
      desc: '',
      editingKey: '',
      successCallback: () => {}
    },
    modalVisible: false,
    searchArea: {
      name: '',
      description: ''
    },
    page: {
      size: 10,
      offset: 0
    },
    expandedRowKeys: [],
    list: [],
    map: {},
    total: 0
  }

  searchFormRef = React.createRef<FormInstance>();

  componentDidMount() {
    this.getDictionaryList();
  }

  getDictionaryMap = (list) => {
    const map = {};
    list?.forEach((item) => {
      const { [DICTIONARY_KEY.ID]: id } = item;
      map[id] = item;
    });
    return map;
  }

  setDictionaryListChildren = (list) => {
    return list.map((item) => {
      return {
        ...item, children: []
      };
    });
  }

  getDictionaryList = () => {
    const {
      searchArea: { name, description },
      page: { offset, size }
    } = this.state;
    const requestParam = { offset, size };
    name && Object.assign(requestParam, { name });
    description && Object.assign(requestParam, { description });
    getDictionaryListServices(requestParam).then((res) => {
      const list = this.setDictionaryListChildren(res?.data || []);
      this.setState({
        list,
        total: res?.total || 0,
        map: this.getDictionaryMap(list)
      });
    });
  }

  getDictionaryFromModal = (resFromModal) => {
    const { name, desc, list } = resFromModal;
    return {
      name,
      [DICTIONARY_KEY.DESC]: desc,
      items: this.filterChildListOfDictionary(list)
    };
  }

  filterChildListOfDictionary = (list) => {
    return list.map((item) => {
      const {
        name, code, id, renderBgColor, renderFontColor
      } = item;
      return {
        name, code, id, renderBgColor, renderFontColor
      };
    });
  }

  getDefChildListOfDictionaryInModal = () => {
    const id = `${new Date().valueOf()}`;
    return [{
      editable: true, id, renderBgColor: DEF_VALUE.RENDERBGCOLOR, renderFontColor: DEF_VALUE.RENDERFONTCOLOR
    }];
  }

  getModalConfigOfCreateDictionary = () => {
    const list = this.getDefChildListOfDictionaryInModal();
    return {
      modalVisible: true,
      modalConfig:
      {
        modalTitle: MODAL_TITLE.ADD,
        nameVisible: true,
        descVisible: true,
        list,
        name: '',
        desc: '',
        editingKey: list[0].id,
        successCallback: (res) => {
          const paramAddDictionary = this.getDictionaryFromModal(res);
          addDictionary(paramAddDictionary).then((canIAdd) => {
            if (!canIAdd) return;
          });
        }
      }
    };
  }

  getModalConfigOfEditDictionary = async (record) => {
    const {
      [DICTIONARY_KEY.NAME]: name,
      [DICTIONARY_KEY.DESC]: desc,
      [DICTIONARY_KEY.ID]: id
    } = record;
    const list = getListOfDictionaryServices(id);
    return {
      modalVisible: true,
      modalConfig: {
        modalTitle: MODAL_TITLE.EDIT,
        nameVisible: true,
        descVisible: true,
        list: this.filterChildListOfDictionary(list),
        name,
        desc,
        editingKey: id,
        successCallback: (res) => {
          const paramEditDictionary = this.getDictionaryFromModal(res);
          editDictionary({ ...paramEditDictionary, id }).then((canIEdit) => {
            if (!canIEdit) return;
          });
        }
      }
    };
  }

  getModalConfigOfEditChildListOfDictionary = (record) => {
    const {
      [DICTIONARY_CHILD_KEY.CHILD]: list,
      [DICTIONARY_CHILD_KEY.DICTIONARYID]: dictionaryId,
      [DICTIONARY_CHILD_KEY.ID]: id,
    } = record;
    const listInModal = list.length > 0 ? this.filterChildListOfDictionary(list) : this.getDefChildListOfDictionaryInModal();
    return {
      modalVisible: true,
      modalConfig:
      {
        modalTitle: MODAL_TITLE.EDIT,
        nameVisible: false,
        descVisible: false,
        list: listInModal,
        name: '',
        desc: '',
        editingKey: listInModal[0].id,
        successCallback: (res) => {
          const paramEditChildOfDictionary = this.getDictionaryFromModal(res);
          editChildOfDictionary({ ...paramEditChildOfDictionary, dictionaryId, pid: id }).then((canIEditChildList) => {
            if (!canIEditChildList) return;
          });
        }
      }
    };
  }

  getRecordByRowKey=(id) => {
    return this.state.map[id];
  }

  updateRecordByRowKey = (id, recordNeedUpdate) => {
    const record = this.getRecordByRowKey(id);
    for (const key in recordNeedUpdate) {
      record[key] = recordNeedUpdate[key];
    }
    this.setState({
      list: this.state.list.slice()
    });
  }

  handleSearch = () => {
    const searchArea = this.searchFormRef.current?.getFieldsValue([DICTIONARY_KEY.NAME, DICTIONARY_KEY.DESC]);
    this.setState({
      searchArea
    }, () => {
      this.getDictionaryList();
    });
  }

  handleClear = () => {
    this.searchFormRef.current?.resetFields();
    this.handleSearch();
  }

  /** 更换页码或更换每页行数 */
  handleChangePage = (offset, size) => {
    this.setState({
      page: { offset: offset - 1, size }
    }, () => {
      this.getDictionaryList();
    });
  };

  handleCreateDict = () => {
    const modalConfig = this.getModalConfigOfCreateDictionary();
    this.setState({ ...modalConfig });
  }

  render() {
    const {
      list, expandedRowKeys, modalConfig, modalVisible, total, page
    } = this.state;
    const columns = getDictionaryColumns({
      getModalConfigOfEditDictionary: this.getModalConfigOfEditDictionary,
      afterDel: () => {}
    });
    return (
      <>
        <Form
          layout="inline"
          ref={this.searchFormRef}
        >
          <Form.Item
            className="w-1/3"
            name={DICTIONARY_KEY.NAME}
            label="字典名称"
          >
            <Input
              placeholder="请输入字典名称"
            />
          </Form.Item>
          <Form.Item
            className="w-1/3"
            name={DICTIONARY_KEY.DESC}
            label="字典描述"
          >
            <Input
              placeholder="请输入字典描述"
            />
          </Form.Item>
          <Button
            type={BUTTON_TYPE.PRIMARY}
            onClick={this.handleSearch}
          >
              搜索
          </Button>
          <Button
            className="ml-2"
            onClick={this.handleClear}
          >
              清空
          </Button>
        </Form>
        <div style={{ height: 32 }}>
          <Button
            className="float-right"
            onClick={this.handleCreateDict}
            type={BUTTON_TYPE.PRIMARY}
          >
            新建
          </Button>
        </div>
        <Table
          className="w-full"
          dataSource={list}
          rowKey={DICTIONARY_KEY.ID}
          columns={columns}
          expandable={{
            expandedRowKeys,
            onExpand: (expanded, record) => {
              const { [DICTIONARY_KEY.ID]: id } = record;
              if (!expanded) {
                this.setState({ expandedRowKeys: lodash.without(expandedRowKeys, id) });
                return;
              }
              this.setState({ expandedRowKeys: [...expandedRowKeys, id] });
            },
            expandedRowRender: (record, index) => (
              <ChildListOfDictionary
                parentRecord = {record}
                parentDecorativeIndex = {index + 1}
              />)
          }}
          pagination={{
            pageSizeOptions: ['10', '20', '30', '40', '50', '100'],
            showSizeChanger: true,
            total,
            onChange: this.handleChangePage,
            current: page.offset + 1,
            onShowSizeChange: this.handleChangePage
          }}
        />
        <CreateModal
          width="800px"
          title={modalConfig.modalTitle}
          modalVisible={modalVisible}
          onCancel={() => this.setState({ modalVisible: false })}
        >
          <CreateDictionary
            config = {modalConfig}
            onOk={modalConfig.successCallback}
            onCancel={() => this.setState({ modalVisible: false })}
          />
        </CreateModal>

      </>
    );
  }
}

export default DictionaryList;
