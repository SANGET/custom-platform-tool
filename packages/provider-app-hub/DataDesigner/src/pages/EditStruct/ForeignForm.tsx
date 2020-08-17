import React, { useState, useEffect, useCallback } from 'react';
import {
  Form, Modal, Table, Input, Row, Col
} from 'antd';
/** 当前页面样式 */
// import './tableStruct.less';

/**
 * 在antd Select组件基础上封装的选择框组件
 */
import BasicStory from '@provider-app/data-designer/src/components/BasicStory';
/** 菜单树业务组件 */
import MenuTree from '@provider-app/data-designer/src/bizComps/MenuTree';

/** 搜索输入框 */
const { Search } = Input;

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

const ReferenceForm = ({
  RefFieldEnum, searchProps, treeProps, tableProps, modalProps, formProps, ...rest
}) => {
  const { form, formItemsConfig } = formProps;
  // console.log({ treeData });
  /** 表单初始化 */
  form.setFieldsValue({
    /** long 引用主键 */
    id: '',
    /**  String 字段编码 */
    fieldCode: '',
    /**  String 字段名称 */
    fieldName: '',
    /**  String 关联表 */
    refTableCode: '',
    /**  String 关联字段 */
    refFieldCode: '',
    /**  String 显示字段 */
    refDisplayFieldCode: '',
    /**  int 排序号 */
    sequence: '',
  });

  // console.log({
  //   treeData1,
  //   treeData
  // });

  const onTypeChange = () => {
    // dispatch({ type: 'increment' });
    // const { primaryTable: primaryTable } = state;
    // const primaryTableCopy = JSON.parse(JSON.stringify(state.primaryTable));

    // console.log(form.getFieldValue('type'));
    // if (form.getFieldValue('type') === 'auxTable') {
    //   formItemsConfig.primaryTable.hide = false;
    //   const { primaryTable } = formItemsConfig;
    //   setFormItemsConfig({ ...formItemsConfig, primaryTable });
    //   // setFormItemsConfig((prevState) => ({
    //   //   ...prevState,
    //   //   primaryTable: { hide: false }

    //   // }));
    //   console.log(form.getFieldValue('type'), formItemsConfig.primaryTable);
    // } else {
    //   formItemsConfig.primaryTable.hide = true;
    //   const { primaryTable } = formItemsConfig;
    //   setFormItemsConfig({ ...formItemsConfig, primaryTable });
    //   // setFormItemsConfig(formItemsConfig);
    //   // console.log(form.getFieldValue('type'), formItemsConfig.primaryTable);
    //   // dispatch({ type: 'setFormItemsConfig', primaryTable: primaryTableCopy });
    // }
    // dispatch({ type: 'setFormItemsConfig', formItemsConfig: state.formItemsConfig });
  };
  // /** 表单配置项 */
  // const formItemsConfigInitValue = {
  //   refTableCode: {
  //     /** 表单项属性 */
  //     itemAttr: {
  //       label: "关联表",
  //       name: "refTableCode",
  //       rules: [
  //         { required: true, message: '请选择关联表!' },
  //         { pattern: /^[\u4e00-\u9fa5_a-zA-Z0-9()]+$/, message: '输入字段可以为中文、英文、数字、下划线、括号' },
  //         { max: 64, message: '最多只能输入64个字符' },
  //         /** 自定义校验器 */
  //         // ({ getFieldValue }) => ({
  //         //   validator(rule, value) {
  //         //     if (!value || getFieldValue('password') === value) {
  //         //       return Promise.resolve();
  //         //     }
  //         //     /** 这里如果不写成new Error,会触发eslint告警 */
  //         //     return Promise.reject(new Error('The two passwords that you entered do not match!'));
  //         //   },
  //         // }),
  //       ],
  //     },
  //     /** 表单项包裹组件属性 */
  //     compAttr: {
  //       type: 'Input',
  //       placeholder: '请选择关联表',
  //       onChange: (e) => {
  //         /** 将表格名称转换为汉字首字母拼音 */
  //         form.setFieldsValue({ code: PinYin.getCamelChars(form.getFieldValue('name')) });
  //       }
  //     }
  //   },
  //   /**
  //   * 关联字段--数据来自表结构详情中的表字段
  //   */
  //   refFieldCode: {
  //     itemAttr: {
  //       label: "关联字段",
  //       name: "refFieldCode",
  //       rules: [{ required: true, message: '请选择关联字段!' }],
  //     },
  //     compAttr: {
  //       type: 'BasicSelect',
  //       enum: RefFieldEnum,
  //     }
  //   },
  //   /**
  //   * 显示字段
  //   */
  //   refDisplayFieldCode: {
  //     itemAttr: {
  //       name: "refDisplayFieldCode",
  //       label: "显示字段"
  //     },
  //     compAttr: {
  //       type: 'BasicSelect',
  //       enum: RefFieldEnum,
  //       onChange: onTypeChange
  //     }
  //   },
  // };

  // const [formItemsConfig, setFormItemsConfig] = useState(formItemsConfigInitValue);
  // useEffect(() => {
  //   console.log('xxx', formItemsConfig.primaryTable.hide);
  // }, [formItemsConfig.primaryTable.hide]);
  // const [state, dispatch] = useReducer(reducer, formItemsConfigInitValue, init);
  // console.log(state);
  // const {
  //   name, code, type, primaryTable: primaryTable, moduleId: moduleId, tag, description
  // } = formItemsConfigInitValue;
  // console.log({ treeProps });
  return (
    <>
      <Form
        name="auth-form"
        /** 受控组件实例 */
        form={form}
        className="auth-form"
        {...formItemLayout}
        {...rest}
      >{

          Object.keys(formItemsConfig).map((key) => (
            <Form.Item key={key} {...formItemsConfig[key].itemAttr}>
              <BasicStory {...formItemsConfig[key].compAttr} />
            </Form.Item>
          ))
        }
      </Form>
      <Modal {...modalProps}>
        <Row gutter={16}>
          <Col span={10}>
            <MenuTree {...treeProps} />
          </Col>
          <Col span={14}>
            <Search {...searchProps} />
            <Table
              bordered
              {...tableProps}
              pagination={false}
            />
          </Col>
        </Row>
      </Modal>
    </>
  );
};

export default ReferenceForm;
