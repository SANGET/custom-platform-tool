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

const filterChildListOfDictionary = (list) => {
  return list.map((item) => {
    const {
      name, code, id, renderBgColor, renderFontColor
    } = item;
    return {
      name, code, id, renderBgColor, renderFontColor
    };
  });
};
const getDefChildListOfDictionaryInModal = () => {
  const id = `${new Date().valueOf()}`;
  return [{
    editable: true, id, renderBgColor: DEF_VALUE.RENDERBGCOLOR, renderFontColor: DEF_VALUE.RENDERFONTCOLOR
  }];
};
const getChildOfDictionaryColumns = ({
  handleCreateChild, handleDeleteChild, getBrother, handleMove, dictionaryId
}) => {
  return [
    {
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
      width: 220,
      render: (text, record, index) => {
        const {
          id, length, sort, level, pid
        } = record;
        return (
          <div className="child-operation">
            {level < 5 ? (<span
              key="editChild"
              className="link-btn"
              onClick={(e) => {
                /** 获取对应子项列表数据，传递给弹窗展示 */
                handleCreateChild(record);
              }}
            >
          配置子项
            </span>) : null}
            {level < 5 ? (<span
              key="deleteChild"
              className="link-btn"
              onClick={(e) => {
                delChildOfDictionaryServices({ dictionaryId, pid: id }).then((canIDelete) => {
                  /** 删除成功后需要刷新子项列表 */
                  handleDeleteChild(record);
                });
              }}
            >
          删除子项
            </span>) : null}
            {index !== 0 ? (<ArrowUpOutlined
              className="link-btn sort-btn"
              onClick={(e) => {
                const prev = getBrother(pid, index - 1);
                moveChildOfDictionary({
                  dictionaryId,
                  items: [{ id, sort: prev?.sort }, { id: prev?.id, sort }]
                }).then((canIMove) => {
                  canIMove && handleMove(record, [index - 1, index]);
                });
              }}
            />) : null}
            {index !== length - 1 ? (<ArrowDownOutlined
              className="link-btn sort-btn"
              onClick={(e) => {
                const next = getBrother(pid, index + 1);
                moveChildOfDictionary({
                  dictionaryId,
                  items: [{ id, sort: next?.sort }, { id: next?.id, sort }]
                }).then((canIMove) => {
                  canIMove && handleMove(record, [index, index + 1]);
                });
              }}
            />) : null}
          </div>
        );
      },
    },
  ];
};
class ChildListOfDictionary extends React.Component {
  state = {
    list: [{}],
    map: {},
    expandedRowKeys: []
  }

  componentWillMount() {
    this.initList(this.props.parentRecord?.id);
  }

  initMap = (list) => {
    this.setState({ map: this.decorateMap(list) });
  }

  decorateMap = (list) => {
    const mapTmpl = {};
    list.forEach((item) => {
      mapTmpl[item[DICTIONARY_CHILD_KEY.ID]] = item;
    });
    return mapTmpl;
  }

  decorateList = (list, parentDecorativeIndex, parentId) => {
    return list.map((item, index) => {
      return {
        pid: parentId,
        decorativeIndex: `${parentDecorativeIndex}.${index + 1}`,
        length: list.length,
        children: item.hasChild ? [] : null,
        ...item
      };
    });
  }

  initList = (id) => {
    getListOfDictionaryServices({ id }).then((res) => {
      const list = this.decorateList(res, this.props.parentDecorativeIndex, null);
      this.setState({ list });
      this.initMap(list);
    });
  }

  getModalConfigOfEditChildListOfDictionary = async (record) => {
    const {
      [DICTIONARY_CHILD_KEY.ID]: dictionaryId,
    } = this.props.parentRecord;
    const {
      [DICTIONARY_CHILD_KEY.ID]: id,
    } = record;
    const list = await getListOfDictionaryChildServices({ dictionaryId, pid: id });
    const listInModal = list.length > 0 ? filterChildListOfDictionary(list) : getDefChildListOfDictionaryInModal();
    return {
      modalTitle: MODAL_TITLE.EDIT_CHILD,
      nameVisible: false,
      descVisible: false,
      list: listInModal,
      name: '',
      desc: '',
      editingKey: listInModal[0].id,
      successCallback: (res) => {
        const items = filterChildListOfDictionary(res?.list);
        editChildOfDictionary({ items, dictionaryId, pid: id }).then((canIEditChildList) => {
          if (!canIEditChildList) return;
          this.props.handleCloseModal();
          this.setState({
            expandedRowKeys: lodash.without(this.state.expandedRowKeys, id)
          });
          this.updateRecordByRowKey(record[DICTIONARY_CHILD_KEY.ID], { children: [] });
        });
      }
    };
  }

  handleCreateChild = async (record) => {
    const modalConfig = await this.getModalConfigOfEditChildListOfDictionary(record);
    this.props.handleOperateChildListOfDict(modalConfig);
  }

  handleDeleteChild = (record) => {
    /** 删除子项成功后要更新前置标识 */
    this.updateRecordByRowKey(record[DICTIONARY_CHILD_KEY.ID], { children: null });
  }

  handleMove = (record, [prevIndex, nextIndex]) => {
    const { [DICTIONARY_CHILD_KEY.PID]: pid } = record;
    let { list } = this.state;
    const { expandedRowKeys, map } = this.state;
    if (pid) {
      list = this.getRecordByRowKey(pid).children;
    }
    const {
      sort: prevSort, decorativeIndex: prevDecorativeIndex, id: idPrev, children: childrenPrev, ...prev
    } = list[prevIndex];
    const {
      sort: nextSort, decorativeIndex: nextDecorativeIndex, id: idNext, children: childrenNext, ...next
    } = list[nextIndex];
    list[prevIndex] = {
      ...next, sort: prevSort, decorativeIndex: prevDecorativeIndex, id: idNext, children: Array.isArray(childrenNext) ? [] : childrenNext
    };
    map[idNext] = list[prevIndex];
    list[nextIndex] = {
      ...prev, sort: nextSort, decorativeIndex: nextDecorativeIndex, id: idPrev, children: Array.isArray(childrenPrev) ? [] : childrenPrev
    };
    map[idPrev] = list[nextIndex];
    this.setState({
      list: this.state.list.slice(),
      expandedRowKeys: lodash.without(expandedRowKeys, idPrev, idNext)
    });
  }

  getRecordByRowKey=(id) => {
    return this.state.map[id];
  }

  getBrother = (pid, index) => {
    if (pid) {
      const record = this.getRecordByRowKey(pid);
      return record.children?.[index];
    }
    console.log(this.state.list[index]);
    return this.state.list[index];
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

  handleExpandChild = (expanded, record) => {
    const { [DICTIONARY_CHILD_KEY.ID]: id } = record;
    const { expandedRowKeys } = this.state;
    if (!expanded) {
      const keysOfChildList = record.children?.map((item) => item.id) || [];
      this.setState({ expandedRowKeys: lodash.without.apply(lodash, [expandedRowKeys, id, ...keysOfChildList]) });
      // this.handleExpandChildList(false, record.children || []);
      return;
    }
    this.setState({ expandedRowKeys: [...expandedRowKeys, id] });
  }

  handleExpandChildList = (expanded, records) => {
    const keysOfChildList = records.map((item) => item.id);
    const { expandedRowKeys } = this.state;
    if (!expanded) {
      this.setState({ expandedRowKeys: lodash.without.apply(lodash, [expandedRowKeys, ...keysOfChildList]) });
      return;
    }
    this.setState({ expandedRowKeys: [...expandedRowKeys, ...keysOfChildList] });
  }

  render() {
    const { list, expandedRowKeys } = this.state;
    const {
      parentRecord: { id: dictionaryId }
    } = this.props;
    const columns = getChildOfDictionaryColumns({
      handleCreateChild: this.handleCreateChild,
      handleDeleteChild: this.handleDeleteChild,
      handleMove: this.handleMove,
      getBrother: this.getBrother,
      dictionaryId
    });
    return (
      <Table
        className="dictionary-child-list"
        rowKey={DICTIONARY_CHILD_KEY.ID}
        columns = {columns}
        dataSource = {list}
        pagination={false}
        expandable = {{
          expandedRowKeys,
          indentSize: 10,
          onExpand: (expanded, record) => {
            const { [DICTIONARY_CHILD_KEY.ID]: id, decorativeIndex } = record;
            this.handleExpandChild(expanded, record);
            if (!expanded) return;
            getListOfDictionaryChildServices({ dictionaryId, pid: id }).then((res) => {
              const listTmpl = this.decorateList(res, decorativeIndex, id);
              this.handleExpandChildList(false, listTmpl);
              this.updateRecordByRowKey(id, { children: listTmpl });
              this.setState({
                map: Object.assign(this.state.map, this.decorateMap(listTmpl)),
                list: this.state.list.slice()
              });
            });
          }
        }}

      />
    );
  }
}
/** 字典列表的字段配置 */
const getDictionaryColumns = ({
  getModalConfigOfEditDictionary, handleDelete
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
                canIDelete && handleDelete(record);
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
    const requestParam = {
      offset: offset * size || 0,
      size
    };
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
    const {
      [DICTIONARY_KEY.NAME]: name,
      [DICTIONARY_KEY.DESC]: desc,
      list
    } = resFromModal;
    return {
      [DICTIONARY_KEY.NAME]: name,
      [DICTIONARY_KEY.DESC]: desc,
      items: filterChildListOfDictionary(list)
    };
  }

  getModalConfigOfCreateDictionary = () => {
    const list = getDefChildListOfDictionaryInModal();
    return {
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
          this.setState({
            modalVisible: false
          });
          this.getDictionaryList();
        });
      }
    };
  }

  getModalConfigOfEditDictionary = async (record) => {
    const {
      [DICTIONARY_KEY.NAME]: name,
      [DICTIONARY_KEY.DESC]: desc,
      [DICTIONARY_KEY.ID]: id
    } = record;
    const list = await getListOfDictionaryServices({ id });
    return {
      modalTitle: MODAL_TITLE.EDIT,
      nameVisible: true,
      descVisible: true,
      list: filterChildListOfDictionary(list),
      [DICTIONARY_KEY.NAME]: name,
      [DICTIONARY_KEY.DESC]: desc,
      editingKey: list[0]?.[DICTIONARY_CHILD_KEY.ID],
      successCallback: (res) => {
        const paramEditDictionary = this.getDictionaryFromModal(res);
        editDictionary({ ...paramEditDictionary, id }).then((canIEdit) => {
          if (!canIEdit) return;
          this.setState({
            modalVisible: false,
            expandedRowKeys: lodash.without(this.state.expandedRowKeys, id)
          });
          this.getDictionaryList();
        });
      }
    };
  }

  getRecordByRowKey=(id) => {
    return this.state.map[id];
  }

  getIndexByRowKey = (id) => {
    return lodash.findIndex(this.state.list, { [DICTIONARY_KEY.ID]: id });
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

  handleOperateDict = async (createConfigFn, record) => {
    const modalConfig = typeof createConfigFn === 'function' && await createConfigFn(record);
    this.setState({
      modalVisible: true,
      modalConfig
    });
  }

  handleOperateChildListOfDict = (modalConfig) => {
    this.setState({
      modalVisible: true,
      modalConfig
    });
  }

  handleCloseModal = () => {
    this.setState({
      modalVisible: false,
    });
  }

  handleExpandChild = (expanded, record) => {
    const { [DICTIONARY_KEY.ID]: id } = record;
    const { expandedRowKeys } = this.state;
    if (!expanded) {
      this.setState({ expandedRowKeys: lodash.without(expandedRowKeys, id) });
      return;
    }
    this.setState({ expandedRowKeys: [...expandedRowKeys, id] });
  }

  handleDelete = ({ id }) => {
    const index = this.getIndexByRowKey({ id });
    const list = this.state.list.slice();
    list.splice(index, 1);
    this.setState({ list });
  }

  render() {
    const {
      list, expandedRowKeys, modalConfig, modalVisible, total, page
    } = this.state;
    const columns = getDictionaryColumns({
      getModalConfigOfEditDictionary: this.handleOperateDict.bind(this, this.getModalConfigOfEditDictionary),
      handleDelete: this.handleDelete
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
            onClick={() => { this.handleOperateDict(this.getModalConfigOfCreateDictionary); }}
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
            onExpand: this.handleExpandChild,
            expandedRowRender: (record, index) => {
              return expandedRowKeys.includes(record.id) ? (
                <ChildListOfDictionary
                  handleExpandChild = {this.handleExpandChild}
                  handleCloseModal = {this.handleCloseModal}
                  handleOperateChildListOfDict = {this.handleOperateChildListOfDict}
                  parentRecord = {record}
                  parentDecorativeIndex = {index + 1}
                />) : null;
            }
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
