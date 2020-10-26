import React from 'react';
import { FormInstance } from 'antd/lib/form';
import { getUrlParams } from "@mini-code/request/url-resolve";
import { Button, Tag, Tabs } from 'antd';
import { Link } from "multiple-page-routing";
import lodash from 'lodash';
import CreateModal from '@provider-app/dictionary-manager/components/CreateModal';
import { getTableInfo, allowedDeleted, editTableInfo } from '../apiAgents';
import {
  TABLE_TYPE, NOTIFICATION_TYPE, MESSAGES, BUTTON_TYPE, BUTTON_SIZE, COLUMNS_KEY, FIELDSIZEREGULAR, DATATYPE, REFERENCES_KEY, FOREIGNKEYS_KEY, SPECIES
} from '../constants';
import {
  ITableInfoFromApi, ITableInfoInState, ISpecies, ITableColumnInState
} from '../interface';
import BasicInfoEditor from './BasicInfoEditor';
import ExpandedInfoEditor from './ExpandedInfoEditor';
import getFieldColumns from './FieldColumnsForExpandedInfo';
import { getReferenceColumns, getForeignKeyColumns } from './ReferenceColumnsForExpandedInfo';
import ChooseDict from './ChooseDict';
import CreateReference from './CreateReference';
import { deleteConfirm, openNotification } from '../service';

const { TabPane } = Tabs;
class TableEditor extends React.Component {
  state: ITableInfoInState = {
    /** 表基本信息 */
    basicInfo: {
      tableId: '',
      /** 表名 */
      tableName: '',
      /** 编码 */
      tableCode: '',
      /** 表类型 */
      tableType: 'TABLE',
      /** 所属模块 */
      relatedModuleId: '',
      /** 主表编码（表类型为附属表时起作用 */
      mainTableCode: '',
      /** 主表名（表类型为附属表时起作用 */
      mainTableName: '',
      /** 最大层级（表类型为树形表时起作用 */
      maxLevel: 0,
      /** 表创建类型 */
      species: ISpecies.SYS
    },
    /** 关联页面 */
    relatedPages: [],
    /** 表扩展信息 */
    /** 字段列表 */
    fieldList: [],
    /** 引用字段列表 */
    referenceList: [],
    /** 外键字段列表 */
    foreignKeyList: [],
    /** 扩展信息中的编辑行标识 */
    editingKeyInExpandedInfo: '',
    /** 是否显示系统字段 */
    showSysFields: false,
    /** 高亮tab */
    activeAreaInExpandedInfo: 'fieldList',
    /** 字典弹窗需要回写的字典id数据 */
    dictIdsShowInModal: [],
    /** 是否显示字典弹窗 */
    visibleModalChooseDict: false,
    /** 是否显示引用字段弹窗 */
    visibleModalCreateReference: false,
    /** 是否显示引用字段弹窗 */
    visibleModalCreateForeignKey: false
  };

  basicInfoFormRef = React.createRef<FormInstance>();

  expandInfoFormRef = React.createRef<FormInstance>();

  getRecordFromExpandForm = {
    fieldList: () => {
      const {
        NAME, CODE, FIELDTYPE, DATATYPE: DataType, FIELDSIZE, DECIMALSIZE,
        REQUIRED, UNIQUE, DICTIONARYFOREIGN, PINYINCONVENT, REGULAR, SPECIES: species
      } = COLUMNS_KEY;
      const record = this.expandInfoFormRef.current?.getFieldsValue([
        NAME, CODE, FIELDTYPE, DataType, FIELDSIZE, DECIMALSIZE, REQUIRED,
        UNIQUE, DICTIONARYFOREIGN, PINYINCONVENT, REGULAR, species
      ]);
      return record;
    },
    referenceList: () => {
      const {
        ID, FIELDCODE, FIELDID, FIELDNAME, REFTABLECODE, REFTABLEID, REFDISPLAYCODE, REFFIELDSIZE, REFFIELDTYPE, REFFIELDCODE
      } = FOREIGNKEYS_KEY;
      const record = this.expandInfoFormRef.current?.getFieldsValue([
        ID, FIELDCODE, FIELDID, FIELDNAME, REFTABLECODE, REFTABLEID, REFDISPLAYCODE, REFFIELDSIZE, REFFIELDTYPE, REFFIELDCODE
      ]);
      return record;
    },
    foreignKeyList: () => {
      const {
        ID, FIELDCODE, FIELDID, FIELDNAME, REFTABLECODE, REFTABLEID, REFDISPLAYCODE, REFFIELDSIZE, REFFIELDTYPE, REFFIELDCODE, UPDATESTRATEGY, DELETESTRATEGY
      } = FOREIGNKEYS_KEY;
      const record = this.expandInfoFormRef.current?.getFieldsValue([
        ID, FIELDCODE, FIELDID, FIELDNAME, REFTABLECODE, REFTABLEID, REFDISPLAYCODE, REFFIELDSIZE, REFFIELDTYPE, REFFIELDCODE, UPDATESTRATEGY, DELETESTRATEGY
      ]);
      return record;
    }
  }

  componentWillMount() {
    const id = this.getTableId();
    getTableInfo(id).then((res) => {
      this.constructInfoFromRequest(res);
    });
  }

  /** 从路径上获取表主键，以获取表详情数据 */
  getTableId = () => {
    const urlParam = getUrlParams(undefined, undefined, true);
    return urlParam.id;
  }

  constructFieldListFromRequest = (fieldList) => {
    return fieldList?.map((item) => {
      const {
        tableName: dictionaryForeignCn,
        fieldCode: dictionaryForeign
      } = item.dictionaryForeign || {};
      return {
        ...item, ...item.fieldProperty, dictionaryForeign, dictionaryForeignCn
      };
    }) || [];
  }

  /** 将接口数据设置到 state 上 */
  constructInfoFromRequest = (param: ITableInfoFromApi) => {
    const {
      name, code, type, moduleId, auxTable, treeTable, columns, references, foreignKeys, id,
      relationTables: relatedPages, species
    } = param || {};
    const mainTableName = auxTable?.parentTable?.name;
    const mainTableCode = auxTable?.parentTable?.code;
    const relationType = auxTable?.relationType;
    const maxLevel = treeTable?.maxLevel;
    const newState = {
      basicInfo: {
        tableId: id,
        tableName: name,
        tableCode: code,
        tableType: type,
        relatedModuleId: moduleId,
        mainTableCode,
        mainTableName,
        maxLevel,
        species,
        relationType
      },
      relatedPages,
      fieldList: this.constructFieldListFromRequest(columns),
      /** 引用字段列表 */
      referenceList: references,
      /** 外键字段列表 */
      foreignKeyList: foreignKeys
    };
    this.setState(newState);
    this.basicInfoFormRef?.current?.setFieldsValue({ ...newState.basicInfo });
  }

  constructFieldListForSave = (fieldList) => {
    return fieldList?.map((item) => {
      const {
        id, name, code, fieldType, dataType, fieldSize, decimalSize, required, unique, pinyinConvent, regular, dictionaryForeign, species
      } = item;
      const dictionaryForeignTmpl: {
        dictionaryForeign?: {
          refTableCode: string,
          refFieldCode: string,
          refDisplayFieldCode: string
        }
      } = {};
      if (dictionaryForeign) {
        dictionaryForeignTmpl.dictionaryForeign = {
          refTableCode: dictionaryForeign,
          refFieldCode: 'code',
          refDisplayFieldCode: 'name'
        };
      }
      return {
        id,
        name,
        code,
        fieldType,
        dataType,
        fieldSize,
        decimalSize,
        species,
        fieldProperty: {
          required, unique, pinyinConvent, regular
        },
        ...dictionaryForeignTmpl
      };
    }) || [];
  }

  constructReferenceListForSave = (referencesList) => {
    return referencesList?.map((item, index) => {
      const {
        id, fieldCode, refTableCode, refFieldCode, refDisplayFieldCode
      } = item;
      return {
        id, fieldCode, refTableCode, refFieldCode, refDisplayFieldCode, sequence: index + 1
      };
    }) || [];
  }

  constructForeignKeyListForSave = (foreignKeyList) => {
    return foreignKeyList?.map((item, index) => {
      const {
        id, fieldCode, refTableCode, refFieldCode, refDisplayFieldCode, deleteStrategy, updateStrategy
      } = item;
      return {
        id, fieldCode, refTableCode, refFieldCode, refDisplayFieldCode, sequence: index + 1, deleteStrategy, updateStrategy
      };
    }) || [];
  }

  /** 构建保存时所需数据 */
  constructInfoForSave = () => {
    const {
      basicInfo: {
        tableId: id,
        tableName: name,
        tableCode: code,
        tableType: type,
        relatedModuleId: moduleId,
        mainTableCode,
        maxLevel,
        species
      },
      fieldList,
      /** 引用字段列表 */
      referenceList,
      /** 外键字段列表 */
      foreignKeyList
    } = this.state;
    const relatedTableInfo: {
      auxTable?: { mainTableCode:string},
      treeTable?: { maxLevel:number}
    } = {};
    if (type === TABLE_TYPE.AUX_TABLE) {
      relatedTableInfo.auxTable = { mainTableCode };
    }
    if (type === TABLE_TYPE.TREE) {
      relatedTableInfo.treeTable = { maxLevel };
    }
    return {
      id,
      name,
      code,
      type,
      moduleId,
      species,
      columns: this.constructFieldListForSave(fieldList),
      references: this.constructReferenceListForSave(referenceList),
      foreignKeys: this.constructForeignKeyListForSave(foreignKeyList),
      ...relatedTableInfo
    };
  }

  /** 保存数据 */
  handleSave = async () => {
    try {
      await this.basicInfoFormRef.current?.validateFields();
      await this.expandInfoFormRef.current?.validateFields();
      const param = this.constructInfoForSave();
      editTableInfo(param);
    } catch (e) {
      return false;
    }
  }

  /** 切换tab页 */
  handelChangeTab = (activeAreaInExpandedInfo) => {
    if (this.state.editingKeyInExpandedInfo) return;
    this.setState({ activeAreaInExpandedInfo });
  }

  /** 根据编辑行唯一标识和高亮区域感知编辑行索引 */
  getIndexByEditingKey=() => {
    const { editingKeyInExpandedInfo } = this.state;
    return this.getIndexByRowKey(editingKeyInExpandedInfo);
  }

  getIndexByRowKey = (rowKey) => {
    const { activeAreaInExpandedInfo } = this.state;
    const index = lodash.findIndex(this.state[activeAreaInExpandedInfo], { id: rowKey });
    return index;
  }

  /** 根据编辑行唯一标识和高亮区域感知编辑行索引 */
  getRecordByRowKey=(rowKey) => {
    const { activeAreaInExpandedInfo } = this.state;
    const index = this.getIndexByRowKey(rowKey);
    return this.state[activeAreaInExpandedInfo][index];
  }

  /** 行保存 */
  async saveRow() {
    const { editingKeyInExpandedInfo, activeAreaInExpandedInfo } = this.state;
    if (!editingKeyInExpandedInfo) return true;
    try {
      await this.expandInfoFormRef.current?.validateFields();
      const record = this.getRecordFromExpandForm[activeAreaInExpandedInfo]?.();
      const index = this.getIndexByEditingKey();
      this.setState((previousState) => {
        const newList = previousState[activeAreaInExpandedInfo].slice();
        newList[index] = { ...newList[index], ...record, editable: false };
        return {
          [activeAreaInExpandedInfo]: newList,
          editingKeyInExpandedInfo: ''
        };
      });
      this.expandInfoFormRef.current?.resetFields();
      return true;
    } catch (e) {
      return false;
    }
  }

  /** 获取编辑行的为标识集合 */
  getRowKeysEditable = () => {
    const { activeAreaInExpandedInfo } = this.state;
    return this.state[activeAreaInExpandedInfo]
      ?.filter((item) => item.editable)
      .map((item) => item.id);
  }

  /** 双击行 */
  doubleClickRow=(record) => {
    const { activeAreaInExpandedInfo } = this.state;
    const previousList = this.state[activeAreaInExpandedInfo].slice();
    const index = this.getIndexByRowKey(record.id);
    this.saveRow().then((canIEdit) => {
      if (!canIEdit) return;
      previousList[index] = { ...previousList[index], editable: true };
      this.setState({
        [activeAreaInExpandedInfo]: previousList,
        editingKeyInExpandedInfo: record.id
      });
      this.expandInfoFormRef.current?.setFieldsValue(record);
    });
  }

  /** 行失焦 */
  blurRow = (record) => {
    const rowKeysEditable = this.getRowKeysEditable();
    if (rowKeysEditable.includes(record.id)) return;
    this.saveRow();
  }

  createRow = (record) => {
    const { activeAreaInExpandedInfo } = this.state;
    const list = this.state[activeAreaInExpandedInfo];
    this.setState({
      [activeAreaInExpandedInfo]: [record, ...list],
      editingKeyInExpandedInfo: record.id
    }, () => {
      this.refs[activeAreaInExpandedInfo]?.setNewSelectedRowKeys(record.id);
    });
    this.expandInfoFormRef.current?.setFieldsValue(record);
    return record.id;
  }

  filterFieldListForOptions = () => {
    const { activeAreaInExpandedInfo, fieldList } = this.state;
    const dataTypeMap = {
      referenceList: DATATYPE.QUOTE,
      foreignKeyList: DATATYPE.FK
    };
    return fieldList
      ?.filter((item) => item.dataType === dataTypeMap[activeAreaInExpandedInfo])
      .map((item) => {
        return {
          label: item?.name,
          value: item?.code,
          key: item?.id
        };
      });
  }

  /** 字段列表：构建字段数据 */
  getNewFieldRecord = (recordDefaultValue) => {
    const id = `${new Date().valueOf()}`;
    return {
      [COLUMNS_KEY.ID]: id,
      [COLUMNS_KEY.NAME]: recordDefaultValue?.[COLUMNS_KEY.NAME] || '',
      [COLUMNS_KEY.CODE]: recordDefaultValue?.[COLUMNS_KEY.CODE] || '',
      [COLUMNS_KEY.FIELDTYPE]: recordDefaultValue?.[COLUMNS_KEY.FIELDTYPE] || 'STRING',
      [COLUMNS_KEY.DATATYPE]: recordDefaultValue?.[COLUMNS_KEY.DATATYPE] || 'NORMAL',
      [COLUMNS_KEY.FIELDSIZE]: recordDefaultValue?.[COLUMNS_KEY.FIELDSIZE] || FIELDSIZEREGULAR.STRING.DEFAULT,
      [COLUMNS_KEY.REQUIRED]: recordDefaultValue?.[COLUMNS_KEY.REQUIRED] || false,
      [COLUMNS_KEY.UNIQUE]: recordDefaultValue?.[COLUMNS_KEY.UNIQUE] || false,
      [COLUMNS_KEY.DICTIONARYFOREIGN]: recordDefaultValue?.[COLUMNS_KEY.DICTIONARYFOREIGN] || '',
      [COLUMNS_KEY.DICTIONARYFOREIGNCN]: recordDefaultValue?.[COLUMNS_KEY.DICTIONARYFOREIGNCN] || '',
      [COLUMNS_KEY.PINYINCONVENT]: recordDefaultValue?.[COLUMNS_KEY.PINYINCONVENT] || false,
      [COLUMNS_KEY.REGULAR]: recordDefaultValue?.[COLUMNS_KEY.REGULAR] || '',
      [COLUMNS_KEY.SPECIES]: 'BIS',
      [COLUMNS_KEY.EDITABLE]: true,
      [COLUMNS_KEY.CREATEDCUSTOMED]: true
    };
  }

  /** 字段列表：新建字段 */
  createField = (recordDefaultValue) => {
    const record = this.getNewFieldRecord(recordDefaultValue);
    this.createRow(record);
  }

  /** 字段列表：新建字典字段 */
  createDict = (dictIdsShowInModal) => {
    this.setState({
      visibleModalChooseDict: true,
      dictIdsShowInModal: dictIdsShowInModal || []
    });
  }

  chooseDictOk = (code: string[], name: string[]) => {
    const { editingKeyInExpandedInfo } = this.state;
    if (editingKeyInExpandedInfo === '') {
      /** 新建数据 */
      this.createField({
        [COLUMNS_KEY.DATATYPE]: DATATYPE.DICT,
        [COLUMNS_KEY.DICTIONARYFOREIGN]: code.join(','),
        [COLUMNS_KEY.DICTIONARYFOREIGNCN]: name.join(',')
      });
    } else {
      /** 更改字典数据 */
      this.expandInfoFormRef.current?.setFieldsValue({
        [COLUMNS_KEY.DICTIONARYFOREIGN]: code?.join(','),
        [COLUMNS_KEY.DICTIONARYFOREIGNCN]: name?.join(',')
      });
    }
    this.setState({
      visibleModalChooseDict: false
    });
  }

  /** 字段列表：新建引用字段 */
  createReferenceInFieldList = () => {
    this.setState({
      visibleModalCreateReference: true
    });
  }

  /** 字段列表：新建引用字段回调 */
  createReferenceOk = (fieldDefaultValue) => {
    const id = this.createField({
      [COLUMNS_KEY.NAME]: fieldDefaultValue[REFERENCES_KEY.REFFIELDNAME],
      [COLUMNS_KEY.CODE]: fieldDefaultValue[REFERENCES_KEY.REFFIELDCODE],
      [COLUMNS_KEY.FIELDTYPE]: fieldDefaultValue[REFERENCES_KEY.REFFIELDTYPE],
      [COLUMNS_KEY.DATATYPE]: DATATYPE.QUOTE,
      [COLUMNS_KEY.FIELDSIZE]: fieldDefaultValue[REFERENCES_KEY.REFFIELDSIZE]
    });
    const { referenceList } = this.state;
    this.setState({
      visibleModalCreateReference: false,
      referenceList: [
        {
          [REFERENCES_KEY.FIELDID]: id,
          [REFERENCES_KEY.FIELDCODE]: fieldDefaultValue[REFERENCES_KEY.REFFIELDCODE],
          [REFERENCES_KEY.REFTABLECODE]: fieldDefaultValue[REFERENCES_KEY.REFTABLECODE],
          [REFERENCES_KEY.REFTABLEID]: fieldDefaultValue[REFERENCES_KEY.REFTABLEID],
          [REFERENCES_KEY.REFFIELDCODE]: fieldDefaultValue[REFERENCES_KEY.REFFIELDCODE],
          [REFERENCES_KEY.REFFIELDTYPE]: fieldDefaultValue[REFERENCES_KEY.REFFIELDTYPE],
          [REFERENCES_KEY.REFFIELDSIZE]: fieldDefaultValue[REFERENCES_KEY.REFFIELDSIZE],
          [REFERENCES_KEY.REFDISPLAYCODE]: fieldDefaultValue[REFERENCES_KEY.REFDISPLAYCODE],
          [FOREIGNKEYS_KEY.CREATEDCUSTOMED]: true,
          [FOREIGNKEYS_KEY.SPECIES]: SPECIES.BIS
        },
        ...referenceList
      ]
    });
  }

  /** 字段列表：新建外键字段 */
  createForeignKeyInFieldList = () => {
    this.setState({
      visibleModalCreateForeignKey: true
    });
  }

  /** 字段列表：新建外键字段回调 */
  createForeignKeyOk = (fieldDefaultValue) => {
    const id = this.createField({
      [COLUMNS_KEY.NAME]: fieldDefaultValue[FOREIGNKEYS_KEY.REFFIELDNAME],
      [COLUMNS_KEY.CODE]: fieldDefaultValue[FOREIGNKEYS_KEY.REFFIELDCODE],
      [COLUMNS_KEY.FIELDTYPE]: fieldDefaultValue[FOREIGNKEYS_KEY.REFFIELDTYPE],
      [COLUMNS_KEY.DATATYPE]: DATATYPE.FK,
      [COLUMNS_KEY.FIELDSIZE]: fieldDefaultValue[FOREIGNKEYS_KEY.REFFIELDSIZE]
    });
    const { foreignKeyList } = this.state;
    this.setState({
      visibleModalCreateForeignKey: false,
      foreignKeyList: [
        {
          [FOREIGNKEYS_KEY.FIELDID]: id,
          [FOREIGNKEYS_KEY.FIELDCODE]: fieldDefaultValue[FOREIGNKEYS_KEY.REFFIELDCODE],
          [FOREIGNKEYS_KEY.REFTABLECODE]: fieldDefaultValue[FOREIGNKEYS_KEY.REFTABLECODE],
          [FOREIGNKEYS_KEY.REFTABLEID]: fieldDefaultValue[FOREIGNKEYS_KEY.REFTABLEID],
          [FOREIGNKEYS_KEY.REFFIELDCODE]: fieldDefaultValue[FOREIGNKEYS_KEY.REFFIELDCODE],
          [FOREIGNKEYS_KEY.REFFIELDTYPE]: fieldDefaultValue[FOREIGNKEYS_KEY.REFFIELDTYPE],
          [FOREIGNKEYS_KEY.REFFIELDSIZE]: fieldDefaultValue[FOREIGNKEYS_KEY.REFFIELDSIZE],
          [FOREIGNKEYS_KEY.REFDISPLAYCODE]: fieldDefaultValue[FOREIGNKEYS_KEY.REFDISPLAYCODE],
          [FOREIGNKEYS_KEY.DELETESTRATEGY]: fieldDefaultValue[FOREIGNKEYS_KEY.DELETESTRATEGY],
          [FOREIGNKEYS_KEY.UPDATESTRATEGY]: fieldDefaultValue[FOREIGNKEYS_KEY.UPDATESTRATEGY],
          [FOREIGNKEYS_KEY.CREATEDCUSTOMED]: true,
          [FOREIGNKEYS_KEY.SPECIES]: SPECIES.BIS
        },
        ...foreignKeyList
      ]
    });
  }

  /** 字段列表：复制字段 */
  copyField = (selectedRowKeys) => {
    const selectedRowKey = selectedRowKeys[0];
    const record = this.getRecordByRowKey(selectedRowKey);
    this.createField(record);
  }

  /** 字段列表：判断字段是否可被删除 */
  cantFieldDelete = (selectedRowKeys) => {
    /** 没有选中记录则不允许删除 */
    if ((selectedRowKeys.length || 0) === 0) return true;
    return this.state.fieldList.some((item) => {
      /** 跳过没有被选中的数据 */
      if (!selectedRowKeys.includes(item[COLUMNS_KEY?.ID])) return false;
      /** 非系统自动生成的字段才允许删除 */
      return [SPECIES.SYS, SPECIES.SYS_TMPL, SPECIES.BIS_TMPL].includes(
        item[COLUMNS_KEY.SPECIES]
      );
    });
  }

  deleteRow = (selectedKey) => {
    const { editingKeyInExpandedInfo, activeAreaInExpandedInfo } = this.state;
    const { [activeAreaInExpandedInfo]: dom } = this.refs;
    const { [activeAreaInExpandedInfo]: listInState } = this.state;
    dom.resetSelectedRowKeys([]);
    if (selectedKey === editingKeyInExpandedInfo) {
      this.setState({
        [activeAreaInExpandedInfo]: listInState.slice().filter((item) => item.id !== selectedKey),
        editingKeyInExpandedInfo: ''
      });
      this.expandInfoFormRef.current?.resetFields();
    } else {
      this.setState({
        [activeAreaInExpandedInfo]: listInState.slice().filter((item) => item.id !== selectedKey)
      });
    }
  }

  /** 字段列表：删除字段的相关提示内容 */
  deleteFieldConfirm = (title, selectedKey: string) => {
    const { editingKeyInExpandedInfo, fieldList: fieldListInState } = this.state;
    const { fieldList } = this.refs;
    deleteConfirm({
      title,
      onOk: () => {
        this.deleteRow(selectedKey);
      },
    });
  }

  /** 字段列表；删除字段 */
  deleteField = (selectedRowKeys) => {
    const selectedRowKey = selectedRowKeys[0];
    const record = this.getRecordByRowKey(selectedRowKey);
    const title = MESSAGES.MAY_I_DELETE;
    /** 用户自己创建的数据，可以直接删除 */
    if (record?.createdCustomed) {
      this.deleteFieldConfirm(title, selectedRowKey);
      return;
    }
    /** 非用户自己创建的数据，需要走后台接口判断是否可删除 */
    allowedDeleted({
      tableId: this.state.basicInfo.tableId,
      columnId: selectedRowKey
    }).then((messageList) => {
      if (messageList.length === 0) {
        this.deleteFieldConfirm(title, selectedRowKey);
      } else {
        this.deleteFieldConfirm(messageList.split('，'), selectedRowKey);
      }
    });
  }

  createReference = () => {
    const id = `${new Date().valueOf()}`;
    this.createRow({
      id, createdCustomed: true, species: SPECIES.BIS, editable: true
    });
  }

  deleteReference = (selectedRowKeys) => {
    openNotification(NOTIFICATION_TYPE.WARNING, MESSAGES.DELETE_REFERENCE);
    this.deleteRow(selectedRowKeys[0]);
  }

  blurRowInReferenceList = () => {
    if (this.state.editingKeyInExpandedInfo !== '') {
      openNotification(NOTIFICATION_TYPE.WARNING, MESSAGES.UPDATE_REFERENCE);
    }
    this.saveRow();
  }

  /** 字段列表：切换显示系统字段 */
  toggleShowSysFields = () => {
    this.setState({
      showSysFields: !this.state.showSysFields
    });
  }

  render() {
    const {
      basicInfo, relatedPages, editingKeyInExpandedInfo, showSysFields, activeAreaInExpandedInfo,
      visibleModalChooseDict, dictIdsShowInModal, visibleModalCreateReference, visibleModalCreateForeignKey,
      fieldList, referenceList, foreignKeyList
    } = this.state;
    const fieldColumns = getFieldColumns({
      formRef: this.expandInfoFormRef,
      editDictioary: this.createDict
    });
    const referenceColumns = getReferenceColumns({
      formRef: this.expandInfoFormRef,
      fieldOptions: this.filterFieldListForOptions(),
      list: referenceList
    });
    const foreignKeyColumns = getForeignKeyColumns({
      formRef: this.expandInfoFormRef,
      fieldOptions: this.filterFieldListForOptions(),
      list: foreignKeyList
    });
    return (
      <>
        <BasicInfoEditor
          className="w-4/5 float-left"
          formRef={this.basicInfoFormRef}
          basicInfo={basicInfo}
        />
        <div className="w-1/5 float-left">
          <Button className="ml-2 float-right">取消</Button>
          <Button
            type={BUTTON_TYPE.PRIMARY}
            className="float-right"
            onClick={this.handleSave}
          >保存</Button>
        </div>
        <div className="flex w-full related-pages mb-2">
          <div className="flex-initial" style={{ width: '80px' }}>关联页面：</div>
          <div className="flex-initial link-page-tags flex-grow">
            {relatedPages?.map(({ id, name }) => (
              <Link
                key={id}
                to='/page-designer'
                pathExtend={id}
                params={{
                  title: name,
                  /** 必须要的页面 id */
                  pageID: id
                }}
              >
                <Tag key={id}>{name}</Tag>
              </Link>
            ))}
          </div>
        </div>
        <Tabs onTabClick={this.handelChangeTab} type="card" style={{ width: "100%" }} activeKey={activeAreaInExpandedInfo}>
          <TabPane tab="表字段" key="fieldList">
            { activeAreaInExpandedInfo === 'fieldList' ? (<ExpandedInfoEditor
              rowSelectionType="radio"
              ref="fieldList"
              formRef={this.expandInfoFormRef}
              title="字段管理"
              actionAreaRenderer={(selectedRowKeys) => {
                return (
                  <>
                    <Button
                      className="mr-2"
                      type={BUTTON_TYPE.PRIMARY}
                      size={BUTTON_SIZE.SMALL}
                      disabled={editingKeyInExpandedInfo !== ''}
                      onClick={() => { this.createField({}); }}
                    >+字段</Button>
                    <Button
                      className="mr-2"
                      type={BUTTON_TYPE.PRIMARY}
                      size={BUTTON_SIZE.SMALL}
                      disabled={editingKeyInExpandedInfo !== ''}
                      onClick={() => { this.createDict([]); }}
                    >+字典字段</Button>
                    <Button
                      className="mr-2"
                      type={BUTTON_TYPE.PRIMARY}
                      size={BUTTON_SIZE.SMALL}
                      disabled={editingKeyInExpandedInfo !== ''}
                      onClick={() => { this.createReferenceInFieldList(); }}
                    >+引用字段</Button>
                    <Button
                      className="mr-2"
                      type={BUTTON_TYPE.PRIMARY}
                      size={BUTTON_SIZE.SMALL}
                      disabled={editingKeyInExpandedInfo !== ''}
                      onClick={() => { this.createForeignKeyInFieldList(); }}
                    >+外键字段</Button>
                    <Button
                      className="mr-2"
                      type={BUTTON_TYPE.PRIMARY}
                      size={BUTTON_SIZE.SMALL}
                      disabled={editingKeyInExpandedInfo !== '' || selectedRowKeys.length === 0}
                      onClick={() => { this.copyField(selectedRowKeys); }}
                    >复制</Button>
                    <Button
                      className="mr-2"
                      type={BUTTON_TYPE.PRIMARY}
                      size={BUTTON_SIZE.SMALL}
                      disabled={
                        this.cantFieldDelete(selectedRowKeys)
                      }
                      onClick={() => { this.deleteField(selectedRowKeys); }}
                    >删除</Button>
                    <Button
                      type={BUTTON_TYPE.PRIMARY}
                      size={BUTTON_SIZE.SMALL}
                      disabled={editingKeyInExpandedInfo !== ''}
                      onClick={this.toggleShowSysFields}
                    >{showSysFields ? '隐藏' : '显示'}系统字段</Button>
                  </>
                );
              }}
              doubleClickRow={this.doubleClickRow}
              blurRow={this.blurRow}
              clickRow = {() => { this.saveRow(); }}
              columns={fieldColumns}
              dataSource={fieldList.filter((item) => {
                return showSysFields || ![SPECIES.SYS, SPECIES.SYS_TMPL].includes(item.species);
              })}
            />) : null }
          </TabPane>
          <TabPane tab="引用表" key="referenceList">
            { activeAreaInExpandedInfo === 'referenceList' ? (
              <ExpandedInfoEditor
                rowSelectionType="radio"
                ref="referenceList"
                formRef={this.expandInfoFormRef}
                title="引用字段管理"
                actionAreaRenderer={(selectedRowKeys) => {
                  return (
                    <>
                      <Button
                        className="mr-2"
                        type={BUTTON_TYPE.PRIMARY}
                        size={BUTTON_SIZE.SMALL}
                        disabled={editingKeyInExpandedInfo !== ''}
                        onClick={() => { this.createReference(); }}
                      >新增</Button>
                      <Button
                        className="mr-2"
                        type={BUTTON_TYPE.PRIMARY}
                        size={BUTTON_SIZE.SMALL}
                        disabled={editingKeyInExpandedInfo !== '' || selectedRowKeys.length === 0}
                        onClick={() => { this.deleteReference(selectedRowKeys); }}
                      >删除</Button>
                    </>
                  );
                }}
                doubleClickRow={this.doubleClickRow}
                blurRow={this.blurRowInReferenceList}
                clickRow = {() => { this.saveRow(); }}
                columns={referenceColumns}
                dataSource={referenceList}
              />) : null }
          </TabPane>
          <TabPane tab="外键设置" key="foreignKeyList">
            { activeAreaInExpandedInfo === 'foreignKeyList' ? (
              <ExpandedInfoEditor
                rowSelectionType="radio"
                ref="foreignKeyList"
                formRef={this.expandInfoFormRef}
                title="外键字段管理"
                actionAreaRenderer={(selectedRowKeys) => {
                  return (
                    <>
                      <Button
                        className="mr-2"
                        type={BUTTON_TYPE.PRIMARY}
                        size={BUTTON_SIZE.SMALL}
                        disabled={editingKeyInExpandedInfo !== ''}
                        onClick={() => { this.createReference(); }}
                      >新增</Button>
                      <Button
                        className="mr-2"
                        type={BUTTON_TYPE.PRIMARY}
                        size={BUTTON_SIZE.SMALL}
                        disabled={editingKeyInExpandedInfo !== '' || selectedRowKeys.length === 0}
                        onClick={() => { this.deleteReference(selectedRowKeys); }}
                      >删除</Button>
                    </>
                  );
                }}
                doubleClickRow={this.doubleClickRow}
                blurRow={this.blurRowInReferenceList}
                clickRow = {() => { this.saveRow(); }}
                columns={foreignKeyColumns}
                dataSource={foreignKeyList}
              />) : null }
          </TabPane>
        </Tabs>
        { visibleModalChooseDict
          ? (<CreateModal
            title="选择字典"
            modalVisible={visibleModalChooseDict}
            onCancel={() => this.setState({ visibleModalChooseDict: false })}
          >
            <ChooseDict
              selectedRowKeys = {dictIdsShowInModal}
              onOk={this.chooseDictOk}
              onCancel={() => this.setState({ visibleModalChooseDict: false })}
            />
          </CreateModal>)
          : null }
        { visibleModalCreateReference
          ? (<CreateModal
            title="引用字段设置"
            modalVisible={visibleModalCreateReference}
            onCancel={() => this.setState({ visibleModalCreateReference: false })}
          >
            <CreateReference
              type="reference"
              onOk={this.createReferenceOk}
              onCancel={() => this.setState({ visibleModalCreateReference: false })}
            />
          </CreateModal>)
          : null }
        { visibleModalCreateForeignKey
          ? (<CreateModal
            title="外键字段设置"
            modalVisible={visibleModalCreateForeignKey}
            onCancel={() => this.setState({ visibleModalCreateForeignKey: false })}
          >

            <CreateReference
              type="foreignKey"
              onOk={this.createForeignKeyOk}
              onCancel={() => this.setState({ visibleModalCreateForeignKey: false })}
            />
          </CreateModal>)
          : null }
      </>
    );
  }
}
export default TableEditor;
