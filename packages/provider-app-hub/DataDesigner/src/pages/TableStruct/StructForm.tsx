import React, { useState, useEffect } from 'react';
import {
  Form, TreeSelect, Input
} from 'antd';
/** 当前页面样式 */
import './tableStruct.less';

/** 导出基础选择框及其枚举数据 */
/** 内聚和单一职责,有时候令人感觉边界不清,枚举值和选择框组件放在一起貌似也不错 */
import { BasicSelect } from '@provider-app/data-designer/src/components/BasicSelect';
import { TableTypeEnum } from '@provider-app/data-designer/src/tools/constant';
/** 中文转拼音工具 */
import PinYin from 'js-pinyin';

/** 中文转换为拼音工具设置选项 */
PinYin.setOptions({
  /** 关闭音调转换功能 */
  checkPolyphone: false,
  /** 将汉字首字母转换为大写拼音 */
  charCase: 0,
});

/** 文本域组件是Input的一个衍生类型 */
const { TextArea } = Input;

/** 组件列表 */
const components = {
  Input,
  TextArea,
  BasicSelect,
  TreeSelect,
};

/** 组件仓库-动态渲染组件 */
const Story = (props) => {
  // type是组件类型
  const SpecificStory = components[props.type];
  return <SpecificStory {...props} />;
};

/** 表单项label和content的宽度 */
const formItemLayout = {
  /** 满栅格是24, 设置label标签宽度 */
  labelCol: {
    span: 4
  },
  /** 设置表单项宽度 */
  wrapperCol: {
    span: 20
  }
};

// function init(formItemsConfig) {
//   return { formItemsConfig };
// }

// const reducer = (state, action) => {
//   const { formItemsConfig } = action;
//   switch (action.type) {
//     case 'setFormItemsConfig':
//       return { formItemsConfig };
//     default:
//       throw new Error();
//   }
// };

const StructForm = ({
  form, treeData, initialValues, ...rest
}) => {
  // console.log({ treeData });
  /** 表单初始化 */
  form.setFieldsValue({
    /** 是 数据表名称  */
    name: '',
    /** 是 数据表编码 */
    code: '',
    /** 是 表类型 */
    type: '',
    /** 是 归属模块 */
    module_id: '',
    /** 否 业务字段类型，SYS(系统元数据)BIS(业务元数据)，用户填写的表默认BIS即可 */
    species: 'BIS',
    /** 否 备注  */
    description: '',
    /** 否 附属表对象,如果表类型是附属表，则必填 */
    aux_table: {},
    /** 否 树型表对象,如果表类型是树型表，则必填 */
    tree_table: {},
    /** 否 引用表对象集合 */
    references: [],
    /** 否 外键对象集合 */
    foreign_keys: [],
    /** 否 列对象集合 */
    columns: [],
  });

  // console.log({
  //   treeData1,
  //   treeData
  // });
  /** 树形属性配置 */
  const tProps = {
    treeData,
    value: '',
    placeholder: '请选择父级',
    style: {
      width: '100%'
    }
  };

  const onTypeChange = () => {
    // dispatch({ type: 'increment' });
    // const { primary_table: primaryTable } = state;
    // const primaryTableCopy = JSON.parse(JSON.stringify(state.primary_table));

    console.log(form.getFieldValue('type'));

    if (form.getFieldValue('type') === 'auxTable') {
      formItemsConfig.primary_table.hide = false;
      setFormItemsConfig(formItemsConfig);
    } else {
      formItemsConfig.primary_table.hide = true;
      setFormItemsConfig(formItemsConfig);
      // dispatch({ type: 'setFormItemsConfig', primary_table: primaryTableCopy });
    }
    // dispatch({ type: 'setFormItemsConfig', formItemsConfig: state.formItemsConfig });
  };
  /** 表单配置项 */
  const formItemsConfigInitValue = {
    name: {
      /** 表单项属性 */
      itemAttr: {
        label: "数据表名称",
        name: "name",
        rules: [
          { required: true, message: '请输入数据表名称!' },
          { pattern: /^[\u4e00-\u9fa5_a-zA-Z0-9()]+$/, message: '输入字段可以为中文、英文、数字、下划线、括号' },
          { max: 64, message: '最多只能输入64个字符' },
          /** 自定义校验器 */
          // ({ getFieldValue }) => ({
          //   validator(rule, value) {
          //     if (!value || getFieldValue('password') === value) {
          //       return Promise.resolve();
          //     }
          //     /** 这里如果不写成new Error,会触发eslint告警 */
          //     return Promise.reject(new Error('The two passwords that you entered do not match!'));
          //   },
          // }),
        ],
      },
      /** 表单项包裹组件属性 */
      compAttr: {
        type: 'Input',
        placeholder: '最多可输入64个字符，名称唯一。输入字段可以为中文、英文、数字、下划线、括号',
        onChange: (e) => {
          /** 将表格名称转换为汉字首字母拼音 */
          form.setFieldsValue({ code: PinYin.getCamelChars(form.getFieldValue('name')) });
        }
      }
    },
    code: {
      itemAttr: {
        label: "数据表编码",
        name: "code",
        rules: [{ required: true, message: '请输入数据表编码!' }],
      },
      compAttr: {
        type: 'Input'
      }
    },
    type: {
      itemAttr: {
        name: "type",
        label: "表类型"
      },
      compAttr: {
        type: 'BasicSelect',
        enum: TableTypeEnum,
        onChange: onTypeChange
      }
    },
    primary_table: {
      hide: false,
      itemAttr: {
        name: "primay_table",
        label: "主表"
      },
      compAttr: {
        type: 'Input',
      }
    },
    module_id: {
      itemAttr: {
        name: "module_id",
        label: "归属模块"
      },
      compAttr: {
        type: 'TreeSelect',
        enum: TableTypeEnum,
        ...tProps
      }
    },
    tag: {
      itemAttr: {
        name: "tag",
        label: "标签"
      },
      compAttr: {
        type: 'Input',
      }
    },
    description: {
      itemAttr: {
        name: "description",
        label: "备注",
        rules: [
          { max: 100, message: '最多只能输入100个中文字符' },
        ],
      },
      compAttr: {
        type: 'TextArea',
        placeholder: '最多支持100个中文字符的输入',
        autoSize: { minRows: 4, maxRows: 6 }
      }
    }
  };

  const [formItemsConfig, setFormItemsConfig] = useState(formItemsConfigInitValue);
  useEffect(() => {
    console.log('xxx', formItemsConfig.primary_table.hide);
  }, [formItemsConfig.primary_table.hide]);
  // const [state, dispatch] = useReducer(reducer, formItemsConfigInitValue, init);
  // console.log(state);
  // const {
  //   name, code, type, primary_table: primaryTable, module_id: moduleId, tag, description
  // } = formItemsConfigInitValue;
  return (
    <Form
      name="auth-form"
      /** 受控组件实例 */
      form={form}
      className="auth-form"
      {...formItemLayout}
      /** 表单初始值 */
      initialValues={initialValues}
      {...rest}
    >{

        Object.keys(formItemsConfig).map((key) => (
          !formItemsConfig[key].hide
            ? (<Form.Item key={key} {...formItemsConfig[key].itemAttr}>
              <Story {...formItemsConfig[key].compAttr} />
            </Form.Item>) : ''
        ))
      }
    </Form>);
};

export default StructForm;
