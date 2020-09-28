import React, { useReducer } from 'react';
import {
  Table, Descriptions, Button, Row, Form
} from 'antd';
import {
  BUTTON_TYPE, BUTTON_SIZE, FOREIGNKEYS_KEY, SPECIES
} from './constant';

import { IForeignKey, ITableColumn, FormInstance } from '../../interface';
import {
  foreignKeyReducer, translateColumnsToOptions, getRowKeysEditable, deleteConfirm
} from './service';
import { FieldName, RefTableCode, RefField } from './columns';
import RenderText from '../RenderText';

interface Item {
  name: string
  code: string
}
interface IProps {
  foreignKeys: IForeignKey[]
  columns: ITableColumn[]
  dispatchInfo: ({ type: string, name: any })=>void
}
export const ForeignKeysManager: React.FC<IProps> = React.memo((props: IProps) => {
  const { foreignKeys, columns, dispatchInfo } = props;
  const [foreignKeysInfo, dispatchForeignKeys] = useReducer(foreignKeyReducer, {
    /** 选中行列表 */
    selectedRowKeys: [],
    /** 编辑行的索引 */
    editingIndex: -1,
    refFieldOptions: []
  });
  const [form] = Form.useForm();

  /** 对form表单设值，当前时刻有且仅有一行数据可列入表单编辑 */
  const setRecordToForm = (formTmpl: FormInstance, record: IForeignKey) => {
    const {
      fieldCode, refTableCode, refFieldCode, refDisplayFieldCode, species
    } = record;
    formTmpl.setFieldsValue({
      fieldCode, refTableCode, refFieldCode, refDisplayFieldCode, species
    });
    return true;
  };
  /** 将表单数据提回记录，当前时刻有且仅有一行数据可从表单列入 */
  const getRecordFromForm = (formTmpl: FormInstance): IForeignKey => {
    const {
      FIELDNAME, FIELDCODE, REFTABLECODE, REFFIELDCODE, REFDISPLAYCODE
    } = FOREIGNKEYS_KEY;
    const recordNew = formTmpl.getFieldsValue([
      FIELDNAME, FIELDCODE, REFTABLECODE, REFFIELDCODE, REFDISPLAYCODE
    ]);
    return recordNew;
  };
  /** 更改数据 */
  const dispatchColumnsAndEditingIndex = (foreignKeysTmpl, editingIndex) => {
    dispatchInfo({
      type: 'editForeignKeys',
      name: foreignKeysTmpl
    });
    dispatchForeignKeys({
      type: 'changeEditingIndex',
      name: editingIndex
    });
  };
  /** 保存编辑行数据 */
  const saveRow = async (formTmpl: FormInstance) => {
    const { editingIndex } = foreignKeysInfo;
    if (editingIndex < 0) return true;
    try {
      await formTmpl.validateFields();
      const record = getRecordFromForm(formTmpl);
      dispatchColumnsAndEditingIndex({
        [editingIndex]: {
          ...foreignKeys?.[editingIndex], ...record, editable: false
        }
      }, -1);
      return true;
    } catch (e) {
      return false;
    }
  };
  /** 行的双击操作，转为可编辑状态 */
  const handleRowDoubleClick = (formTmpl: FormInstance, record: IForeignKey, index: number) => {
    const { editingIndex } = foreignKeysInfo;
    if (index === editingIndex) {
      // handleBlur(formTmpl, record);
      return;
    }
    saveRow(formTmpl).then((canIEdit) => {
      if (!canIEdit) return;
      setRecordToForm(formTmpl, record);
      const columnsTmpl = { [index]: { editable: true } };
      dispatchColumnsAndEditingIndex(columnsTmpl, index);
    });
  };
  /** 行点击操作 */
  const handleRowClick = (formTmpl: FormInstance, record: IForeignKey, index: number) => {
    const { editingIndex } = foreignKeysInfo;
    dispatchForeignKeys({ type: 'pushSelectedRowKey', name: record?.[FOREIGNKEYS_KEY?.ID] });
    if (index === editingIndex) return;
    saveRow(formTmpl);
  };
  /** 行失焦操作 */
  const handleBlur = (rowKey: string) => {
    const rowKeysEditable = getRowKeysEditable(foreignKeys);
    if (rowKeysEditable.includes(rowKey)) return;
    saveRow(form);
  };
  /** 创建记录 */
  const createRow = (obj) => {
    const id = `${new Date().valueOf()}`;
    const row: IForeignKey = {
      [FOREIGNKEYS_KEY?.ID]: id,
      [FOREIGNKEYS_KEY?.FIELDNAME]: '',
      [FOREIGNKEYS_KEY?.FIELDCODE]: '',
      [FOREIGNKEYS_KEY?.REFTABLECODE]: '',
      [FOREIGNKEYS_KEY?.REFFIELDCODE]: '',
      [FOREIGNKEYS_KEY?.REFDISPLAYCODE]: '',
      [FOREIGNKEYS_KEY?.SPECIES]: SPECIES?.BIS,
      [FOREIGNKEYS_KEY?.EDITABLE]: true,
      [FOREIGNKEYS_KEY?.CREATEDCUSTOMED]: true
    };
    dispatchInfo({
      type: 'unShiftForeignKey',
      name: row
    });
    dispatchForeignKeys({
      type: 'allIn',
      name: {
        editingIndex: 0,
        selectedRowKeys: [id]
      }
    });
    setRecordToForm(form, row);
  };
  /**
   * 点击新增按钮
   */
  const handleCreatRow = () => {
    saveRow(form).then((canICreate) => {
      if (!canICreate) return;
      createRow({});
    });
  };
  /** 删除记录 */
  const handleDelete = () => {
    const selectedKey = foreignKeysInfo?.selectedRowKeys?.[0];
    if (!selectedKey) return;
    const record = foreignKeys?.filter((item) => item?.[FOREIGNKEYS_KEY?.ID] === selectedKey)?.[0];
    if (record?.[FOREIGNKEYS_KEY?.CREATEDCUSTOMED]) {
      deleteConfirm({
        onOk: () => {
          dispatchInfo({
            type: 'deleteForeignKeysById',
            name: selectedKey
          });
          dispatchForeignKeys({ type: 'allIn', name: { selectedRowKeys: [], editingKey: '' } });
          dispatchInfo({ type: 'changeInfo', name: { foreignKeysValid: true } });
        }
      });
    }
  };
  /**
   * 判断记录是否能被删除
   * @param selectedKey
   */
  const cantForeignKeyDelete = (selectedKey) => {
    /** 没有选中记录则不允许删除 */
    if ((selectedKey?.length || 0) === 0) return true;
    return foreignKeys.some((item:IForeignKey) => {
      /** 跳过没有被选中的数据 */
      if (!selectedKey.includes(item?.[FOREIGNKEYS_KEY?.ID])) return false;
      /** 非系统自动生成的字段才允许删除 */
      return [SPECIES?.SYS, SPECIES?.SYS_TMPL, SPECIES?.BIS_TMPL].includes(
        item?.[FOREIGNKEYS_KEY?.SPECIES]
      );
    });
  };
  /**
   * 字段配置数据
  */
  const tableColumns = [
    {
      title: '序号', width: 120, key: FOREIGNKEYS_KEY?.INDEX, render: (text, record, index) => { return `${index + 1}`; }
    },
    {
      title: '字段名称',
      key: FOREIGNKEYS_KEY?.FIELDCODE,
      dataIndex: FOREIGNKEYS_KEY?.FIELDCODE,
      width: 120,
      render: (text, record, index) => (
        <FieldName
          options = {translateColumnsToOptions(columns)}
          text = {text}
          record = {record}
          form={form}
          index={index}
          dispatchInfo= {dispatchInfo}
          foreignKeys = {foreignKeys}
        />
      )
    },
    {
      title: '字段编码',
      key: FOREIGNKEYS_KEY?.FIELDCODE,
      dataIndex: FOREIGNKEYS_KEY?.FIELDCODE,
      width: 120,
      render: (text, record, index) => (
        <RenderText text={text}/>
      )
    },
    {
      title: '关联表',
      key: FOREIGNKEYS_KEY?.REFTABLECODE,
      dataIndex: FOREIGNKEYS_KEY?.REFTABLECODE,
      width: 120,
      render: (text, record) => (
        <RefTableCode
          text = {text}
          record = {record}
          form = {form}
        />
      )
    },
    {
      title: '关联字段',
      key: FOREIGNKEYS_KEY?.REFFIELDCODE,
      dataIndex: FOREIGNKEYS_KEY?.REFFIELDCODE,
      width: 120,
      render: (text, record) => (
        <RefField
          text = {text}
          record = {record}
          form = {form}
          name='关联字段'
          code = {FOREIGNKEYS_KEY?.REFFIELDCODE}
        />
      )
    },
    {
      title: '显示字段',
      key: FOREIGNKEYS_KEY?.REFDISPLAYCODE,
      dataIndex: FOREIGNKEYS_KEY?.REFDISPLAYCODE,
      width: 120,
      render: (text, record) => (
        <RefField
          text = {text}
          record = {record}
          form = {form}
          name='显示字段'
          code = {FOREIGNKEYS_KEY?.REFDISPLAYCODE}
        />
      )
    }
  ];
  return (
    <Row className="margin-blr10 columns-manager">
      <Descriptions
        title="外键列表"
        extra={
          <>
            <Button
              type={BUTTON_TYPE?.PRIMARY}
              size={BUTTON_SIZE?.SMALL}
              disabled={foreignKeysInfo?.editingIndex > -1}
              onClick={handleCreatRow}
            >新增</Button>
            <Button
              type={BUTTON_TYPE?.PRIMARY}
              size={BUTTON_SIZE?.SMALL}
              disabled={
                cantForeignKeyDelete(foreignKeysInfo?.selectedRowKeys)
              }
              onClick={handleDelete}
            >删除</Button>
          </>
        }
      />
      <Form form={form}>
        <Table
          columns = {tableColumns}
          dataSource = { foreignKeys }
          scroll={{ y: 359, x: '100vh' }}
          rowKey={(record) => record?.[FOREIGNKEYS_KEY?.ID]}
          pagination = {false}
          rowSelection = {{
            type: 'radio',
            hideSelectAll: true,
            selectedRowKeys: foreignKeysInfo?.selectedRowKeys || []
          }}
          onRow={(record: IForeignKey, index: number) => {
            return {
              onBlur: (event) => { handleBlur(record?.[FOREIGNKEYS_KEY?.ID]); },
              onDoubleClick: (event) => { handleRowDoubleClick(form, record, index); },
              onClick: (event) => { handleRowClick(form, record, index); }
            };
          }}
        />
      </Form>
    </Row>
  );
});
