import React, { useState, useEffect } from 'react';
import { Form, Row, Col } from 'antd';

/**
 * 用于动态选择组件
 */
import BasicStory from '@provider-app/data-designer/src/components/BasicStory';

/** 表单项label和content的宽度 */
const formItemLayoutInit = {
  /** 满栅格是24, 设置label标签宽度 */
  labelCol: {
    span: 6
  },
  /** 设置表单项宽度 */
  wrapperCol: {
    span: 18
  }
};
/**
 * 基础表单组件
 * @param form-表单控件实例
 * @param formItemsConfig-表单项配置
 * @param colSpan-表单项列宽
 */
const BasicForm = (props) => {
  const {
    form, formItemsConfig, colSpan = 24, gutter = 0, formItemLayout = formItemLayoutInit
  } = props;
  return (
    <Form
      name="basic-form"
      /** 受控组件实例 */
      form={form}
      {...formItemLayout}
    >
      <Row gutter={gutter}>
        {

          Object.keys(formItemsConfig).map((key) => (
            <Col key={key} span={colSpan}>
              <Form.Item {...formItemsConfig[key].itemAttr}>
                <BasicStory {...formItemsConfig[key].compAttr} />
              </Form.Item>
            </Col>
          ))
        }
      </Row>
    </Form>);
};

export default BasicForm;
