import React, { useState, useEffect } from "react";
import {
  Button, Form, Select, Input, Switch
} from "antd";
import { ColumnsType } from "antd/lib/table";
import dayjs from "dayjs";
import {
  openNotification, contructTree, getlabelByMenuList, deleteConfirm
} from '@provider-app/table-editor/service';
import { FormInstance } from 'antd/lib/form';
import Table from '@provider-app/table-editor/components/ExpandedInfoEditor';
import lodash from 'lodash';
import {
  delMenuServices, getMenuListServices, getPageListServices, editMenuServices, setMenuStatusServices, addMenuServices
} from "../services/apis";
import {
  SAVE_TYPE, MENU_OPTIONS, MESSAGE, API_CODE, NOTIFICATION_TYPE, BUTTON_TYPE, BUTTON_SIZE, MENU_TYPE, MENU_KEY
} from '../constants';

type IMenuType = MENU_TYPE.MODULE | MENU_TYPE.PAGE
interface IMenu {
  id: string
  editable?:boolean
  type: IMenuType
  pagelink: string
  pageName: string
  status: IMenuType
  icon: string
  gmtModified: number
  createdUserName: string
  createdCustomed?: boolean
}
interface IMenuSelect {
  name: string
  className?: string
  placeholder?: string
}
const MenuSelect: React.FC<IMenuSelect> = (props) => {
  const {
    name, className, placeholder
  } = props;
  return (
    <Form.Item
      className = {className}
      name = {name}
    >
      <Select
        onClick = {(e) => e.stopPropagation()}
        onBlur = {(e) => e.stopPropagation()}
        options={MENU_OPTIONS}
        placeholder={placeholder}
      />
    </Form.Item>
  );
};
interface IPageChoose {
  record: IMenu,
  formRef: React.RefObject<FormInstance<any>>
  text: string
  selectPage: string
}
// const useDictionaryList: UseListData = (param) => {
//   const [dictionaryList, setDictionaryList] = useState<{list: Idictionary[], total: number}>({ list: [mockDictionary], total: 1 });
//   const getListData = (paramTmpl) => {
//     const {
//       name, description, offset, size
//     } = paramTmpl;
//     const requestParam = { offset, size };
//     name && Object.assign(requestParam, { name });
//     description && Object.assign(requestParam, { description });
//     getDictionaryListServices(requestParam).then((dictionaryListRes) => {
//       setDictionaryList({
//         list: dictionaryListRes?.data,
//         total: dictionaryListRes?.total
//       });
//     });
//   };
//   useEffect(() => {
//     getListData(param);
//   }, []);
//   return [dictionaryList, getListData];
// };
const PageChoose: React.FC<IPageChoose> = (props: IPageChoose) => {
  const {
    record, formRef, text, selectPage
  } = props;
  const canIEdit = (getFieldValue) => {
    const isEditable = record.editable;
    const isPage = getFieldValue(MENU_KEY.TYPE) === MENU_TYPE.PAGE;
    return isEditable && isPage;
  };
  const handleClick = (e) => {
    e.stopPropagation();
    typeof selectPage === 'function' && selectPage(formRef.current?.getFieldValue(MENU_KEY.PAGELINK));
  };
  const getText = (editable, getFieldValue) => {
    return editable ? (getFieldValue(MENU_KEY.PAGENAME)) : text;
  };
  return React.useMemo(() => {
    return (<Form.Item
      shouldUpdate
      noStyle
    >
      {({ getFieldValue }) => {
        const editable = canIEdit(getFieldValue);
        return editable ? (
          <Form.Item
            name={MENU_KEY.PAGELINK}
            rules={[
              { required: true, message: '页面链接必填' },
            ]}
          >
            <Select
              onClick = {(e) => e.stopPropagation()}
              onBlur = {(e) => e.stopPropagation()}
              options = {options}
              onChange = {handleChange}
            />
          </Form.Item>
        ) : (
          record[MENU_KEY.PAGENAME]
        );
      }}
    </Form.Item>);
  }, [record.editable, record.type, options]);
};

const getListColumns = ({
  onDel,
  onAddChild,
  formRef,
  editingKey
}): ColumnsType => [
  {
    key: MENU_KEY.NAME,
    dataIndex: MENU_KEY.NAME,
    title: '菜单名称',
    ellipsis: { showTitle: true },
    width: 200,
    render: (text, record, index) => {
      return record.editable ? (
        <Form.Item
          rules={[
            { required: true, message: '菜单名称必填' },
          ]}
          name={MENU_KEY.NAME}
        >
          <Input
            onClick={(e) => e.stopPropagation()}
          />
        </Form.Item>
      ) : text;
    }
  },
  {
    key: MENU_KEY.TYPE,
    dataIndex: MENU_KEY.TYPE,
    title: '类型',
    width: 120,
    render: (text, record, index) => {
      const { editable, createdCustomed, type } = record;
      const isPage = type === MENU_TYPE.PAGE;
      const rule = (createdCustomed || isPage) && editable;
      return rule ? (
        <MenuSelect name="type"/>
      ) : getlabelByMenuList(MENU_OPTIONS, text);
    }
  },
  {
    key: MENU_KEY.PAGENAME,
    dataIndex: MENU_KEY.PAGENAME,
    title: '页面链接',
    render: (text, record, index) => {
      return (
        <PageChoose
          selectPage = {selectPage}
          text = {text}
          formRef = {formRef}
          record = {record}
        />
      );
    }
  },
  {
    key: MENU_KEY.ICON,
    dataIndex: MENU_KEY.ICON,
    title: '图标',
  },
  {
    key: MENU_KEY.STATUS,
    dataIndex: MENU_KEY.STATUS,
    title: '状态',
    render: (text, record, index) => {
      return (
        <Switch
          checkedChildren="启用"
          unCheckedChildren="禁用"
          defaultChecked={record[MENU_KEY.STATUS]}
          onChange={(checked, event) => {
            event.stopPropagation();
            /** 将数据实时存储，以保证调用“新增菜单”接口时，能将 staus 同时保存 */
            if (record[MENU_KEY.EDITABLE]) {
              formRef.current?.setFieldsValue({ status: Number(checked) });
            }
            /** 如果还没有入库，则先不进行“更改状态”的接口调用 */
            if (record[MENU_KEY.CREATEDCUSTOMED]) return;
            setMenuStatusServices({
              id: record[MENU_KEY.ID],
              status: Number(checked)
            }).then((res) => {
              if (res?.code !== API_CODE.SUCCESS) {
                openNotification(NOTIFICATION_TYPE.ERROR, res?.msg || MESSAGE.SET_STATUS_FAILD);
              }
            });
          }}

          onClick={(checked, event) => { event.stopPropagation(); }}
        />
      );
    }
  },
  {
    key: MENU_KEY.GMTMODIFIED,
    dataIndex: MENU_KEY.GMTMODIFIED,
    title: '最后修改时间',
    width: 160,
    render: (date) => (date ? dayjs(date).format('YYYY-MM-DD HH:mm:ss') : '')
  },
  {
    key: MENU_KEY.CREATEUSERNAME,
    dataIndex: MENU_KEY.CREATEUSERNAME,
    title: '创建人',
    ellipsis: { showTitle: true },
  },
  {
    key: 'action',
    title: '操作',
    render: (text, record) => {
      const {
        id, createdCustomed
      } = record;
      return (
        <>
          {!createdCustomed && !editingKey && record[MENU_KEY.TYPE] === MENU_TYPE.MODULE ? (<span
            className="link-btn"
            onClick={(e) => {
              onAddChild({ id });
            }}
          >
            子项
          </span>) : null}
          <span
            className="link-btn ml10"
            onClick={(e) => {
              e.stopPropagation();
              deleteConfirm({
                onOk: () => {
                  if (createdCustomed) {
                    onDel(record);
                    return;
                  }
                  delMenuServices(id).then((res) => {
                    if (res?.code !== API_CODE.SUCCESS) {
                      openNotification(NOTIFICATION_TYPE.ERROR, res?.msg || MESSAGE.DEL_MENU_FAILED);
                      return;
                    }
                    openNotification(NOTIFICATION_TYPE.SUCCESS, MESSAGE.DEL_MENU_SUCCESS);
                    onDel(record);
                  });
                }
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

interface IState {
  menuList: IMenu[],
  menuMap: any,
  searchArea: {
    type: string
    name: string
  }
  editingKey: string
  expandedRowKeys: string[]
}
class MenuList extends React.Component {
  state: IState = {
    menuList: [],
    menuMap: {},
    searchArea: {
      type: '',
      name: ''
    },
    editingKey: '',
    expandedRowKeys: []
  }

  searchFormRef = React.createRef<FormInstance>();

  editMenuFormRef = React.createRef<FormInstance>();

  constructTree = (nodes) => {
    const treeMap = {};
    const treeList = [];
    nodes.forEach((node) => { node && (treeMap[node[MENU_KEY.ID]] = node); });
    nodes.forEach((node) => {
      if (node) {
        const { [MENU_KEY.ID]: id, [MENU_KEY.PID]: pid } = node;
        const parent = treeMap[pid];
        if (parent) {
          !parent[MENU_KEY.CHILDREN] && (parent[MENU_KEY.CHILDREN] = []);
          parent[MENU_KEY.CHILDREN].push(node);
        } else {
          treeList.push(node);
        }
      }
    });
    return {
      list: treeList,
      map: treeMap
    };
  }

  deleteRow = (record) => {
    const { pid, id } = record;
    const menuList = this.state.menuList.slice();
    if (pid) {
      const parentRecord = this.getRecordByRowKey(pid);
      parentRecord.children = parentRecord.children.filter((item) => item.id !== id);
      this.setState({ menuList });
    } else {
      this.setState({
        menuList: menuList.filter((item) => item.id !== id)
      });
    }
  }

  getMenuList = () => {
    const { searchArea } = this.state;
    getMenuListServices(searchArea).then((res) => {
      if (res?.code !== API_CODE.SUCCESS) {
        openNotification(NOTIFICATION_TYPE.ERROR, MESSAGE.GET_MENU_LIST_FAILED);
        return;
      }
      const { list: menuList, map: menuMap } = this.constructTree(res.result);
      this.setState({
        menuList,
        menuMap
      });
    });
  }

  componentDidMount() {
    this.getMenuList();
  }

  handleSearch = () => {
    const searchArea = this.searchFormRef.current?.getFieldsValue([MENU_KEY.NAME, MENU_KEY.TYPE]);
    this.setState({ searchArea }, () => {
      this.getMenuList();
    });
  }

  handleClear = () => {
    this.searchFormRef.current?.resetFields();
    this.setState({ searchArea: {} }, () => {
      this.getMenuList();
    });
  }

  /** 根据编辑行唯一标识和高亮区域感知编辑行索引 */
  getRecordByRowKey=(id) => {
    return this.state.menuMap[id];
  }

  setListWithRecordUpdatedByRowKey = (id, recordUpdated) => {
    const record = this.getRecordByRowKey(id);
    for (const key in recordUpdated) {
      record[key] = recordUpdated[key];
    }
    this.setState({
      menuList: this.state.menuList.slice()
    });
  }

  createMenu = (recordDefault) => {
    const id = `${new Date().valueOf()}`;
    const record = {
      id,
      [MENU_KEY.TYPE]: MENU_TYPE.MODULE,
      [MENU_KEY.CREATEDCUSTOMED]: true,
      [MENU_KEY.EDITABLE]: true,
      [MENU_KEY.GMTMODIFIED]: '',
      [MENU_KEY.CREATEUSERNAME]: '',
      [MENU_KEY.STATUS]: MENU_TYPE.MODULE,
      ...recordDefault
    };
    return record;
  }

  createChildRow = ({ id: pid }) => {
    const newRecord = this.createMenu({ pid });
    const parentRecord = this.getRecordByRowKey(pid);
    /** 加数据 */
    parentRecord.children = [newRecord, ...(parentRecord.children || [])];

    /** 在 map 中加映射 */
    const { menuList, expandedRowKeys, menuMap } = this.state;
    const { id } = newRecord;
    menuMap[id] = newRecord;
    /** 转成 formRef */
    this.editMenuFormRef.current?.setFieldsValue(newRecord);
    this.setState({
      menuList: menuList.slice(),
      expandedRowKeys: [pid, ...expandedRowKeys],
      editingKey: id,
      menuMap
    });
  }

  createRow = () => {
    const newRecord = this.createMenu({});
    const { menuList, menuMap } = this.state;
    const { id } = newRecord;
    menuList.unshift(newRecord);
    menuMap[id] = newRecord;
    this.setState({
      menuList: menuList.slice(),
      editingKey: id,
      menuMap
    });
    this.editMenuFormRef.current?.setFieldsValue(newRecord);
  }

  constructMenuForSave = {
    [SAVE_TYPE.EDIT]: (record) => {
      const {
        id, name, type, pageLink, icon
      } = record;
      return {
        id, name, type, pageLink, icon
      };
    },
    [SAVE_TYPE.ADD]: (record) => {
      const {
        name, type, pageLink, icon, status, pid
      } = record;
      return {
        name, type, pageLink, icon, status, pid
      };
    }
  }

  getRecordFromForm = () => {
    const record = this.editMenuFormRef.current?.getFieldsValue([
      MENU_KEY.ID, MENU_KEY.NAME, MENU_KEY.TYPE, MENU_KEY.PAGELINK, MENU_KEY.ICON, MENU_KEY.STATUS
    ]);
    return record;
  }

  saveMenuByType = {
    [SAVE_TYPE.EDIT]: (record) => {
      return new Promise((resolve, reject) => {
        editMenuServices(record).then((res) => {
          if (res?.code !== API_CODE.SUCCESS) {
            openNotification(NOTIFICATION_TYPE.ERROR, res?.msg || MESSAGE.EDIT_MENU_FAILED);
            resolve({ id: '' });
            return;
          }
          resolve({ id: record.id });
        });
      });
    },
    [SAVE_TYPE.ADD]: (record) => {
      return new Promise((resolve, reject) => {
        addMenuServices(record).then((res) => {
          if (res?.code !== API_CODE.SUCCESS) {
            openNotification(NOTIFICATION_TYPE.ERROR, res?.msg || MESSAGE.ADD_MENU_FAILED);
            resolve({ id: '' });
            return;
          }
          resolve({ id: res?.result });
        });
      });
    }
  }

  getSaveType = (createdCustomed) => {
    if (createdCustomed) {
      return SAVE_TYPE.ADD;
    }
    return SAVE_TYPE.EDIT;
  }

  resetAfterBeingEditable = () => {
    this.editMenuFormRef.current?.resetFields();
    this.setState({
      editingKey: ''
    });
  }

  afterChange = async (newRecord) => {
    const record = await this.saveMenu(newRecord);
    if (record.id) {
      this.getMenuList();
      this.resetAfterBeingEditable();
    }
  }

  afterNoChange = (rowKey) => {
    this.setListWithRecordUpdatedByRowKey(rowKey, { editable: false });
    this.resetAfterBeingEditable();
  }

  isRecordDifferentFromForm = (form, record) => {
    for (const key in form) {
      if (!(key in record) || record[key] !== form[key]) {
        return true;
      }
    }
    return false;
  }

  saveMenu = async (record) => {
    const saveType = this.getSaveType(record.createdCustomed);
    const recordForSave = this.constructMenuForSave[saveType](record);
    const newRecord = await this.saveMenuByType[saveType](recordForSave);
    return { ...record, ...newRecord };
  }

  /** 行保存 */
  saveRow = async () => {
    const { editingKey } = this.state;
    if (!editingKey) return true;
    try {
      await this.editMenuFormRef.current?.validateFields();
      const recordForm = this.getRecordFromForm();
      const record = this.getRecordByRowKey(editingKey);
      const hasDifferences = this.isRecordDifferentFromForm(recordForm, record);
      if (hasDifferences) {
        this.afterChange({ ...record, ...recordForm });
      } else {
        this.afterNoChange(record.id);
      }
      return true;
    } catch (e) {
      return false;
    }
  }

  /** 获取编辑行的为标识集合 */
  getRowKeysEditable = () => {
    return this.state.menuList
      .filter((item) => item.editable)
      .map((item) => item.id);
  }

  /** 双击行 */
  doubleClickRow=(record) => {
    const { editingKey } = this.state;
    if (editingKey === record.id) return;
    this.saveRow().then((canIEdit) => {
      if (!canIEdit) return;
      this.setListWithRecordUpdatedByRowKey(record.id, { editable: true });
      this.setState({
        editingKey: record.id
      });
      this.editMenuFormRef.current?.setFieldsValue(record);
    });
  }

  /** 行失焦 */
  blurRow = (record) => {
    const rowKeysEditable = this.getRowKeysEditable();
    if (rowKeysEditable.includes(record.id)) return;
    this.saveRow();
  }

  render() {
    const { editingKey, menuList, expandedRowKeys } = this.state;
    const columns = getListColumns({
      formRef: this.editMenuFormRef,
      onDel: (record) => {
        this.deleteRow(record);
        this.setState({
          editingKey: ''
        });
      this.editMenuFormRef.current?.resetFields();
      },
      onAddChild: (param) => {
        /** 找到对应的父级id */
        this.createChildRow(param);
      },
      editingKey: this.state.editingKey
    });
    return (
      <>
        <Form
          layout="inline"
          ref={this.searchFormRef}
        >
          <MenuSelect
            name="type"
            className="w-1/5"
            placeholder="全部类型"
          />
          <Form.Item
            className="w-1/3"
            name="name"
          >
            <Input
              placeholder="请输入菜单名称"
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
        <Table
          ref="referenceList"
          expandable = {{
            expandedRowKeys,
            onExpand: (expanded, record) => {
              if (!expanded) {
                this.setState({ expandedRowKeys: lodash.without(expandedRowKeys, record.id) });
                return;
              }
              this.setState({ expandedRowKeys: [...expandedRowKeys, record.id] });
            }
          }}
          rowKey="id"
          formRef={this.editMenuFormRef}
          changeValue = {(changeValues, allValues) => {
            if (!(MENU_KEY.TYPE in changeValues)) return;
            const { id } = allValues;
            this.setListWithRecordUpdatedByRowKey(id, { [MENU_KEY.TYPE]: changeValues[MENU_KEY.TYPE] });
          }}
          title="菜单列表"
          actionAreaRenderer={() => {
            return (
              <Button
                className="mr-2"
                type={BUTTON_TYPE.PRIMARY}
                size={BUTTON_SIZE.SMALL}
                disabled={editingKey !== ''}
                onClick={ this.createRow}
              >添加父节点</Button>
            );
          }}
          doubleClickRow={this.doubleClickRow}
          blurRow={this.blurRow}
          clickRow = {() => { this.saveRow(); }}
          columns={columns}
          dataSource={menuList}
        />
      </>
    );
  }
}
export default MenuList;
