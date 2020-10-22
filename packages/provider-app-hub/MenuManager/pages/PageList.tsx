import React, { useState, useEffect } from "react";
import {
  Button, Form, Select, Input, Switch
} from "antd";
import { CompressOutlined, DragOutlined } from '@ant-design/icons';
import { ColumnsType } from "antd/lib/table";
import dayjs from "dayjs";
import {
  openNotification, getlabelByMenuList, deleteConfirm
} from '@provider-app/table-editor/service';
import { FormInstance } from 'antd/lib/form';
import Table from '@provider-app/table-editor/components/ExpandedInfoEditor';
import CreateModal from '@provider-app/dictionary-manager/components/CreateModal';
import lodash from 'lodash';
import SelectPage from './SelectPage';
import {
  delMenuServices, getMenuListServices, editMenuServices, setMenuStatusServices, addMenuServices
} from "../services/apis";
import {
  NAME_REG, MAX_LEVEL, ICON_DEFAULTVALUE, SAVE_TYPE, MENU_OPTIONS, MESSAGE, API_CODE, NOTIFICATION_TYPE, BUTTON_TYPE, BUTTON_SIZE, MENU_TYPE, MENU_KEY
} from '../constants';

import { IconAppointed, SelectIcon } from './SelectIcon';

type IMenuType = MENU_TYPE.MODULE | MENU_TYPE.PAGE
interface IMenu {
  id: string
  pid: string
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
/**
 * 类型组件：
 * 两种类型：页面，模块
 */
const MenuSelect: React.FC<IMenuSelect> = (props) => {
  const {
    name, className, placeholder
  } = props;
  return (
    <Form.Item
      className = {className}
      name = {name}
    >
      {/* stopPropagation 可以避免触发行保存 */}
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
/**
 * 页面链接组件
 * 非编辑状态显示页面名称（pageName）
 * 编辑状态显示页面名称（pageName），提供点击功能——打开弹窗
 */
const PageChoose: React.FC<IPageChoose> = (props: IPageChoose) => {
  const {
    record, formRef, text, selectPage
  } = props;

  /**
   * 判断页面链接是否可编辑——可编辑装填且菜单类型为页面
   * @param getFieldValue form 方法，用于获取实时菜单类型
   * @param editable 标明当前记录的编辑状态
   */
  const canEdit = (getFieldValue, editable) => {
    const isPage = getFieldValue(MENU_KEY.TYPE) === MENU_TYPE.PAGE;
    return editable && isPage;
  };
  /**
   * 点击弹窗：调用父组件方法，并告知当前页面链接，以在弹窗中回写
   */
  const handleClick = (e) => {
    e.stopPropagation();
    /** 必须是使用 form 方法获取的页面数据，因为 form 的数据不会同步到 record（如果进行实时同步则不能判断是否需要在用户保存时调用后台接口） */
    typeof selectPage === 'function' && selectPage(formRef.current?.getFieldValue(MENU_KEY.PAGELINK));
  };
  /**
   * 考虑到在可编辑状态下，页面链接也可能是不可编辑的（类型为模块），应该要区分显示
   * @param editable 记录的可编辑状态
   * @param getFieldValue
   */
  const getText = (editable, getFieldValue) => {
    return editable ? (getFieldValue(MENU_KEY.PAGENAME)) : text;
  };
  return React.useMemo(() => {
    return (<Form.Item
      shouldUpdate
      noStyle
    >
      {({ getFieldValue }) => {
        const { editable } = record;
        const canIEdit = canEdit(getFieldValue, editable);
        return canIEdit ? (
          <Form.Item
            name={MENU_KEY.PAGENAME}
            rules={[
              { required: true, message: '页面链接必填' },
            ]}
          >
            {/* stopPropagation 可以避免触发行保存 */}
            <Input
              className="cursor-pointer"
              readOnly
              onClick = {(e) => handleClick(e)}
              onBlur = {(e) => e.stopPropagation()}
            />
          </Form.Item>
        ) : getText(editable, getFieldValue);
      }}
    </Form.Item>);
  }, [record.editable, record.type]);
};

interface IIcon {
  record: IMenu
  onSelect?: (param: string) => void
  className: string
}
/** 图标组件 */
const Icon: React.FC<IIcon> = (props: IIcon) => {
  const {
    record, onSelect, className
  } = props;

  /**
   * 点击出现展示图标的弹窗
   * @param e
   * @param iconType 当前图标
   */
  const handleClick = (e, iconType) => {
    /** 不能执行行保存操作 */
    e.stopPropagation();
    /** 由于没有实时保存图标的接口，则必须是记录可编辑下才能更改图标 */
    if (!record.editable) return;
    /** 通知父组件，并提供数据以进行回写 */
    onSelect?.(iconType);
  };
  const getIconKey = (getFieldValue) => {
    return record.editable ? getFieldValue(MENU_KEY.ICON) : record[MENU_KEY.ICON];
  };
  /** 由于菜单名称和图标列都需要展示图标，所以支持 className 设置 */
  const getClassName = (editable: boolean) => {
    const classList = className.split(' ');
    classList.push('w-6');
    /** 记录可编辑下切换鼠标样式标明可编辑图标 */
    editable && classList.push('cursor-pointer');
    return classList.join(' ');
  };
  return (
    <Form.Item
      shouldUpdate
      noStyle
    >
      {({ getFieldValue }) => {
        const key = getIconKey(getFieldValue);
        return (
          <div
            className={getClassName(record.editable)}
            onClick={(e) => { handleClick(e, key); }}
          >
            <IconAppointed
              iconType = {key}
            />
          </div>
        );
      }}
    </Form.Item>
  );
};

/** 编辑列配置 */
const getListColumns = ({
  formRef,
  editingKey,
  expandedRowKeys,
  onDel,
  onAddChild,
  selectPage,
  selectIcon,
  onExpand
}): ColumnsType => [
  {
    key: MENU_KEY.NAME,
    dataIndex: MENU_KEY.NAME,
    title: () => {
      const ExpandIcon = expandedRowKeys.length > 0 ? CompressOutlined : DragOutlined;
      return (
        <>
          {'菜单名称'}
          {/* 缩放/展开菜单 */}
          <ExpandIcon
            onClick={onExpand}
            className="text-2xl ml-1"
            style={{
              verticalAlign: 'baseline'
            }}
          />
        </>);
    },
    ellipsis: { showTitle: true },
    width: 200,
    render: (text, record, index) => {
      return record.editable ? (
        <Form.Item
          rules={[
            { required: true, message: MESSAGE.NAME_REGUIRED },
            { pattern: NAME_REG, message: MESSAGE.NAME_REG_FAILED },
          ]}
          name={MENU_KEY.NAME}
        >
          {/* stopPropagation 可以避免触发行保存 */}
          <Input
            onBlur = {(e) => e.stopPropagation()}
            onClick={(e) => e.stopPropagation()}
          />
        </Form.Item>
      ) : (
        <>
          {/* 不可编辑状态下显示 菜单图标+菜单名称 */}
          <Icon
            className="float-left text-base mt-1"
            record = {record}
          /> <span>{text}</span>
        </>
      );
    }
  },
  {
    key: MENU_KEY.TYPE,
    dataIndex: MENU_KEY.TYPE,
    title: '类型',
    width: 120,
    render: (text, record, index) => {
      const {
        editable, createdCustomed, type, level
      } = record;
      /** 类型为页面 */
      const isPage = type === MENU_TYPE.PAGE;
      /** 模块层级最多为4层，即第5层只能是页面 */
      const isMaxLevel = level === MAX_LEVEL;
      /** 已经入库的数据，不能由模块切回页面，但可以由页面切回模块 */
      const canIEdit = (createdCustomed || isPage) && editable && !isMaxLevel;
      return canIEdit ? (
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
    render: (text, record) => {
      return (
        <Icon
          className="text-xl"
          formRef = {formRef}
          record = {record}
          onSelect = {selectIcon}
        />
      );
    }
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
            /** 避免触发行保存 */
            event.stopPropagation();
            /** 将数据实时存储，以保证调用“新增菜单”接口时，能将 staus 同时保存 */
            if (record[MENU_KEY.EDITABLE]) {
              formRef.current?.setFieldsValue({ status: Number(checked) });
            }
            /** 如果还没有入库，则先不进行“更改状态”的接口调用 */
            if (record[MENU_KEY.CREATEDCUSTOMED]) return;
            /** 实时变更状态 */
            setMenuStatusServices({
              id: record[MENU_KEY.ID],
              status: Number(checked)
            }).then((res) => {
              if (res?.code !== API_CODE.SUCCESS) {
                openNotification(NOTIFICATION_TYPE.ERROR, res?.msg || MESSAGE.SET_STATUS_FAILD);
              }
            });
          }}
          /** 避免触发行保存 */
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
        id, createdCustomed, level
      } = record;
      return (
        <div className="page-list-operate-area">
          {/* 列表中没有编辑项（不能同时存在两行编辑数据），且当前类型为模块时，才能新增子项 */}
          {!editingKey && record[MENU_KEY.TYPE] === MENU_TYPE.MODULE ? (
            <span
              className="link-btn"
              onClick={(e) => {
                /** 告知当前id，以从 menuMap 中找到对应 children 进行操作，level是为了保证，最多值能四层模块 */
                onAddChild({ id, level });
              }}
            >
            子项
            </span>
          ) : null}
          <span
            className="link-btn"
            onClick={(e) => {
              e.stopPropagation();
              deleteConfirm({
                onOk: () => {
                  if (createdCustomed) {
                    /** 删除后需要刷新列表数据 */
                    onDel(record);
                    return;
                  }
                  delMenuServices(id).then((res) => {
                    if (res?.code !== API_CODE.SUCCESS) {
                      openNotification(NOTIFICATION_TYPE.ERROR, res?.msg || MESSAGE.DEL_MENU_FAILED);
                      return;
                    }
                    openNotification(NOTIFICATION_TYPE.SUCCESS, MESSAGE.DEL_MENU_SUCCESS);
                    /** 删除后需要刷新列表数据 */
                    onDel(record);
                  });
                }
              });
            }}
          >
            删除
          </span>
        </div>
      );
    },
  },
];

type UseListData = () => [any[], () => void]

interface IState {
  menuList: IMenu[],
  menuMap: any,

  allExpandedKeysInMenu: string[],
  searchArea: {
    type: string
    name: string
  }
  editingKey: string
  expandedRowKeys: string[]
  visibleModalSelectPage: boolean
  visibleModalSelectIcon: boolean
}
class MenuList extends React.Component {
  state: IState = {
    /** 列表数据 */
    menuList: [],
    /** 以 id（唯一标识）为 key，对应记录为 value 的 map，主要用于定位子项的增删改 */
    menuMap: {},
    /** 用于实现全部数据的展开/收缩 */
    allExpandedKeysInMenu: [],
    searchArea: {
      type: '',
      name: ''
    },
    /** 当前编辑行唯一标识 */
    editingKey: '',
    /** 维护当前列表的展开项 */
    expandedRowKeys: [],
    visibleModalSelectPage: false,
    visibleModalSelectIcon: false
  }

  /** 搜索框表单 */
  searchFormRef = React.createRef<FormInstance>();

  /** 列表数据对应编辑表单 */
  editMenuFormRef = React.createRef<FormInstance>();

  getNodeDefIcon = (type) => {
    return type === MENU_TYPE.MODULE ? ICON_DEFAULTVALUE.MODULE : ICON_DEFAULTVALUE.PAGE;
  };

  /** 对请求回来的菜单列表数据，进行转化 */
  constructTree = (nodes: IMenu[]) => {
    const treeMap = {};
    const treeList: IMenu[] = [];
    const allExpandedKeys: string[] = [];
    nodes.forEach((node) => {
      if (!node) return;
      const {
        [MENU_KEY.ID]: id,
        [MENU_KEY.ICON]: icon,
        [MENU_KEY.TYPE]: type
      } = node;
      /** 以 id（唯一标识）为 key，对应记录为 value 的 map，主要用于定位子项的增删改 */
      treeMap[id] = node;
      // 拼记录的默认 icon
      node[MENU_KEY.ICON] = icon || this.getNodeDefIcon(type);
    });
    nodes.forEach((node) => {
      if (node) {
        const { [MENU_KEY.PID]: pid } = node;
        const parent = treeMap[pid];
        if (parent) {
          /** 用于实现全部数据的展开/收缩 */
          !allExpandedKeys.includes(pid) && allExpandedKeys.push(pid);
          !parent[MENU_KEY.CHILDREN] && (parent[MENU_KEY.CHILDREN] = []);
          parent[MENU_KEY.CHILDREN].push(node);
        } else {
          treeList.push(node);
        }
      }
    });
    return {
      list: treeList,
      map: treeMap,
      allExpandedKeys
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
      const { list: menuList, map: menuMap, allExpandedKeys: allExpandedKeysInMenu } = this.constructTree(res.result);
      this.setState({
        menuList,
        menuMap,
        allExpandedKeysInMenu
      });
    });
  }

  componentDidMount() {
    this.getMenuList();
  }

  handleSearch = () => {
    const searchArea = this.searchFormRef.current?.getFieldsValue([MENU_KEY.NAME, MENU_KEY.TYPE]);
    this.setState({
      searchArea,
      expandedRowKeys: []
    }, () => {
      this.getMenuList();
    });
  }

  handleClear = () => {
    this.searchFormRef.current?.resetFields();
    this.setState({
      searchArea: {},
      expandedRowKeys: []
    }, () => {
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
      [MENU_KEY.ICON]: ICON_DEFAULTVALUE.MODULE,
      [MENU_KEY.LEVEL]: 0,
      ...recordDefault
    };
    return record;
  }

  createChildRow = ({ id: pid, level: levelParent }) => {
    const menuDef = { pid };
    if (levelParent === 4) {
      Object.assign(menuDef, {
        [MENU_KEY.TYPE]: MENU_TYPE.PAGE,
        [MENU_KEY.LEVEL]: MAX_LEVEL,
        [MENU_KEY.ICON]: ICON_DEFAULTVALUE.PAGE
      });
    }
    const newRecord = this.createMenu(menuDef);
    console.log(newRecord);
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
    const {
      editingKey, menuList, expandedRowKeys, visibleModalSelectPage, visibleModalSelectIcon
    } = this.state;
    const columns = getListColumns({
      formRef: this.editMenuFormRef,
      editingKey: this.state.editingKey,
      expandedRowKeys,
      onDel: (record) => {
        this.deleteRow(record);
        this.setState({
          editingKey: ''
        });
        this.getMenuList();
      this.editMenuFormRef.current?.resetFields();
      },
      onAddChild: (param) => {
        /** 找到对应的父级id */
        this.createChildRow(param);
      },
      selectPage: (selectedPageLink) => {
        this.setState({
          visibleModalSelectPage: true
        });
      },
      selectIcon: (iconType) => {
        this.setState({
          visibleModalSelectIcon: true
        });
      },
      onExpand: () => {
        this.setState({
          expandedRowKeys: expandedRowKeys.length === 0 ? this.state.allExpandedKeysInMenu : []
        });
      }
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
          className="mt-2"
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
          changeValue = {(changeValues) => {
            if (MENU_KEY.TYPE in changeValues) {
              this.editMenuFormRef.current?.setFieldsValue({
                [MENU_KEY.ICON]: this.getNodeDefIcon(this.editMenuFormRef.current?.getFieldValue(MENU_KEY.TYPE))
              });
              if (changeValues[MENU_KEY.TYPE] === MENU_TYPE.MODULE) {
                this.editMenuFormRef.current?.setFieldsValue({
                  [MENU_KEY.PAGELINK]: '',
                  [MENU_KEY.PAGENAME]: '',
                });
              }
            }
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
        { visibleModalSelectPage
          ? (<CreateModal
            width="750px"
            title="选择菜单页面"
            modalVisible={visibleModalSelectPage}
            onCancel={() => this.setState({ visibleModalSelectPage: false })}
          >

            <SelectPage
              currentPage = {{
                pageLink: this.editMenuFormRef.current?.getFieldValue(MENU_KEY.PAGELINK),
                pageName: this.editMenuFormRef.current?.getFieldValue(MENU_KEY.PAGENAME)
              }}
              type="selectPage"
              onOk={({ pageName, pageLink }) => {
                this.setState({ visibleModalSelectPage: false });
                this.editMenuFormRef.current?.setFieldsValue({ pageName, pageLink });
              }}
              onCancel={() => this.setState({ visibleModalSelectPage: false })}
            />
          </CreateModal>)
          : null }
        { visibleModalSelectIcon
          ? (<CreateModal
            width="750px"
            title="选择图标"
            modalVisible={visibleModalSelectIcon}
            onCancel={() => this.setState({ visibleModalSelectIcon: false })}
          >

            <SelectIcon
              currentIcon = {this.editMenuFormRef.current?.getFieldValue(MENU_KEY.ICON)}
              type="selectIcon"
              onOk={(icon) => {
                this.setState({ visibleModalSelectIcon: false });
                this.editMenuFormRef.current?.setFieldsValue({ [MENU_KEY.ICON]: icon });
              }}
              onCancel={() => this.setState({ visibleModalSelectIcon: false })}
            />
          </CreateModal>)
          : null }
      </>
    );
  }
}
export default MenuList;
