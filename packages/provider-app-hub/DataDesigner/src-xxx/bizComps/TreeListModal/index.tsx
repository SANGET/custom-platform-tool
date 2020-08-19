import React from 'react';
import {
  Form, Modal, Table, Input, Row, Col
} from 'antd';

/**
 * 组件仓库,用于动态渲染组件
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
/**
 * 左树右表页面
 * @param formProps--外层表单属性配置
 * @param modalProps--模态框属性配置
 * @param treeProps--模态框中树菜单属性配置
 * @param searchProps--模态框中搜素框属性配置
 * @param tableProps--模态框中列表属性配置
 */
const TreeListModal = ({
  formProps, modalProps, treeProps, searchProps, tableProps, ...rest
}) => {
  // console.log({ treeProps });
  const { form, formItemsConfig } = formProps;
  // console.log({ treeData });
  /** 表单初始化 */
  // form.setFieldsValue({
  //   /** long 引用主键 */
  //   id: '',
  //   /**  String 字段编码 */
  //   fieldCode: '',
  //   /**  String 字段名称 */
  //   fieldName: '',
  //   /**  String 关联表 */
  //   refTableCode: '',
  //   /**  String 关联字段 */
  //   refFieldCode: '',
  //   /**  String 显示字段 */
  //   refDisplayFieldCode: '',
  //   /**  int 排序号 */
  //   sequence: '',
  // });

  return (
    <>
      <Form
        name="biz-form"
        /** 受控组件实例 */
        form={form}
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

export default TreeListModal;
