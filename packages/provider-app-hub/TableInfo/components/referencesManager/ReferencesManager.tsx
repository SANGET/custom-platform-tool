import React, { useReducer } from 'react';
import {
  Table, Descriptions, Button, Row, Form
} from 'antd';
import {
  BUTTON_TYPE, BUTTON_SIZE, REFERENCES_KEY, SPECIES
} from './constant';

import { IReference, ITableColumn, FormInstance } from '../../interface';
import {
  referenceReducer, translateColumnsToOptions, getRowKeysEditable, deleteConfirm
} from './service';
import { FieldName, RefTableCode, RefField } from './columns';
import RenderText from '../RenderText';

interface Item {
  name: string
  code: string
}
interface IProps {
  references: IReference[]
  columns: ITableColumn[]
  dispatchInfo: ({ type: string, name: any })=>void
}
export const ReferencesManager: React.FC<IProps> = React.memo((props: IProps) => {
  const { references, columns, dispatchInfo } = props;
  const [referencesInfo, dispatchReferences] = useReducer(referenceReducer, {
    /** 选中行列表 */
    selectedRowKeys: [],
    /** 编辑行的索引 */
    editingIndex: -1,
    refFieldOptions: []
  });
  const [form] = Form.useForm();

  /** 对form表单设值，当前时刻有且仅有一行数据可列入表单编辑 */
  const setRecordToForm = (formTmpl: FormInstance, record: IReference) => {
    const {
      fieldCode, refTableCode, refFieldCode, refDisplayFieldCode, species
    } = record;
    formTmpl.setFieldsValue({
      fieldCode, refTableCode, refFieldCode, refDisplayFieldCode, species
    });
    return true;
  };
  /** 将表单数据提回记录，当前时刻有且仅有一行数据可从表单列入 */
  const getRecordFromForm = (formTmpl: FormInstance): IReference => {
    const {
      FIELDNAME, FIELDCODE, REFTABLECODE, REFFIELDCODE, REFDISPLAYCODE
    } = REFERENCES_KEY;
    const recordNew = formTmpl.getFieldsValue([
      FIELDNAME, FIELDCODE, REFTABLECODE, REFFIELDCODE, REFDISPLAYCODE
    ]);
    return recordNew;
  };
  /** 更改数据 */
  const dispatchColumnsAndEditingIndex = (referencesTmpl, editingIndex) => {
    dispatchInfo({
      type: 'editReferences',
      name: referencesTmpl
    });
    dispatchReferences({
      type: 'changeEditingIndex',
      name: editingIndex
    });
  };
  /** 保存编辑行数据 */
  const saveRow = async (formTmpl: FormInstance) => {
    const { editingIndex } = referencesInfo;
    if (editingIndex < 0) return true;
    try {
      await formTmpl.validateFields();
      const record = getRecordFromForm(formTmpl);
      dispatchColumnsAndEditingIndex({
        [editingIndex]: {
          ...references[editingIndex], ...record, editable: false
        }
      }, -1);
      return true;
    } catch (e) {
      return false;
    }
  };
  /** 行的双击操作，转为可编辑状态 */
  const handleRowDoubleClick = (formTmpl: FormInstance, record: IReference, index: number) => {
    const { editingIndex } = referencesInfo;
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
  const handleRowClick = (formTmpl: FormInstance, record: IReference, index: number) => {
    const editingIndex = referencesInfo?.editingIndex;
    saveRow(formTmpl).then((canIClick) => {
      (canIClick || editingIndex === index) && dispatchReferences({ type: 'pushSelectedRowKey', name: record?.[REFERENCES_KEY?.ID] });
    });
  };
  /** 行失焦操作 */
  const handleBlur = (rowKey: string) => {
    const rowKeysEditable = getRowKeysEditable(references);
    if (rowKeysEditable.includes(rowKey)) return;
    saveRow(form);
  };
  /** 创建记录 */
  const createRow = (obj) => {
    const id = `${new Date().valueOf()}`;
    const row: IReference = {
      [REFERENCES_KEY?.ID]: id,
      [REFERENCES_KEY?.FIELDNAME]: '',
      [REFERENCES_KEY?.FIELDCODE]: '',
      [REFERENCES_KEY?.REFTABLECODE]: '',
      [REFERENCES_KEY?.REFFIELDCODE]: '',
      [REFERENCES_KEY?.REFDISPLAYCODE]: '',
      [REFERENCES_KEY?.SPECIES]: SPECIES.BIS,
      [REFERENCES_KEY?.EDITABLE]: true,
      [REFERENCES_KEY?.CREATEDCUSTOMED]: true
    };
    dispatchInfo({
      type: 'unShiftReference',
      name: row
    });
    dispatchReferences({
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
    const selectedKey = referencesInfo?.selectedRowKeys?.[0];
    if (!selectedKey) return;
    const record = references?.filter((item) => item?.[REFERENCES_KEY?.ID] === selectedKey)?.[0];
    if (record?.[REFERENCES_KEY?.CREATEDCUSTOMED]) {
      deleteConfirm({
        onOk: () => {
          dispatchInfo({
            type: 'deleteReferencesById',
            name: selectedKey
          });
          dispatchReferences({ type: 'allIn', name: { selectedRowKeys: [], editingKey: '' } });
          dispatchInfo({ type: 'changeInfo', name: { referencesValid: true } });
        }
      });
    }
  };
  /**
   * 判断记录是否能被删除
   * @param selectedKey
   */
  const cantReferenceDelete = (selectedKey) => {
    /** 没有选中记录则不允许删除 */
    if ((selectedKey?.length || 0) === 0) return true;
    return references.some((item:IReference) => {
      /** 跳过没有被选中的数据 */
      if (!selectedKey.includes(item?.[REFERENCES_KEY?.ID])) return false;
      /** 非系统自动生成的字段才允许删除 */
      return [SPECIES?.SYS, SPECIES?.SYS_TMPL, SPECIES?.BIS_TMPL].includes(
        item?.[REFERENCES_KEY?.SPECIES]
      );
    });
  };

  /**
   * 关联字段变更时，存储字段类型，字段长度，字段名称
   * @param refField
   */
  const handleRefFieldChange = (refField) => {
    const { fieldType, fieldSize, fieldName } = refField || {};
    form.setFieldsValue({
      [REFERENCES_KEY?.REFFIELDTYPE]: fieldType,
      [REFERENCES_KEY?.REFFIELDSIZE]: fieldSize,
      [REFERENCES_KEY?.REFFIELDNAME]: fieldName
    });
  };
  /**
   * 字段配置数据
  */
  const tableColumns = [
    {
      title: '序号', width: 120, key: REFERENCES_KEY?.INDEX, render: (text, record, index) => { return `${index + 1}`; }
    },
    {
      title: '字段名称',
      key: REFERENCES_KEY?.FIELDCODE,
      dataIndex: REFERENCES_KEY?.FIELDCODE,
      width: 120,
      render: (text, record, index) => (
        <FieldName
          options = {translateColumnsToOptions(columns)}
          text = {text}
          record = {record}
          form={form}
          index={index}
          dispatchInfo= {dispatchInfo}
          references = {references}
        />
      )
    },
    {
      title: '字段编码',
      key: REFERENCES_KEY?.FIELDCODE,
      dataIndex: REFERENCES_KEY?.FIELDCODE,
      width: 120,
      render: (text, record, index) => (
        <RenderText text={text}/>
      )
    },
    {
      title: '关联表',
      key: REFERENCES_KEY?.REFTABLECODE,
      dataIndex: REFERENCES_KEY?.REFTABLECODE,
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
      key: REFERENCES_KEY?.REFFIELDCODE,
      dataIndex: REFERENCES_KEY?.REFFIELDCODE,
      width: 120,
      render: (text, record) => (
        <RefField
          text = {text}
          record = {record}
          form = {form}
          name='关联字段'
          code = {REFERENCES_KEY?.REFFIELDCODE}
          handleChange = {handleRefFieldChange}
        />
      )
    },
    {
      title: '显示字段',
      key: REFERENCES_KEY?.REFDISPLAYCODE,
      dataIndex: REFERENCES_KEY?.REFDISPLAYCODE,
      width: 120,
      render: (text, record) => (
        <RefField
          text = {text}
          record = {record}
          form = {form}
          name='显示字段'
          code = {REFERENCES_KEY?.REFDISPLAYCODE}
        />
      )
    }
  ];
  return (
    <Row className="margin-blr10 columns-manager">
      <Descriptions
        title="引用字段列表"
        extra={
          <>
            <Button
              type={BUTTON_TYPE?.PRIMARY}
              size={BUTTON_SIZE?.SMALL}
              disabled={referencesInfo?.editingIndex > -1}
              onClick={handleCreatRow}
            >新增</Button>
            <Button
              type={BUTTON_TYPE?.PRIMARY}
              size={BUTTON_SIZE?.SMALL}
              disabled={
                cantReferenceDelete(referencesInfo?.selectedRowKeys)
              }
              onClick={handleDelete}
            >删除</Button>
          </>
        }
      />
      <Form form={form}>
        <Table
          columns = {tableColumns}
          dataSource = { references }
          scroll={{ y: 359, x: '100vh' }}
          rowKey={(record) => record?.[REFERENCES_KEY?.ID]}
          pagination = {false}
          rowSelection = {{
            type: 'radio',
            hideSelectAll: true,
            selectedRowKeys: referencesInfo?.selectedRowKeys || []
          }}
          onRow={(record: IReference, index: number) => {
            return {
              onBlur: (event) => { handleBlur(record?.[REFERENCES_KEY?.ID]); },
              onDoubleClick: (event) => { handleRowDoubleClick(form, record, index); },
              onClick: (event) => { handleRowClick(form, record, index); }
            };
          }}
        />
      </Form>
    </Row>
  );
});
