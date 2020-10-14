import React from 'react';
import { Form, Select } from 'antd';
import { FormInstance } from 'antd/lib/form';
import { referenceEditableConfig } from './ColumnEditableConfigForExpandedInfo';
import { IForeignKeyFromApi, ISELECTSMENU } from '../interface';
import { RefTableCode as RefTableCodeTmpl, RefField as RefFieldTmpl, StrategyRenderer as StrategyRendererTmpl } from './CreateReference';
import { FOREIGNKEYS_KEY, STRATEGY_OPTIONS } from '../constants';
import { RenderText, getlabelByMenuList } from './FieldColumnsForExpandedInfo';
/** 判断控件是否可编辑 */
const isReferenceEditable = (
  record: IForeignKeyFromApi, formRef: {getFieldValue: (param:string)=>any}, dataIndex: string
): boolean => {
  const canRowEdit = record.editable;
  if (!canRowEdit) return false;
  /** 字段名称和字段编码恒可编辑 */
  return referenceEditableConfig[dataIndex]?.(formRef, record) || false;
};

interface IFieldName {
  text: string
  record: IForeignKeyFromApi
  formRef: React.RefObject<FormInstance<any>>
  options:ISELECTSMENU[]
  list: IForeignKeyFromApi[]
  index: number
}
const FieldName: React.FC<IFieldName> = (props: IFieldName) => {
  const {
    formRef, text, record, options, list, index
  } = props;
  const filterOptions = () => {
    const valueListUsed = list
      .filter((item, loopIndex) => loopIndex !== index)
      .map((item) => item[FOREIGNKEYS_KEY.FIELDCODE]);
    return options.filter((item) => !valueListUsed.includes(item.key));
  };
  const handleChange = (value, option) => {
    formRef.current?.setFieldsValue({ [FOREIGNKEYS_KEY.FIELDID]: option.key });
  };
  const value = formRef.current?.getFieldValue(FOREIGNKEYS_KEY.FIELDNAME);
  return React.useMemo(() => {
    return (<Form.Item
      shouldUpdate
      noStyle
    >
      {({ getFieldValue }) => {
        const editable = isReferenceEditable(record, { getFieldValue }, FOREIGNKEYS_KEY.FIELDNAME);
        return editable ? (
          <Form.Item
            name={FOREIGNKEYS_KEY.FIELDCODE}
            rules={[
              { required: true, message: '字段名称必填' },
            ]}
          >
            <Select
              onClick = {(e) => e.stopPropagation()}
              onBlur = {(e) => e.stopPropagation()}
              options = {filterOptions()}
              onChange = {handleChange}
            />
          </Form.Item>
        ) : (
          <RenderText text={getlabelByMenuList(options, text)}/>
        );
      }}
    </Form.Item>);
  }, [value, record.editable]);
};
interface IRefTableCode {
  text: string
  record: IForeignKeyFromApi
  formRef: React.RefObject<FormInstance<any>>
}
const RefTableCode: React.FC<IRefTableCode> = (props: IRefTableCode) => {
  const {
    formRef, text, record
  } = props;
  const value = formRef.current?.getFieldValue(FOREIGNKEYS_KEY.REFTABLECODE);

  return React.useMemo(() => {
    return (<Form.Item
      shouldUpdate
      noStyle
    >
      {({ getFieldValue }) => {
        const editable = isReferenceEditable(record, { getFieldValue }, FOREIGNKEYS_KEY.REFTABLECODE);
        return editable ? (
          <RefTableCodeTmpl
            form={formRef.current}
            label="关联表"
            showLabel={false}
          />
        ) : (
          <RenderText text={text}/>
        );
      }}
    </Form.Item>);
  }, [value, record.editable]);
};

interface IRefField {
  text: string
  record: IForeignKeyFromApi
  formRef: React.RefObject<FormInstance<any>>
  code: string
  label: string
}
const RefField: React.FC<IRefField> = (props: IRefField) => {
  const {
    formRef, text, record, code, label
  } = props;
  const value = formRef.current?.getFieldValue(code);

  return React.useMemo(() => {
    return (<Form.Item
      shouldUpdate
      noStyle
    >
      {({ getFieldValue }) => {
        const editable = isReferenceEditable(record, { getFieldValue }, code);
        return editable ? (
          <RefFieldTmpl
            form={formRef.current}
            label={label}
            showLabel={false}
            code = {code}
          />
        ) : (
          <RenderText text={text}/>
        );
      }}
    </Form.Item>);
  }, [value, record.editable]);
};

const StrategyRenderer: React.FC<IRefField> = (props: IRefField) => {
  const {
    formRef, text, record, code, label
  } = props;
  const value = formRef.current?.getFieldValue(code);

  return React.useMemo(() => {
    return (<Form.Item
      shouldUpdate
      noStyle
    >
      {({ getFieldValue }) => {
        const editable = isReferenceEditable(record, { getFieldValue }, code);
        return editable ? (
          <StrategyRendererTmpl
            form={formRef.current}
            label={label}
            showLabel={false}
            code = {code}
          />
        ) : (
          <RenderText text={getlabelByMenuList(STRATEGY_OPTIONS, text)}/>
        );
      }}
    </Form.Item>);
  }, [value, record.editable]);
};

const getReferenceColumns = ({
  formRef,
  fieldOptions,
  list
}) => {
  return [
    {
      title: '序号', width: 80, key: 'index', render: (text, record, index) => { return `${index + 1}`; }
    },
    {
      title: '字段名称',
      key: FOREIGNKEYS_KEY.FIELDCODE,
      dataIndex: FOREIGNKEYS_KEY.FIELDCODE,
      width: 120,
      render: (text, record, index) => (
        <FieldName
          options = {fieldOptions}
          text = {text}
          record = {record}
          formRef={formRef}
          index = {index}
          list={list}
        />
      )
    },
    {
      title: '字段编码',
      key: FOREIGNKEYS_KEY.FIELDCODE,
      dataIndex: FOREIGNKEYS_KEY.FIELDCODE,
      width: 120
    },
    {
      title: '关联表',
      key: FOREIGNKEYS_KEY.REFTABLECODE,
      dataIndex: FOREIGNKEYS_KEY.REFTABLECODE,
      width: 120,
      render: (text, record) => (
        <RefTableCode
          text = {text}
          record = {record}
          formRef = {formRef}
        />
      )
    },
    {
      title: '关联字段',
      key: FOREIGNKEYS_KEY.REFFIELDCODE,
      dataIndex: FOREIGNKEYS_KEY.REFFIELDCODE,
      width: 120,
      render: (text, record) => (
        <RefField
          text = {text}
          record = {record}
          formRef = {formRef}
          label='关联字段'
          code = {FOREIGNKEYS_KEY.REFFIELDCODE}
        />
      )
    },
    {
      title: '显示字段',
      key: FOREIGNKEYS_KEY.REFDISPLAYCODE,
      dataIndex: FOREIGNKEYS_KEY.REFDISPLAYCODE,
      width: 120,
      render: (text, record) => (
        <RefField
          text = {text}
          record = {record}
          formRef = {formRef}
          label='显示字段'
          code = {FOREIGNKEYS_KEY.REFDISPLAYCODE}
        />
      )
    },
  ];
};

const getForeignKeyColumns = ({
  formRef,
  fieldOptions,
  list
}) => {
  const columns = getReferenceColumns({
    formRef,
    fieldOptions,
    list
  });
  columns.push({
    title: '外键约束（删除时）',
    key: FOREIGNKEYS_KEY.DELETESTRATEGY,
    dataIndex: FOREIGNKEYS_KEY.DELETESTRATEGY,
    width: 200,
    render: (text, record, index) => (
      <StrategyRenderer
        label="外键约束（删除时）"
        code={FOREIGNKEYS_KEY.DELETESTRATEGY}
        text = {text}
        record = {record}
        formRef={formRef}
      />
    )
  }, {
    title: '外键约束（更新时）',
    key: FOREIGNKEYS_KEY.UPDATESTRATEGY,
    dataIndex: FOREIGNKEYS_KEY.UPDATESTRATEGY,
    width: 200,
    render: (text, record, index) => (
      <StrategyRenderer
        label="外键约束（更新时）"
        code={FOREIGNKEYS_KEY.UPDATESTRATEGY}
        text = {text}
        record = {record}
        formRef={formRef}
      />
    )
  });
  return columns;
};
export { getReferenceColumns, getForeignKeyColumns };
