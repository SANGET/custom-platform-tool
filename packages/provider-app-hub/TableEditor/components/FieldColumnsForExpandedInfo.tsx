import React from 'react';
import pinyin4js from 'pinyin4js';
import { FormInstance } from 'antd/lib/form';
import {
  Form, Input, Select, InputNumber
} from 'antd';
import { KeyOutlined } from '@ant-design/icons';
import { ITableColumnInState, ITableColumnShowKey, ISELECTSMENU } from '../interface';
import { fieldEditableConfig } from './ColumnEditableConfigForExpandedInfo';
import {
  SPECIESCN, DATATYPE, COLUMNS_KEY, FIELDTYPE, FIELDTYPEMENU, FIELDSIZEREGULAR, DATATYPEMENU, DATATYPEMENUFORTEXT, VALUEBOOLEANMENU
} from '../constants';
import { getlabelByMenuList } from '../service';
/** 判断控件是否可编辑 */
const isFieldEditable = (
  record: ITableColumnInState, formRef: {getFieldValue: (param:string)=>any}, dataIndex: ITableColumnShowKey
): boolean => {
  const canRowEdit = record?.editable;
  if (!canRowEdit) return false;
  /** 字段名称和字段编码恒可编辑 */
  return fieldEditableConfig[dataIndex]?.(formRef, record) || false;
};
interface IRenderTextProps {
  text: string
}
/** 通用文本渲染 */
export const RenderText: React.FC<IRenderTextProps> = (props: IRenderTextProps) => {
  const { text } = props;
  return (<span title = {text ? text.toString() : undefined}>{text}</span>);
};

/** 字段名称 */
interface ICommonFieldProps {
  formRef: React.RefObject<FormInstance<any>>
  record: ITableColumnInState
  text: string
}
class Name extends React.Component<ICommonFieldProps> {
  shouldComponentUpdate(nextProps) {
    return nextProps.record.editable !== this.props.record.editable;
  }

  formatNameToCode = (name): string => {
    const pinyin = pinyin4js.convertToPinyinString(name, "", pinyin4js.WITHOUT_TONE);
    const substr = pinyin.replace(/[(|)]|[（|）]/g, "").substring(0, 64);
    return substr.toLowerCase();
  }

  handleChange = (e) => {
    const value = e?.target?.value;
    if (!this.props.record.createdCustomed || !value) return;
    const pinyin = this.formatNameToCode(value);
    this.props.formRef.current?.setFieldsValue({
      code: pinyin
    });
    this.props.formRef.current?.validateFields(["code"]);
  }

  render() {
    const { record, text } = this.props;
    return <Form.Item
      shouldUpdate
      noStyle
    >
      {({ getFieldValue }) => {
        const editable = isFieldEditable(record, { getFieldValue }, 'name');
        return editable ? (
          <Form.Item
            name={COLUMNS_KEY.NAME}
            rules={[
              { required: true, message: '字段名称必填' },
              { pattern: /^[\u4e00-\u9fa5a-zA-Z()][\u4e00-\u9fa5_a-zA-Z0-9()]{0,31}$/, message: '限制32位字符，输入字段包括中文、英文大小写、数字、下划线、英文小括号(_)，不能以数字或下划线_开头' },
            ]}
          >
            <Input
              onClick = {(e) => e.stopPropagation()}
              onBlur = {(e) => e.stopPropagation()}
              onChange={(e) => { this.handleChange(e); }}
            />
          </Form.Item>
        ) : (
          <RenderText text={text}/>
        );
      }}
    </Form.Item>;
  }
}

const Code: React.FC<ICommonFieldProps> = (props: ICommonFieldProps) => {
  const {
    text, record, formRef
  } = props;
  const value = formRef.current?.getFieldValue(COLUMNS_KEY.CODE);
  return React.useMemo(() => {
    return (<Form.Item
      shouldUpdate
      noStyle
    >
      {({ getFieldValue }) => {
        const editable = isFieldEditable(record, { getFieldValue }, COLUMNS_KEY.CODE);
        return editable ? (
          <Form.Item
            name={COLUMNS_KEY.CODE}
            rules={[
              { required: true, message: '字段编码必填' },
              { pattern: /^[\u4e00-\u9fa5a-zA-Z()][\u4e00-\u9fa5_a-zA-Z0-9()]{0,63}$/, message: '限制64位字符，输入字段包括中文、英文大小写、数字、下划线、英文小括号(_)，不能以数字或下划线_开头' },
            ]}
          >
            <Input
              onClick = {(e) => e.stopPropagation()}
              onBlur = {(e) => e.stopPropagation()}
            />
          </Form.Item>
        ) : (
          <RenderText text={text}/>
        );
      }}
    </Form.Item>);
  }, [value, record.editable]);
};
const FieldType: React.FC<ICommonFieldProps> = React.memo((props: ICommonFieldProps) => {
  const {
    formRef, text, record
  } = props;
  const handleChange = (value) => {
    /** 设置小数点默认值 */
    const decimalSizeDefault = value === FIELDTYPE.INT ? 0 : '';
    formRef.current?.setFieldsValue({
      [COLUMNS_KEY.DECIMALSIZE]: decimalSizeDefault,
      [COLUMNS_KEY.FIELDSIZE]: FIELDSIZEREGULAR[value]?.DEFAULT
    });
  };
  return React.useMemo(() => (<Form.Item
    shouldUpdate
    noStyle
  >
    {({ getFieldValue }) => {
      const editable = isFieldEditable(record, { getFieldValue }, COLUMNS_KEY.FIELDTYPE);
      return editable ? (
        <Form.Item
          name={COLUMNS_KEY.FIELDTYPE}
          rules={[
            { required: true, message: '字段类型必填' },
          ]}
        >
          <Select
            onClick = {(e) => e.stopPropagation()}
            onBlur = {(e) => e.stopPropagation()}
            options = {FIELDTYPEMENU}
            onChange = {handleChange}
          />
        </Form.Item>
      ) : (
        <RenderText text={getlabelByMenuList(FIELDTYPEMENU, text)}/>
      );
    }}
  </Form.Item>),
  [record.editable, formRef.current?.getFieldValue(COLUMNS_KEY.FIELDTYPE)]);
});
const DataType: React.FC<ICommonFieldProps> = React.memo((props: ICommonFieldProps) => {
  const {
    record, text, formRef
  } = props;
  return React.useMemo(() => (<Form.Item
    noStyle
    shouldUpdate
  >
    {({ getFieldValue }) => {
      const editable = isFieldEditable(record, { getFieldValue }, COLUMNS_KEY.DATATYPE);
      const fieldType = getFieldValue('fieldType');
      const dataTypeMenu = DATATYPEMENU[fieldType];
      return editable ? (
        <Form.Item
          name={COLUMNS_KEY.DATATYPE}
          rules={[
            { required: true, message: '数据类型必填' },
          ]}
        >
          <Select
            onClick = {(e) => e.stopPropagation()}
            onBlur = {(e) => e.stopPropagation()}
            options = {dataTypeMenu}
          />
        </Form.Item>
      ) : (
        <RenderText text={getlabelByMenuList(DATATYPEMENUFORTEXT, text)}/>
      );
    }}
  </Form.Item>),
  [record.editable, formRef.current?.getFieldValue(COLUMNS_KEY.DATATYPE)]);
});
const FieldSize: React.FC<ICommonFieldProps> = (props: ICommonFieldProps) => {
  const {
    text, record, formRef
  } = props;
  return React.useMemo(() => {
    return (<Form.Item
      noStyle
      shouldUpdate
    >
      {({ getFieldValue }) => {
        const editable = isFieldEditable(record, { getFieldValue }, COLUMNS_KEY.FIELDSIZE);
        const fieldType = getFieldValue('fieldType');
        const fieldSizeRegular = FIELDSIZEREGULAR[fieldType];
        return editable ? (
          <Form.Item
            dependencies={['fieldType']}
            name={COLUMNS_KEY.FIELDSIZE}
            rules={[
              { required: true, message: '长度必填' },
              { pattern: fieldSizeRegular?.MAXREG, message: `请输入正整数，最大可输入${fieldSizeRegular?.MAX}` },
            ]}
          >
            <InputNumber
              onClick = {(e) => e.stopPropagation()}
              onBlur = {(e) => e.stopPropagation()}
            />
          </Form.Item>
        ) : (
          <RenderText text={text}/>
        );
      }}
    </Form.Item>);
  }, [record.editable, formRef.current?.getFieldValue(COLUMNS_KEY.FIELDTYPE)]);
};
const DecimalSize: React.FC<ICommonFieldProps> = (props: ICommonFieldProps) => {
  const {
    text, record, formRef
  } = props;
  return React.useMemo(() => {
    return (<Form.Item
      noStyle
      shouldUpdate
    >
      {({ getFieldValue }) => {
        const editable = isFieldEditable(record, { getFieldValue }, COLUMNS_KEY.DECIMALSIZE);
        return editable ? (
          <Form.Item
            name={COLUMNS_KEY.DECIMALSIZE}
            rules={[
              { pattern: /^[0-8]$/, message: '小数位数最多只能输入8位' },
            ]}
          >
            <InputNumber
              onClick = {(e) => e.stopPropagation()}
              onBlur = {(e) => e.stopPropagation()}
            />
          </Form.Item>
        ) : (
          <RenderText text={text}/>
        );
      }}
    </Form.Item>);
  }, [record.editable, formRef.current?.getFieldsValue([COLUMNS_KEY.FIELDTYPE, COLUMNS_KEY.DECIMALSIZE])]);
};
interface IBooleanSelect extends ICommonFieldProps {
  code: ITableColumnShowKey
}
const BooleanSelect: React.FC<IBooleanSelect> = (props: IBooleanSelect) => {
  const {
    text, record, formRef, code
  } = props;
  return React.useMemo(() => {
    return (<Form.Item
      noStyle
      shouldUpdate
    >
      {({ getFieldValue }) => {
        const editable = isFieldEditable(record, { getFieldValue }, code);
        return editable ? (
          <Form.Item
            name={code}
          >
            <Select
              onClick = {(e) => e.stopPropagation()}
              options={VALUEBOOLEANMENU}
              onBlur = {(e) => e.stopPropagation()}
            />
          </Form.Item>
        ) : (
          <RenderText text={getlabelByMenuList(VALUEBOOLEANMENU, text)}/>
        );
      }}
    </Form.Item>);
  }, [record.editable, formRef.current?.getFieldValue(code)]);
};
interface IDict extends ICommonFieldProps {
  editDictioary: (dictIds: string[], visibleChooseDictModal: boolean) => void
}
const Dict: React.FC<IDict> = (props: IDict) => {
  const {
    text, record, formRef, editDictioary
  } = props;
  const handleClick = (e) => {
    const {
      [COLUMNS_KEY.DICTIONARYFOREIGN]: code
    } = formRef.current?.getFieldsValue([COLUMNS_KEY.DICTIONARYFOREIGNCN, COLUMNS_KEY.DICTIONARYFOREIGN]);
    editDictioary(code.split(','), true);
    e?.stopPropagation();
  };
  return React.useMemo(() => {
    return (<Form.Item
      noStyle
      shouldUpdate
    >
      {({ getFieldValue }) => {
        const editable = isFieldEditable(record, { getFieldValue }, COLUMNS_KEY.DICTIONARYFOREIGN);
        return editable ? (
          <Form.Item name={COLUMNS_KEY.DICTIONARYFOREIGNCN}>
            <Input
              className="pointer"
              onClick={handleClick} readOnly
              title={formRef.current?.getFieldValue(COLUMNS_KEY.DICTIONARYFOREIGNCN)}
            />
          </Form.Item>
        ) : (
          <RenderText text={record.editable ? formRef.current?.getFieldValue(COLUMNS_KEY.DICTIONARYFOREIGNCN) : text}/>
        );
      }}
    </Form.Item>);
  }, [record.editable, formRef.current?.getFieldValue(COLUMNS_KEY.DICTIONARYFOREIGN)]);
};
const IconRenderer: React.FC<ICommonFieldProps> = (props: ICommonFieldProps) => {
  const { formRef, record } = props;
  return React.useMemo(() => {
    return (<Form.Item
      noStyle
      shouldUpdate
    >
      {({ getFieldValue }) => {
        const dataType = record.editable ? getFieldValue(COLUMNS_KEY.DATATYPE) : record.dataType;
        if (dataType === DATATYPE.QUOTE) {
          return <KeyOutlined />;
        }
        if (dataType === DATATYPE.FK) {
          return <span style={{ fontSize: '26px', fontWeight: 700 }}>”</span>;
        }
        return null;
      }}
    </Form.Item>);
  }, [record.dataType, formRef.current?.getFieldValue(COLUMNS_KEY.DATATYPE)]);
};
const getFieldColumns = ({
  formRef,
  editDictioary
}) => {
  return [
    {
      title: '序号',
      width: 70,
      key: "index",
      render: (text, record, index) => {
        return `${index + 1}`;
      }
    },
    {
      title: '字段名称',
      key: "name",
      dataIndex: "name",
      width: 120,
      render: (text, record) => {
        return (<Name
          text = {text}
          record = {record}
          formRef = {formRef}
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
          formRef = {formRef}
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
          formRef = {formRef}
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
          formRef = {formRef}
        />
      )
    },
    {
      title: '长度',
      key: COLUMNS_KEY.FIELDSIZE,
      dataIndex: COLUMNS_KEY.FIELDSIZE,
      width: 110,
      render: (text, record) => (
        <FieldSize
          text = {text}
          record = {record}
          formRef = {formRef}
        />
      )
    },
    {
      title: '小数点',
      key: COLUMNS_KEY.DECIMALSIZE,
      dataIndex: COLUMNS_KEY.DECIMALSIZE,
      width: 100,
      render: (text, record) => (
        <DecimalSize
          text = {text}
          record = {record}
          formRef = {formRef}
        />
      )
    },
    {
      title: '必填',
      key: COLUMNS_KEY.REQUIRED,
      dataIndex: COLUMNS_KEY.REQUIRED,
      width: 90,
      render: (text, record) => (
        <BooleanSelect
          text = {text}
          record = {record}
          formRef = {formRef}
          code = {COLUMNS_KEY.REQUIRED}
        />
      )
    },
    {
      title: '唯一',
      key: COLUMNS_KEY.UNIQUE,
      dataIndex: COLUMNS_KEY.UNIQUE,
      width: 90,
      render: (text, record) => (
        <BooleanSelect
          text = {text}
          record = {record}
          formRef = {formRef}
          code = {COLUMNS_KEY.UNIQUE}
        />
      )
    },
    {
      title: '字典',
      key: COLUMNS_KEY.DICTIONARYFOREIGNCN,
      dataIndex: COLUMNS_KEY.DICTIONARYFOREIGNCN,
      width: 100,
      render: (text, record) => {
        return <Dict
          editDictioary = { editDictioary }
          text={text}
          formRef={formRef}
          record={record}
        />;
      }
    },
    {
      title: '转换成拼音',
      key: COLUMNS_KEY.PINYINCONVENT,
      dataIndex: COLUMNS_KEY.PINYINCONVENT,
      width: 130,
      render: (text, record) => (
        <BooleanSelect
          text = {text}
          record = {record}
          formRef = {formRef}
          code = {COLUMNS_KEY.PINYINCONVENT}
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
      width: 70,
      render: (text, record) => {
        return <RenderText text={SPECIESCN?.[text]}/>;
      }
    },
    {
      title: ' ',
      key: 'index',
      width: 60,
      render: (text, record) => {
        return (
          <IconRenderer
            text = {text}
            formRef = {formRef}
            record = {record}
          />
        );
      }
    }
  ];
};
export default getFieldColumns;
