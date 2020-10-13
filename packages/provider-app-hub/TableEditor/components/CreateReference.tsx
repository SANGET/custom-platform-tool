import React, { useState, useEffect } from 'react';
import { Form, Select } from 'antd';
import { FormInstance } from 'antd/lib/form';
import { ISELECTSMENU, ITableColumnFromApi } from '../interface';
import { getTableList, getTableInfo } from '../apis';
import { translateTableListToSelectMenus, translateFieldListToSelectMenus } from '../service';
import { REFERENCES_KEY, COLUMNS_KEY, FOREIGNKEYS_KEY } from '../constants';
import { ModalFooter } from './ChooseDict';

interface IRefTableCode {
  form: FormInstance
  label: string
}
const RefTableCode: React.FC<IRefTableCode> = (props: IRefTableCode) => {
  const {
    form, label
  } = props;
  const [options, setOptions] = useState<ISELECTSMENU[]>([]);
  useEffect(() => {
    getTableList().then((tableList) => {
      setOptions(translateTableListToSelectMenus(tableList));
    });
  }, []);
  const getTableIdByTableCode = (code) => {
    if (!code && !Array.isArray(options)) return '';
    return options.filter((item) => item.value === code)?.[0]?.key || '';
  };
  /**
   * 更改表时，需要同步更新下拉框数据
   * @param value
   */
  const handleChange = (value) => {
    form.setFieldsValue({
      [REFERENCES_KEY?.REFFIELDCODE]: '',
      [REFERENCES_KEY?.REFDISPLAYCODE]: '',
      [REFERENCES_KEY?.REFTABLEID]: getTableIdByTableCode(value)
    });
  };
  return (
    <Form.Item
      name={REFERENCES_KEY?.REFTABLECODE}
      label = {label}
      rules={[
        { required: true, message: '必填' },
      ]}
    >
      <Select
        showSearch
        onClick = {(e) => e.stopPropagation()}
        onBlur = {(e) => e.stopPropagation()}
        options = {options}
        onChange = {handleChange}
      />
    </Form.Item>
  );
};
interface IRefField extends IRefTableCode{
  code: string
}
const RefField: React.FC<IRefField> = (props: IRefField) => {
  const {
    label, form, code
  } = props;
  const [options, setOptions] = useState<ISELECTSMENU[]>([]);
  const [fieldOptions, setFieldOptions] = useState<ITableColumnFromApi[]>([]);
  const getMenusData = () => {
    const id = form.getFieldValue(REFERENCES_KEY.REFTABLEID);
    if (!id) {
      setOptions([]);
      setFieldOptions([]);
      return;
    }
    getTableInfo(id).then((res) => {
      setFieldOptions(res?.columns);
      const fieldSelectOptions = translateFieldListToSelectMenus(res?.columns);
      setOptions(fieldSelectOptions);
    });
  };
  useEffect(() => {
    getMenusData();
  }, [form.getFieldValue('refTableCode')]);
  const handleValueChange = (value) => {
    const {
      [COLUMNS_KEY.FIELDSIZE]: fieldSize,
      [COLUMNS_KEY.FIELDTYPE]: fieldType,
      [COLUMNS_KEY.NAME]: fieldName
    } = fieldOptions.filter((item) => item.code === value)?.[0];
    form.setFieldsValue({
      [`${code}_fieldSize`]: fieldSize,
      [`${code}_fieldType`]: fieldType,
      [`${code}_fieldName`]: fieldName
    });
  };
  const handleDropdown = (oepn:boolean) => {
    oepn && getMenusData();
  };
  // return React.useMemo(() => {
  return <Form.Item
    name={code}
    label = {label}
    rules={[
      { required: true, message: `${label}必填` },
    ]}
  >
    <Select
      onChange={(value) => { handleValueChange(value); }}
      onClick = {(e) => e.stopPropagation()}
      onBlur = {(e) => e.stopPropagation()}
      onDropdownVisibleChange={handleDropdown}
      options = {options}
    />
  </Form.Item>;
  // }, [value, record.editable]);
};
const StrategyRenderer: React.FC<IRefField> = (props: IRefField) => {
  const {
    label, code, form
  } = props;

  const options = [
    { label: '存在关联不允许操作', key: 'RESTRICT', value: 'RESTRICT' },
    { label: '级联', key: 'CASCADE', value: 'CASCADE' },
    { label: '置空', key: 'SET_NULL', value: 'SET_NULL' },
    { label: '不处理', key: 'NO_ACTION', value: 'NO_ACTION' },
  ];
  return (
    <Form.Item
      label={label} name={code}
      rules={[
        { required: true, message: `${label}必填` },
      ]}
    >
      <Select
        onClick = {(e) => e.stopPropagation()}
        onBlur = {(e) => e.stopPropagation()}
        options={options}
      />
    </Form.Item>
  );
};
interface ICreateReference {
  onOk: (param: any) => void
  type: string
  onCancel: () => void
}
const CreateReference: React.FC<ICreateReference> = (props: ICreateReference) => {
  const { onOk, onCancel, type } = props;
  const [form] = Form.useForm();

  const getLayout = () => {
    if (type === 'reference') {
      return {
        labelCol: { span: 4 },
        wrapperCol: { span: 20 },
      };
    }
    if (type === 'foreignKey') {
      return {
        labelCol: { span: 6 },
        wrapperCol: { span: 18 },
      };
    }
  };
  const getFieldList = () => {
    const fieldList = [
      FOREIGNKEYS_KEY.REFTABLECODE, FOREIGNKEYS_KEY.REFTABLEID,
      FOREIGNKEYS_KEY.REFFIELDCODE, FOREIGNKEYS_KEY.REFDISPLAYCODE,
      FOREIGNKEYS_KEY.REFFIELDSIZE, FOREIGNKEYS_KEY.REFFIELDTYPE, FOREIGNKEYS_KEY.REFFIELDNAME
    ];
    if (type === 'foreignKey') {
      fieldList.push(FOREIGNKEYS_KEY.DELETESTRATEGY, FOREIGNKEYS_KEY.UPDATESTRATEGY);
    }
    return fieldList;
  };

  const handleOk = async (formTmpl: FormInstance) => {
    const fieldList = getFieldList();
    try {
      await formTmpl.validateFields();
      const data = formTmpl.getFieldsValue(fieldList);
      onOk && onOk(data);
    } catch (e) {
      console.log(e);
    }
  };
  const handleCancel = () => {
    onCancel && onCancel();
  };
  return (
    <Form form={form} {...getLayout()}>
      <RefTableCode form={form} label="关联表"/>
      <RefField
        form={form}
        label = "关联字段"
        code={REFERENCES_KEY.REFFIELDCODE}
      />
      <RefField
        form={form}
        label="显示字段"
        code={REFERENCES_KEY.REFDISPLAYCODE}
      />
      {type === 'foreignKey' ? (<>
        <StrategyRenderer form = {form} label="外键约束（删除时）" code={FOREIGNKEYS_KEY.DELETESTRATEGY}/>
        <StrategyRenderer form = {form} label="外键约束（更新时）" code={FOREIGNKEYS_KEY.UPDATESTRATEGY}/>
      </>) : null}
      <ModalFooter
        onOk={() => { handleOk(form); }}
        onCancel={() => { handleCancel(); }}
      />
    </Form>
  );
};
export default React.memo(CreateReference);
