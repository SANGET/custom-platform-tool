import React, { useState } from 'react';
import {
  Row, Col, Form, Button
} from 'antd';
import styled from 'styled-components';

import { DownOutlined, UpOutlined } from '@ant-design/icons';

/**
 * 组件仓库,用于动态生成组件
 */
import BasicStory from '@provider-app/data-designer/src/components/BasicStory';

/**
*搜素表单样式
*/
const SearchStyled = styled.div`
[data-theme='compact'] .ant-advanced-search-form,
.ant-advanced-search-form {
  padding: 24px;
  background: #fbfbfb;
  border: 1px solid #d9d9d9;
  border-radius: 2px;
}

[data-theme='compact'] .ant-advanced-search-form .ant-form-item,
.ant-advanced-search-form .ant-form-item {
  display: flex;
}

[data-theme='compact'] .ant-advanced-search-form .ant-form-item-control-wrapper,
.ant-advanced-search-form .ant-form-item-control-wrapper {
  flex: 1;
}
`;
/**
 * 基本的内联搜索表单
 * @param formItemLayout-labelCol   label列的宽度 栅格布局 一个表单项单元总共24列
 * @param formItemLayout-wrapperCol 表单项内容的宽度
 * @param colSpan 表单项内容的宽度 每个表单项单元的列宽 栅格布局 一行总共24列
 * @param btnSpan 行内按钮组的列宽 栅格布局 一行总共24列
 * @param layout 表单布局类型 有横向 纵向 内联三种
 * @param items 表单项配置集合
 * @param form 表单实例
 * @param style 表单样式
 */
const BasicForm = (props) => {
  const {
    formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 18 },
    },
    style = { padding: '16px 20px' },
    layout = 'inline',
    colSpan = 6,  //-----
    btnSpan = 6,
    gutter = 24,
    items,     //----
    form,    //-----
  } = props;

  /**
  * 按照表单项配置items,动态生成表单
  */
  const getFields = (items) => {
    return Object.keys(items).map((key) => {
      /**
      * 按钮比较特别:
      * 1.按钮名称书写在标签之间,不能作为一个属性配置,
      * 2.没有itemAttr配置
      */
      return key === 'btns' ? (    // --------判断是否是按钮好像没什么用
        <Col span={btnSpan} key={key}>
          <Form.Item>
            {
              items[key].compAttr.map((props) => {
                return (<Button key={props.text} className="btn" {...props}>{props.text}</Button>);
              })
            }
          </Form.Item>
        </Col>
      ) : (
          <Col span={colSpan} key={key}>
            <Form.Item name={key} {...items[key].itemAttr}>
              <BasicStory {...items[key].compAttr} />
            </Form.Item>
          </Col>
        );
    });
  };
  const onFinish = values => {
    console.log(values)
  }
  return (
    <Form
      {...formItemLayout}
      layout={layout}
      form={form}
      style={style}
      onFinish={onFinish}
    >
      <Row gutter={24}>{getFields(items)}</Row>
    </Form>);
};

/**
 * 含有折叠功能的高级表单
 */
const AdvancedSearchForm = () => {
  const [expand, setExpand] = useState(false);
  const [form] = Form.useForm();

  const getFields = () => {
    const count = expand ? 10 : 6;
    const children = [];
    // for (let i = 0; i < count; i++) {
    //   children.push(
    //     <Col span={8} key={i}>
    //       <Form.Item
    //         name={`field-${i}`}
    //         label={`Field ${i}`}
    //         rules={[
    //           {
    //             required: true,
    //             message: 'Input something!',
    //           },
    //         ]}
    //       >
    //         <Input placeholder="placeholder" />
    //       </Form.Item>
    //     </Col>,
    //   );
    // }
    return children;
  };

  const onFinish = (values) => {
    console.log('Received values of form: ', values);
  };

  return (
    <SearchStyled>
      <Form
        form={form}
        name="advanced_search"
        className="ant-advanced-search-form"
        onFinish={onFinish}
      >
        <Row gutter={24}>{getFields()}</Row>
        <Row>
          <Col span={24} style={{ textAlign: 'right' }}>
            <Button type="primary" htmlType="submit">
              搜索
            </Button>
            <Button
              style={{ margin: '0 8px' }}
              onClick={() => {
                form.resetFields();
              }}
            >
              清空
            </Button>
            <Button
              type='link'
              style={{ fontSize: 12 }}
              onClick={() => {
                setExpand(!expand);
              }}
            >
              {expand ? <UpOutlined /> : <DownOutlined />} Collapse
            </Button>
          </Col>
        </Row>
      </Form>
    </SearchStyled>
  );
};

export default BasicForm;
export { AdvancedSearchForm };
