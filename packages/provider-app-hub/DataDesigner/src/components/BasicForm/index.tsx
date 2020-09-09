import React, { useState, useEffect, useRef } from 'react';
import {
  Row, Col, Form, Button, Input, Space,Table
} from 'antd';
import styled from 'styled-components';

import {
  DownOutlined, UpOutlined, PlusOutlined, MinusOutlined
} from '@ant-design/icons';

/**
 * 组件仓库,用于动态生成组件
 */
import BasicStory from '@provider-app/data-designer/src/components/BasicStory';
import { renderOperCol } from '@provider-app/data-designer/src/components/BasicEditTable';

const FormStyled = styled.div`
#basic-form{
  margin:16px 20px 0 20px;
}

.ant-row{
  margin-bottom:16px;
}
.search-form{
  margin:0 !important;
  .ant-row{
    margin:0 !important;
  }
}

.ant-col.ant-col-18.ant-form-item-control{
  max-width: 100%; 
}
.ant-input-number{
  width:100%;
}
`;

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

// padding: '16px 20px'
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
    style = { },
    layout = 'inline',
    listName = 'items',
    colSpan = 6,
    btnSpan = 6,
    gutter = 24,
    items,
    form,
    isAddEditRow,
    className,
  } = props;

  const listRef = useRef(null);
 

  useEffect(() => {
    // console.log({ isAddEditRow });
    /**
     * 是否要设置一行动态表单编辑行
     */
    if (isAddEditRow) {
      listRef.current && listRef.current();
    }
  }, []);
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
      return key === 'btns' ? (
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
        <Col span={colSpan} key={key} className={items[key].itemAttr.className}>
          <Form.Item name={key} {...items[key].itemAttr}>
            <BasicStory {...items[key].compAttr} />
          </Form.Item>
        </Col>
      );
    });
  };

  /**
   * 设置每行的字体和背景色
   * @param name-字体色/背景色的key
   * @param name-字体色/背景色的key
   */
  const getColor = ({ name, index }) => {
    // console.log(name, index, form.getFieldValue('items'));
    if (form.getFieldValue('items') && form.getFieldValue('items')[index]) {
      if (name === 'renderFontColor') {
        return form.getFieldValue('items')[index][name];
      }
      return form.getFieldValue('items')[index][name];
    }
    if (name === 'renderFontColor') {
      return '#000';
    }
    return 'transparent';
  };

  const getList = (listItems, addRow?) => {
    return (
      <Form.List name={listName} >
        {
        (fields, { add, remove }) => {
        
          listRef.current = add;
          return (

            fields.map((field, index) => (

              <Row
                gutter={10}
                key={field.key}
                style={{ display: 'flex', alignItems: '' }}
              >
                {
                  Object.keys(listItems).map((key) => (
                    <Col span={5} key={key}>
                      <Form.Item
                        {...field}
                        name={[field.name, key]}
                        fieldKey={[field.fieldKey, key]}
                        rules={listItems[key].itemAttr.rules}
                      >
                        <BasicStory
                          {...listItems[key].compAttr}
                          onClick={listItems[key].compAttr.onClick ? (e) => { listItems[key].compAttr.onClick(e, index); } : null}
                          onChange={listItems[key].compAttr.onChange ? (e) => { listItems[key].compAttr.onChange(e, index); } : null}
                          color={ listItems[key].compAttr.color ? getColor({ name: key, index }) : null}

                        />
                      </Form.Item>
                    </Col>
                  ))
                }
                <Col span={4}>
                  <Space style={{ marginTop: 6 }}>
                    <PlusOutlined
                      onClick={() => {
                        add();
                      }}
                    />

                    <MinusOutlined
                      className={index ? 'show' : 'hide'}
                      onClick={() => {
                        remove(field.name);
                      }}
                    />
                  </Space>
                </Col>

              </Row>

            ))

          );
        }}
      </Form.List>);
  };

  return (
    <FormStyled >
      <Form
        {...formItemLayout}
        layout={layout}
        form={form}
        style={style}
        name="basic-form"
        className={className}
      >
        {items ? <Row
          gutter={gutter} style={{ marginLeft: 0, marginRight: 0, marginBottom: 20 }}
        >{getFields(items)}</Row> : null}
        {props.listItems ? getList(props.listItems) : null}

      </Form>
    </FormStyled>);
}

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
