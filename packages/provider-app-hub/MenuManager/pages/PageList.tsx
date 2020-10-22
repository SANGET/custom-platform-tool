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
        id, createdCustomed, [MENU_KEY.TYPE]: type
      } = record;
      return (
        <div className="page-list-operate-area">
          {/* 列表中没有编辑项（不能同时存在两行编辑数据），且当前类型为模块时，才能新增子项 */}
          {!editingKey && type === MENU_TYPE.MODULE ? (
            <span
              className="link-btn"
              onClick={(e) => {
                /** 告知当前id，以从 menuMap 中找到对应 children 进行操作，level是为了保证，最多值能四层模块 */
                onAddChild(record);
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

  /** 获取列表数据 */
  getMenuList = () => {
    return new Promise((resolve, reject) => {
      const { searchArea } = this.state;
      getMenuListServices(searchArea).then((res) => {
        if (res?.code !== API_CODE.SUCCESS) {
          openNotification(NOTIFICATION_TYPE.ERROR, MESSAGE.GET_MENU_LIST_FAILED);
          return;
        }
        /** 进行数据转换 */
        const { list: menuList, map: menuMap, allExpandedKeys: allExpandedKeysInMenu } = this.constructTree(res.result);
        this.setState({
          menuList,
          menuMap,
          allExpandedKeysInMenu
        }, () => {
          resolve();
        });
      });
    });
  }

  componentDidMount() {
    this.getMenuList();
  }

  /** 点击搜索 */
  handleSearch = () => {
    const searchArea = this.searchFormRef.current?.getFieldsValue([MENU_KEY.NAME, MENU_KEY.TYPE]);
    this.setState({
      /** 缓存数据 */
      searchArea,
      /** 搜索数据后，不展开任何数据 */
      expandedRowKeys: []
    }, () => {
      this.getMenuList();
    });
  }

  handleClear = () => {
    this.searchFormRef.current?.resetFields();
    this.setState({
      /** 清空缓存搜索框数据 */
      searchArea: {},
      /** 搜索数据后，不展开任何数据 */
      expandedRowKeys: []
    }, () => {
      this.getMenuList();
    });
  }

  /** 根据编辑行唯一标识获取对应编辑行数据 */
  getRecordByRowKey=(id) => {
    return this.state.menuMap[id];
  }

  /**
   * 根据编辑行唯一标识进行行数据更新
   * id: 唯一标识
   * recordUpdated: 要进行更新的行数据，键值对
   */
  setListWithRecordUpdatedByRowKey = (id, recordUpdated) => {
    const record = this.getRecordByRowKey(id);
    for (const key in recordUpdated) {
      record[key] = recordUpdated[key];
    }
    this.setState({
      menuList: this.state.menuList.slice()
    });
  }

  /**
   * 创建菜单记录数据，数据优先外部传入的字段默认值
   * recordDefault: 字段默认值
   */
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

  /**
   * 新建子项
   * @param param0.id 当前项唯一标识
   * @param param0.level 当前项 level
   */
  createChildRow = (parentRecord) => {
    const { id: pid, level: levelParent, children = [] } = parentRecord;
    const menuDef = { pid };
    /** 需求上要求最多只能 4 层模块，则第 5 层只能是页面类型 */
    if (levelParent === 4) {
      Object.assign(menuDef, {
        [MENU_KEY.TYPE]: MENU_TYPE.PAGE,
        [MENU_KEY.LEVEL]: MAX_LEVEL,
        [MENU_KEY.ICON]: ICON_DEFAULTVALUE.PAGE
      });
    }
    /** 创建子项数据 */
    const newRecord = this.createMenu(menuDef);
    /** 加数据 */
    parentRecord.children = [newRecord, ...children];
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

  /**
   * 新建父节点
   */
  createRow = () => {
    const newRecord = this.createMenu({});
    const { menuList, menuMap } = this.state;
    const { id } = newRecord;
    /** 增加对应数据 */
    menuList.unshift(newRecord);
    menuMap[id] = newRecord;
    this.setState({
      menuList: menuList.slice(),
      editingKey: id,
      menuMap
    });
    /** 新建行直接变为可编辑 */
    this.editMenuFormRef.current?.setFieldsValue(newRecord);
  }

  /**
   * 调用接口（修改，新增），所对应的数据过滤
   */
  constructMenuForSave = {
    /** 修改 */
    [SAVE_TYPE.EDIT]: (record) => {
      const {
        id, name, type, pageLink, icon
      } = record;
      return {
        id, name, type, pageLink, icon
      };
    },
    /** 新增 */
    [SAVE_TYPE.ADD]: (record) => {
      const {
        name, type, pageLink, icon, status, pid
      } = record;
      return {
        name, type, pageLink, icon, status, pid
      };
    }
  }

  /** 从编辑的表单中提取数据 */
  getRecordFromForm = () => {
    const record = this.editMenuFormRef.current?.getFieldsValue([
      MENU_KEY.ID, MENU_KEY.NAME, MENU_KEY.TYPE, MENU_KEY.PAGELINK, MENU_KEY.ICON, MENU_KEY.STATUS
    ]);
    return record;
  }

  /**
   * 调用接口（修改，新增），所对应的调用过程
   */
  saveMenuByType = {
    /** 修改 */
    [SAVE_TYPE.EDIT]: (record) => {
      return new Promise((resolve, reject) => {
        editMenuServices(record).then((res) => {
          if (res?.code !== API_CODE.SUCCESS) {
            openNotification(NOTIFICATION_TYPE.ERROR, res?.msg || MESSAGE.EDIT_MENU_FAILED);
            resolve({ id: '' });
            return;
          }
          /** 成功即返回当前行的唯一标识，为了与新增数据保持一致 */
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
          /** 成功即返回当前行的唯一标识（为了，变更列表中前台创建的唯一标识，为后台提供的准确的唯一标识） */
          resolve({ id: res?.result });
        });
      });
    }
  }

  /** 判断调用接口类型 */
  getSaveType = (createdCustomed) => {
    /** 用户当前创建的数据，调用新增接口 */
    if (createdCustomed) {
      return SAVE_TYPE.ADD;
    }
    /** 非用户当前创建的数据，调用修改接口 */
    return SAVE_TYPE.EDIT;
  }

  /**
   * 置列表为不可编辑的重置操作
   */
  resetAfterBeingEditable = () => {
    this.editMenuFormRef.current?.resetFields();
    this.setState({
      editingKey: ''
    });
  }

  /**
   * 数据变更后续的失焦保存数据
   * @param newRecord 变更行
   */
  afterChange = async (newRecord) => {
    const record = await this.saveMenu(newRecord);
    /** id 存在则证明保存成功 */
    if (record.id) {
      /** 刷新列表数据，并进行重置操作 */
      this.getMenuList().then(this.resetAfterBeingEditable);
      // this.resetAfterBeingEditable();
    }
  }

  /**
   * 没有进行数据变更后续的失焦模拟保存数据
   */
  afterNoChange = (rowKey) => {
    /** 变更记录为不可编辑状态 */
    this.setListWithRecordUpdatedByRowKey(rowKey, { editable: false });
    /** 进行重置 */
    this.resetAfterBeingEditable();
  }

  /** 判断用户是否有做改动 */
  isRecordDifferentFromForm = (form, record) => {
    for (const key in form) {
      if (!(key in record) || record[key] !== form[key]) {
        return true;
      }
    }
    return false;
  }

  /** 数据保存 */
  saveMenu = async (record) => {
    /** 获取数据保存类型：修改/新增 */
    const saveType = this.getSaveType(record.createdCustomed);
    /** 获取要进行保存的数据 */
    const recordForSave = this.constructMenuForSave[saveType](record);
    /** 主要是获取接口返回的 id */
    const newRecord = await this.saveMenuByType[saveType](recordForSave);
    return { ...record, ...newRecord };
  }

  /** 行的失焦保存 */
  saveRow = async () => {
    const { editingKey } = this.state;
    /** 没有可编辑行 */
    if (!editingKey) return true;
    try {
      /** 校验可编辑行 */
      await this.editMenuFormRef.current?.validateFields();
      /** 提取表单数据 */
      const recordForm = this.getRecordFromForm();
      /** 获取记录原有数据 */
      const record = this.getRecordByRowKey(editingKey);
      /** 判断是否有改动 */
      const hasDifferences = this.isRecordDifferentFromForm(recordForm, record);
      if (hasDifferences) {
        /** 有改动则调用接口保存数据 */
        this.afterChange({ ...record, ...recordForm });
      } else {
        /** 没有改动则只是变更数据状态 */
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

  /** 双击行——变更为可编辑状态 */
  doubleClickRow=(record) => {
    const { editingKey } = this.state;
    /** 如果数据本身已经是可编辑状态，则不需要做额外操作 */
    if (editingKey === record.id) return;
    /** 保存编辑行数据 */
    this.saveRow().then((canIEdit) => {
      if (!canIEdit) return;
      /** 允许编辑则 */
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
        this.getMenuList().then(() => {
          const { [MENU_KEY.ID]: id } = record;
          if (id !== editingKey) {
            this.setListWithRecordUpdatedByRowKey(editingKey, { editable: true });
            return;
          }
          this.editMenuFormRef.current?.resetFields();
          this.setState({
            editingKey: ''
          });
        });
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
