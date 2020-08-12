import React, { FC, useState, useEffect } from 'react';
import {
  Tabs, Form, Tag, Row, Col, Button
} from 'antd';

/**
 * 在antd Select组件基础上封装的选择框组件
 */
import BasicStory from '@provider-app/data-designer/src/components/BasicStory';
/** 表结构类型 */
import { TableTypeEnum } from '@provider-app/data-designer/src/tools/constant';

// import EditableTable from '@provider-app/data-designer/src/bizComps/EditableTable';

import './editStruct.less';

const { CheckableTag } = Tag;

const { TabPane } = Tabs;
/**
 * 数据表名称 数据表编码 表类型 归属模块
 */
const EditStruct :FC = () => {
  /** 表单项label和content的宽度 */
  const formItemLayout = {
  /** 满栅格是24, 设置label标签宽度 */
    labelCol: {
      span: 7
    },
    /** 设置表单项宽度 */
    wrapperCol: {
      span: 17
    }
  };

  /** 创建可控表单实例--用于新建表 */
  const [form] = Form.useForm();
  const formItemsConfig = {
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
        placeholder: '',
      }
    },
    code: {
      itemAttr: {
        label: "数据表编码",
        name: "code",
        rules: [{ required: true, message: '请输入数据表编码!' }],
      },
      compAttr: {
        type: 'Input',
        readOnly: true,
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
        readOnly: true,
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
        // ...tProps
      }
    },
  };
  const formButs = [
    { text: '保存', onClick: () => {} },
    { text: '返回', onClick: () => {} },
  ];

  const tagsData = ['人员信息', '人员列表'];
  const [selectedTags, setSelectedTags] = useState([]);
  const handleTagChange = (tag, checked) => {
    const nextSelectedTags = checked ? [tag] : selectedTags.filter((t) => t !== tag);
    setSelectedTags(nextSelectedTags);
  };

  const tabsConf = {
    attr: {
      defaultActiveKey: 'ReferenceTable',
      type: "card" as const,
      size: 'small' as const,
      style: { marginTop: '20px' },
      onTabClick: (activeKey) => {
        console.log(activeKey);
      },
    },
    panes: [
      { tab: '表字段', key: 'TableField' },
      { tab: '引用表', key: 'ReferenceTable', },
      { tab: '外键设置', key: 'ForeignKeySet', },
      { tab: '组合唯一', key: 'ComposeUnique', },
      { tab: '索引设置', key: 'IndexSet', },
      { tab: '触发器', key: 'Trigger', },
      { tab: '表操作日志', key: 'TableLog', },
    ]
  };

  return (
    /**
    * 包裹编辑部容器的main区域 设置了padding：12px
    */
    <div className="b1px edit-struct" style={{ height: '100%', padding: '20px 10px' }}>
      <Form
        name="edit-struct-search-form"
        /** 受控组件实例 */
        form={form}
        {...formItemLayout}
        /** 表单初始值 */
        initialValues={{}}
      >
        <Row gutter={24}>{
          Object.keys(formItemsConfig).map((key) => (
            /**
            *    设置表单项每项占行宽的24之五
            */
            <Col span={5} key={key}>
              <Form.Item key={key} {...formItemsConfig[key].itemAttr} className="w100">
                <BasicStory {...formItemsConfig[key].compAttr} />
              </Form.Item>
            </Col>
          ))
        }
        {/* 设置按钮的宽度占行宽的24之四 */}
        <Col span={4} className="form-buts">
          {formButs.map((item) => (<Button key={item.text} type='primary' className="button">{item.text}</Button>))}
        </Col>
        </Row>
      </Form>

      {/* 关联页面 部分 */}
      <Row gutter={24}>
        <Col span={20} style={{ display: 'flex' }}>
          {/* 关联页面label宽度 */}
          <div className="ant-form-item-label" style={{ width: '100px' }}>
            <label title="数据表名称">关联页面</label>
          </div>
          {/* 关联页面内容 */}
          <div style={{ border: '1px solid #ccc', width: '100%', padding: '6px 16px', }}>
            {tagsData.map((tag) => (
              <CheckableTag
                key={tag}
                checked={selectedTags.indexOf(tag as never) > -1}
                onChange={(checked) => handleTagChange(tag, checked)}
              >
                <a href={tag}>{tag}</a>
              </CheckableTag>
            ))}
          </div>
        </Col>
      </Row>
      {/* tab面板部分 */}
      <Tabs {...tabsConf.attr}>
        {
          tabsConf.panes.map((item) => (
            <TabPane tab={item.tab} key={item.key}>
              <BasicStory type={item.key} />
            </TabPane>
          ))
        }
      </Tabs>
    </div>
  );
};
export default EditStruct;
