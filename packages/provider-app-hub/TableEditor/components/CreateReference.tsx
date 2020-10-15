import React, { useState, useEffect } from 'react';
import { Form, Select } from 'antd';
import { FormInstance } from 'antd/lib/form';
import { DATATYPE, FIELDTYPE } from '@provider-app/table-info/components/columnsManager/constant';
import { ISELECTSMENU, ITableColumnFromApi } from '../interface';
import { getTableList, getTableInfo } from '../apiAgents';
import { translateTableListToSelectMenus, translateFieldListToSelectMenus } from '../service';
import {
  REFERENCES_KEY, COLUMNS_KEY, FOREIGNKEYS_KEY, STRATEGY_OPTIONS
} from '../constants';
import { ModalFooter } from './ChooseDict';

interface IRefTableCode {
  form: FormInstance|null
  label: string
  showLabel?: boolean
}
export const RefTableCode: React.FC<IRefTableCode> = (props: IRefTableCode) => {
  const {
    form, label, showLabel = false
  } = props;
  const [options, setOptions] = useState<ISELECTSMENU[]>([]);
  useEffect(() => {
    getTableList().then((tableList) => {
      setOptions(translateTableListToSelectMenus(tableList));
    });
  }, []);
  /**
   * 更改表时，需要同步更新下拉框数据
   * @param value
   */
  const handleChange = (value, option) => {
    form?.setFieldsValue({
      [REFERENCES_KEY.REFFIELDCODE]: '',
      [REFERENCES_KEY.REFDISPLAYCODE]: '',
      [REFERENCES_KEY.REFTABLEID]: option.key
    });
  };
  const labelProps = showLabel ? { label } : {};
  return (
    <Form.Item
      name={REFERENCES_KEY?.REFTABLECODE}
      {...labelProps}
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
export const RefField: React.FC<IRefField> = (props: IRefField) => {
  const {
    label, form, code, showLabel
  } = props;
  const [options, setOptions] = useState<ISELECTSMENU[]>([]);
  const [fieldOptions, setFieldOptions] = useState<ITableColumnFromApi[]>([]);
  const getMenusData = async () => {
    const code = form.getFieldValue(REFERENCES_KEY.REFTABLECODE);

    if (!code) {
      setOptions([]);
      setFieldOptions([]);
      return;
    }
    const tableList = await getTableList();
    const id = tableList.filter((item) => item.code === code)[0]?.id;
    // const id = form.getFieldValue(REFERENCES_KEY.REFTABLEID);
    if (!id) {
      setOptions([]);
      setFieldOptions([]);
      return;
    }
    getTableInfo(id).then((res) => {
      /** 不能让用户选择到超文本的字段，后期由接口处理 */
      const columns = (res?.columns).filter((item) => item.dataType !== FIELDTYPE.LONG);
      const fieldSelectOptions = translateFieldListToSelectMenus(columns);
      setFieldOptions(columns);
      setOptions(fieldSelectOptions);
    });
  };
  useEffect(() => {
    getMenusData();
  }, [form?.getFieldValue('refTableCode')]);
  const handleValueChange = (value) => {
    const {
      [COLUMNS_KEY.FIELDSIZE]: fieldSize,
      [COLUMNS_KEY.FIELDTYPE]: fieldType,
      [COLUMNS_KEY.NAME]: fieldName
    } = fieldOptions.filter((item) => item.code === value)?.[0];
    form?.setFieldsValue({
      [`${code}_fieldSize`]: fieldSize,
      [`${code}_fieldType`]: fieldType,
      [`${code}_fieldName`]: fieldName
    });
  };
  const handleDropdown = (oepn:boolean) => {
    oepn && getMenusData();
  };
  const labelProps = showLabel ? { label } : {};
  return <Form.Item
    name={code}
    {...labelProps}
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
export const StrategyRenderer: React.FC<IRefField> = (props: IRefField) => {
  const {
    label, code, showLabel
  } = props;
  const labelProps = showLabel ? { label } : {};
  return (
    <Form.Item
      {...labelProps}
      name={code}
      rules={[
        { required: true, message: `${label}必填` },
      ]}
    >
      <Select
        onClick = {(e) => e.stopPropagation()}
        onBlur = {(e) => e.stopPropagation()}
        options={STRATEGY_OPTIONS}
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
    if (type === 'foreignKey') {
      return {
        labelCol: { span: 6 },
        wrapperCol: { span: 18 },
      };
    }
    return {
      labelCol: { span: 4 },
      wrapperCol: { span: 20 },
    };
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
      <RefTableCode
        showLabel={true}
        form={form}
        label="关联表"
      />
      <RefField
        showLabel={true}
        form={form}
        label = "关联字段"
        code={REFERENCES_KEY.REFFIELDCODE}
      />
      <RefField
        showLabel={true}
        form={form}
        label="显示字段"
        code={REFERENCES_KEY.REFDISPLAYCODE}
      />
      {type === 'foreignKey' ? (<>
        <StrategyRenderer
          showLabel={true}
          form = {form}
          label="外键约束（删除时）"
          code={FOREIGNKEYS_KEY.DELETESTRATEGY}
        />
        <StrategyRenderer
          showLabel={true}
          form = {form}
          label="外键约束（更新时）"
          code={FOREIGNKEYS_KEY.UPDATESTRATEGY}
        />
      </>) : null}
      <ModalFooter
        onOk={() => { handleOk(form); }}
        onCancel={() => { handleCancel(); }}
      />
    </Form>
  );
};
export default React.memo(CreateReference);
