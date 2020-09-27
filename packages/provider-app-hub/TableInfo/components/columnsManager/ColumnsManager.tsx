import React, { useReducer } from 'react';
import {
  Table, Descriptions, Button, Row, Form
} from 'antd';

import { KeyOutlined } from '@ant-design/icons';
import { FormInstance } from 'antd/lib/form';
import {
  BUTTON_TYPE, BUTTON_SIZE, COLUMNS_KEY, SPECIES, SPECIESCN, DATATYPE, DATATYPEMENU, FIELDTYPE,
  FIELDSIZEREGULAR, NOTIFICATION_TYPE, API_SUCESS_CODE, API_ERROR_MSG
} from './constant';
import {
  Name, Code, FieldType, FieldSize, DataType, DecimalSize, Required, Unique, PinyinConvert, Dict
} from './columns';
import { CreateModal } from '../CreateModel';
import { ChooseDict } from './modal';
import RenderText from '../RenderText';
import { ITableColumn } from '../../interface';
import {
  columnReducer, getIndexByEditingKey, openNotification, getRowKeysEditable, deleteConfirm
} from './service';
import { allowedDeleted } from '../../api';

interface Item {
  name: string
  code: string
}
interface IProps {
  tableId: string
  columns: ITableColumn[]
  dispatchInfo: ({ type: string, name: any })=>void
}
export const ColumnsManager: React.FC<IProps> = React.memo((props: IProps) => {
  const { columns, dispatchInfo, tableId } = props;
  const [columnsInfo, dispatchColumns] = useReducer(columnReducer, {
    /** 选中行列表 */
    selectedRowKeys: [],
    /** 编辑行的索引 */
    editingKey: '',
    /** 是否显示字典弹窗 */
    visibleChooseDictModal: false,
    /** 数据类型下拉项 */
    dataTypeMenu: DATATYPEMENU[FIELDTYPE.STRING],
    /** 长度的输入，默认值和最大长度 */
    fieldSizeRegular: FIELDSIZEREGULAR[FIELDTYPE.STRING],
    /** 字典 */
    dictId: '',
    /** 默认显示业务字段 */
    showSYSSpecies: false
  });
  const [form] = Form.useForm();

  /** 对form表单设值，当前时刻有且仅有一行数据可列入表单编辑 */
  const setRecordToForm = (formTmpl: FormInstance, record: ITableColumn) => {
    const {
      name, code, fieldType, dataType, fieldSize, decimalSize, id,
      required, unique, dictionaryForeign, dictionaryForeignCn, pinyinConvert, regular, species
    } = record;
    formTmpl.setFieldsValue({
      id,
      name,
      code,
      fieldType,
      dataType,
      fieldSize,
      decimalSize,
      required,
      unique,
      dictionaryForeign,
      dictionaryForeignCn,
      pinyinConvert,
      regular,
      species
    });
    return true;
  };
  /** 将表单数据提回记录，当前时刻有且仅有一行数据可从表单列入 */
  const getRecordFromForm = (formTmpl: FormInstance) => {
    const {
      NAME, CODE, FIELDTYPE, DATATYPE, FIELDSIZE, DECIMALSIZE, REQUIRED, UNIQUE, DICTIONARYFOREIGN, PINYINCONVERT, REGULAR, SPECIES
    } = COLUMNS_KEY;
    const recordNew = formTmpl.getFieldsValue([
      NAME, CODE, FIELDTYPE, DATATYPE, FIELDSIZE, DECIMALSIZE, REQUIRED, UNIQUE, DICTIONARYFOREIGN, PINYINCONVERT, REGULAR, SPECIES
    ]);
    return recordNew;
  };
  const dispatchColumnsAndEditingIndex = (columnsTmpl, editingKey) => {
    dispatchInfo({
      type: 'editColumns',
      name: columnsTmpl
    });
    dispatchColumns({
      type: 'changeEditingKey',
      name: editingKey
    });
  };
  /** 保存编辑行数据 */
  const saveRow = async (formTmpl: FormInstance) => {
    const { editingKey } = columnsInfo;
    if (editingKey === '') return true;
    const index = getIndexByEditingKey(editingKey, columns);
    try {
      await formTmpl.validateFields();
      const record = getRecordFromForm(formTmpl);
      dispatchColumnsAndEditingIndex({
        [index]: {
          ...columns[index], ...record, editable: false
        }
      }, '');
      dispatchInfo({
        type: 'changeInfo',
        name: { columnsValid: true }
      });
      return true;
    } catch (e) {
      dispatchInfo({
        type: 'changeInfo',
        name: { columnsValid: false }
      });
      return false;
    }
  };
  /** 行的双击操作 */
  const handleRowDoubleClick = (formTmpl: FormInstance, record: ITableColumn) => {
    let { editingKey } = columnsInfo;
    if (record?.[COLUMNS_KEY?.ID] === editingKey) return;
    saveRow(formTmpl).then((canIEdit) => {
      if (!canIEdit) return;
      editingKey = record?.[COLUMNS_KEY?.ID];
      setRecordToForm(formTmpl, record);
      const index = getIndexByEditingKey(editingKey, columns);
      const columnsTmpl = { [index]: { editable: true } };
      dispatchColumnsAndEditingIndex(columnsTmpl, editingKey);
    });
  };
  const handleRowClick = (formTmpl: FormInstance, record: ITableColumn) => {
    const { editingKey } = columnsInfo;
    dispatchColumns({ type: 'pushSelectedRowKey', name: record?.[COLUMNS_KEY.ID] });
    if (record?.[COLUMNS_KEY?.ID] === editingKey) return;
    saveRow(formTmpl);
  };
  /** 行失焦操作 */
  const handleBlur = (rowKey: string) => {
    const rowKeysEditable = getRowKeysEditable(columns);
    if (rowKeysEditable.includes(rowKey)) return;
    saveRow(form);
  };
  const createRow = (obj) => {
    const id = `${new Date().valueOf()}`;
    const row: ITableColumn = {
      [COLUMNS_KEY.ID]: id,
      [COLUMNS_KEY.NAME]: '',
      [COLUMNS_KEY.CODE]: '',
      [COLUMNS_KEY.FIELDTYPE]: FIELDTYPE.STRING,
      [COLUMNS_KEY.DATATYPE]: obj?.[COLUMNS_KEY.DATATYPE] || DATATYPE.NORMAL,
      [COLUMNS_KEY.FIELDSIZE]: FIELDSIZEREGULAR.STRING.DEFAULT,
      [COLUMNS_KEY.REQUIRED]: false,
      [COLUMNS_KEY.UNIQUE]: false,
      [COLUMNS_KEY.DICTIONARYFOREIGN]: obj?.[COLUMNS_KEY.DICTIONARYFOREIGN] || '',
      [COLUMNS_KEY.DICTIONARYFOREIGNCN]: obj?.[COLUMNS_KEY.DICTIONARYFOREIGNCN] || '',
      [COLUMNS_KEY.PINYINCONVERT]: false,
      [COLUMNS_KEY.REGULAR]: '',
      [COLUMNS_KEY.SPECIES]: SPECIES.BIS,
      [COLUMNS_KEY.EDITABLE]: true,
      [COLUMNS_KEY.CREATEDCUSTOMED]: true
    };
    dispatchInfo({
      type: 'unShiftColumn',
      name: row
    });
    dispatchColumns({
      type: 'allIn',
      name: {
        editingKey: id,
        dataTypeMenu: DATATYPEMENU[FIELDTYPE.STRING],
        selectedRowKeys: [id]
      }
    });
    dispatchInfo({
      type: 'changeInfo',
      name: { columnsValid: false }
    });
    setRecordToForm(form, row);
  };
  /** +字段 */
  const handleCreatRow = () => {
    saveRow(form).then((canICreate) => {
      if (!canICreate) return;
      createRow({});
    });
  };
  /** +字典 */
  const handleCreateDict = () => {
    saveRow(form).then((canICreateDict) => {
      canICreateDict && dispatchColumns({
        type: 'setVisibleChooseDictModal',
        name: true
      });
    });
  };
  /** +字典字段，选择字典，后续 */
  const handleChooseDictOk = (id: string, name: string) => {
    (columnsInfo.editingKey === '' && createRow({
      [COLUMNS_KEY.DATATYPE]: DATATYPE.DICT,
      [COLUMNS_KEY.DICTIONARYFOREIGN]: id,
      [COLUMNS_KEY.DICTIONARYFOREIGNCN]: name,
    })) || (form.setFieldsValue({
      [COLUMNS_KEY.DICTIONARYFOREIGNCN]: name,
      [COLUMNS_KEY.DICTIONARYFOREIGN]: id,
    }));
    dispatchColumns({
      type: 'setVisibleChooseDictModal',
      name: false
    });
  };
  /** 复制 */
  const handleCopy = () => {
    saveRow(form).then((canICopy) => {
      if (!canICopy) return;
      const selectedKey = columnsInfo?.selectedRowKeys?.length > 0 ? columnsInfo?.selectedRowKeys?.[0] : '';
      const selectedRecord = selectedKey
        ? columns.filter((item) => item?.[COLUMNS_KEY.ID] === selectedKey)[0] : columns[0];
      const {
        name, code
      } = selectedRecord;
      const newRecord = {
        ...selectedRecord, name: `${name}1`, code: `${code}1`, editable: true, createCustomed: true, id: `${new Date().valueOf()}`, species: SPECIES.BIS
      };
      dispatchInfo({
        type: 'unShiftColumn',
        name: newRecord
      });
      setRecordToForm(form, newRecord);
      dispatchColumns({
        type: 'changeEditingIndex',
        name: 0
      });
    });
  };
  const deleteConfirmPlus = (title, selectedKey) => {
    deleteConfirm({
      title,
      onOk() {
        dispatchInfo({
          type: 'deleteColumnsById',
          name: selectedKey
        });
        dispatchColumns({ type: 'allIn', name: { selectedRowKeys: [], editingKey: '' } });
        dispatchInfo({
          type: 'changeInfo',
          name: { columnsValid: false }
        });
      },
    });
  };
  /** 删除字段 */
  const handleDelete = () => {
    const selectedKey = columnsInfo?.selectedRowKeys?.[0];
    if (!selectedKey) return;
    const record = columns.filter((item) => item?.[COLUMNS_KEY?.ID] === selectedKey)?.[0];
    let title = '是否确认删除？';
    if (record?.[COLUMNS_KEY?.CREATEDCUSTOMED]) {
      deleteConfirmPlus(title, selectedKey);
      return;
    }
    allowedDeleted({
      tableId, columnId: selectedKey
    }).then((res) => {
      if (res?.code !== API_SUCESS_CODE.GETTABLEINFO) {
        /** 如果接口没有提供提示信息 */
        if (!res?.msg) {
          return openNotification(NOTIFICATION_TYPE.ERROR, API_ERROR_MSG.ALLOWDELETE);
        }
        title = res.msg;
      }
      return deleteConfirmPlus(title, selectedKey);
    });
  };
  const cantColumnDelete = (columnsTmpl, selectedKey) => {
    /** 没有选中记录则不允许删除 */
    if ((selectedKey?.length || 0) === 0) return true;
    return columnsTmpl.some((item:ITableColumn) => {
      /** 跳过没有被选中的数据 */
      if (!selectedKey.includes(item?.[COLUMNS_KEY?.ID])) return false;
      /** 非系统自动生成的字段才允许删除 */
      return [SPECIES.SYS, SPECIES.SYS_TMPL, SPECIES.BIS_TMPL].includes(
        item?.[COLUMNS_KEY.SPECIES]
      );
    });
  };
  /** 显示/隐藏系统字段 */
  const changeColumnsShowBySpecies = () => {
    const showSYSSpecies = columnsInfo?.showSYSSpecies;
    dispatchColumns({
      type: 'changeShowSysSpecies',
      name: !showSYSSpecies
    });
  };
  const filterDataSource = (columnsTmpl, showSYSSpecies) => {
    const showSepecies = [SPECIES.BIS, SPECIES.BIS_TMPL];
    showSYSSpecies && showSepecies.push(SPECIES.SYS, SPECIES.SYS_TMPL);
    return columnsTmpl.filter((item) => showSepecies.includes(item?.[COLUMNS_KEY.SPECIES]));
  };
  const columnShowConfig = [
    {
      title: '序号', width: 120, key: COLUMNS_KEY.INDEX, render: (text, record, index) => { return `${index + 1}`; }
    },
    {
      title: '字段名称',
      key: COLUMNS_KEY.NAME,
      dataIndex: COLUMNS_KEY.NAME,
      width: 120,
      render: (text, record) => {
        return (
          <Name
            text = {text}
            record = {record}
            form = {form}
          />
        );
      }
    },
    {
      title: '字段编码',
      key: COLUMNS_KEY.CODE,
      dataIndex: COLUMNS_KEY.CODE,
      width: 120,
      render: (text, record) => (
        <Code
          text = {text}
          record = {record}
          form = {form}
        />
      )
    },
    {
      title: '字段类型',
      key: COLUMNS_KEY.FIELDTYPE,
      dataIndex: COLUMNS_KEY.FIELDTYPE,
      width: 120,
      render: (text, record) => (
        <FieldType
          text = {text}
          record = {record}
          form = {form}
          dispatchColumns = {dispatchColumns}
        />
      )
    },
    {
      title: '数据类型',
      key: COLUMNS_KEY.DATATYPE,
      dataIndex: COLUMNS_KEY.DATATYPE,
      width: 120,
      render: (text, record) => (
        <DataType
          text = {text}
          record = {record}
          form = {form}
          dataTypeMenu = {columnsInfo?.dataTypeMenu}
        />
      )
    },
    {
      title: '长度',
      key: COLUMNS_KEY.FIELDSIZE,
      dataIndex: COLUMNS_KEY.FIELDSIZE,
      width: 120,
      render: (text, record) => (
        <FieldSize
          text = {text}
          record = {record}
          form = {form}
          maxReg={columnsInfo?.fieldSizeRegular?.MAXREG}
          max={columnsInfo?.fieldSizeRegular?.MAX}
        />
      )
    },
    {
      title: '小数点',
      key: COLUMNS_KEY.DECIMALSIZE,
      dataIndex: COLUMNS_KEY.DECIMALSIZE,
      width: 120,
      render: (text, record) => (
        <DecimalSize
          text = {text}
          record = {record}
          form = {form}
        />
      )
    },
    {
      title: '必填',
      key: COLUMNS_KEY.REQUIRED,
      dataIndex: COLUMNS_KEY.REQUIRED,
      width: 120,
      render: (text, record) => (
        <Required
          text = {text}
          record = {record}
          form = {form}
        />
      )
    },
    {
      title: '唯一',
      key: COLUMNS_KEY.UNIQUE,
      dataIndex: COLUMNS_KEY.UNIQUE,
      width: 120,
      render: (text, record) => (
        <Unique
          text = {text}
          record = {record}
          form = {form}
        />
      )
    },
    {
      title: '字典',
      key: COLUMNS_KEY.DICTIONARYFOREIGNCN,
      dataIndex: COLUMNS_KEY.DICTIONARYFOREIGNCN,
      width: 120,
      render: (text, record) => {
        return < Dict
          dispatchColumns = { dispatchColumns }
          text={text}
          form={form}
          record={record}
        />;
      }
    },
    {
      title: '转换成拼音',
      key: COLUMNS_KEY.PINYINCONVERT,
      dataIndex: COLUMNS_KEY.PINYINCONVERT,
      width: 120,
      render: (text, record) => (
        <PinyinConvert
          text = {text}
          record = {record}
          form = {form}
        />
      )
    },
    {
      title: '编码规则',
      key: COLUMNS_KEY.REGULAR,
      dataIndex: COLUMNS_KEY.REGULAR,
      width: 120,
      render: (text, record) => {
        return <RenderText text={text}/>;
      }
    },
    {
      title: '分类',
      key: COLUMNS_KEY.SPECIES,
      dataIndex: COLUMNS_KEY.SPECIES,
      width: 120,
      render: (text, record) => {
        return <RenderText text={SPECIESCN?.[text]}/>;
      }
    },
    {
      title: ' ',
      key: 'index',
      render: (text, record) => {
        let dataType = record?.[COLUMNS_KEY.DATATYPE];
        if (record.editable) {
          dataType = form.getFieldValue(COLUMNS_KEY.DATATYPE);
        }
        if (dataType === DATATYPE.QUOTE) {
          return <KeyOutlined />;
        }
        if (dataType === DATATYPE.FK) {
          return <span style={{ fontSize: '26px', fontWeight: 700 }}>”</span>;
        }
        return null;
      }
    },
  ];
  return (
    <>
      <Row className="margin-blr10 columns-manager">
        <Descriptions
          title="字段列表"
          extra={
            <>
              <Button
                type={BUTTON_TYPE.PRIMARY}
                size={BUTTON_SIZE.SMALL}
                disabled={columnsInfo?.editingKey !== ''}
                onClick={handleCreatRow}
              >+字段</Button>
              <Button
                type={BUTTON_TYPE.PRIMARY}
                size={BUTTON_SIZE.SMALL}
                disabled={columnsInfo?.editingKey !== ''}
                onClick={handleCreateDict}
              >+字典字段</Button>
              <Button
                type={BUTTON_TYPE.PRIMARY}
                size={BUTTON_SIZE.SMALL}
                disabled={columnsInfo?.editingKey !== ''}
              >+引用字段</Button>
              <Button
                type={BUTTON_TYPE.PRIMARY}
                size={BUTTON_SIZE.SMALL}
                disabled={columnsInfo?.editingKey !== ''}
              >+外键字段</Button>
              <Button
                type={BUTTON_TYPE.PRIMARY}
                size={BUTTON_SIZE.SMALL}
                disabled={columnsInfo?.editingKey !== ''}
                onClick={handleCopy}
              >复制</Button>
              <Button
                type={BUTTON_TYPE.PRIMARY}
                size={BUTTON_SIZE.SMALL}
                disabled={
                  cantColumnDelete(columns, columnsInfo?.selectedRowKeys)
                }
                onClick={handleDelete}
              >删除</Button>
              <Button
                type={BUTTON_TYPE.PRIMARY}
                size={BUTTON_SIZE.SMALL}
                disabled={columnsInfo?.editingKey !== ''}
                onClick={changeColumnsShowBySpecies}
              >{columnsInfo?.showSYSSpecies ? '隐藏' : '显示'}系统字段</Button></>
          }
        />
        <Form form={form}>
          <Table
            columns = {columnShowConfig}
            dataSource = { filterDataSource(columns, columnsInfo?.showSYSSpecies) }
            scroll={{ y: 359, x: '100vh' }}
            rowKey={(record) => record?.[COLUMNS_KEY.ID]}
            pagination = {false}
            rowSelection = {{
              type: 'radio',
              selectedRowKeys: columnsInfo?.selectedRowKeys || []
            }}
            onRow={(record: ITableColumn, index: number) => {
              return {
                onBlur: (event) => { handleBlur(record?.[COLUMNS_KEY?.ID]); },
                onDoubleClick: (event) => { handleRowDoubleClick(form, record); },
                onClick: (event) => { handleRowClick(form, record); }
              };
            }}
          />
        </Form>
      </Row>
      <CreateModal
        title="选择字典"
        modalVisible={columnsInfo?.visibleChooseDictModal}
        onCancel={() => dispatchColumns({ type: 'setVisibleChooseDictModal' })}
      >
        <ChooseDict
          dictId = {columnsInfo?.dictId}
          onOk={handleChooseDictOk}
          onCancel={() => dispatchColumns({ type: 'setVisibleChooseDictModal' })}
        />
      </CreateModal>
    </>
  );
});
