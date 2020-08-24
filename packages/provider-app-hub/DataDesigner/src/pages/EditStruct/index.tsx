import React, { FC, useState, useEffect } from 'react';
/** react路由暴露出来的页面跳转方法 */
// import { useHistory, Location } from 'react-router-dom';
import { onNavigate, getUrlParams } from 'multiple-page-routing';
import {
  Tabs, Form, Tag, Row, Col, Button
} from 'antd';
/*
* 网络请求工具
*/
import Http, { Msg } from '@infra/utils/http';
/**
 * 在antd Select组件基础上封装的选择框组件
 */
import BasicStory from '@provider-app/data-designer/src/components/BasicStory';
/** 表结构类型 */
import { TableTypeEnum, FieldTypeEnum } from '@provider-app/data-designer/src/tools/constant';

import { GetMenuTree } from '@provider-app/data-designer/src/api';

import './EditStruct.less';

import { useDispatch, useMappedState } from 'redux-react-hook';
/**
* 连接器的作用给子项目的redux-react-hook提供一个provider,还有限定样式作用域
*/
import { Connector } from '@provider-app/data-designer/src/connector';

const { CheckableTag } = Tag;

const { TabPane } = Tabs;

/**
 * 数据表名称 数据表编码 表类型 归属模块
 */
const EditStruct = ({ treeData }) => {
  /**
   * 表编辑详情
   */
  const dispatch = useDispatch();
  const { structRowData } = useMappedState((state) => ({
    structRowData: state.structRowData
  }));

  const { columns, relationTables: tagsData } = structRowData;
  // const [cols, setCols] = useState([]);
  // console.log({ columns });

  /** 创建可控表单实例--用于新建表 */
  const [form] = Form.useForm();

  useEffect(() => {
    // http:// {ip}:{port}/paas/ {lesseeCode}/{applicationCode}/smart_building/data/v1/tables/00dd1b16e3a84a6fbeed12a661484eba
    const { id } = getUrlParams(undefined, undefined, true);
    // console.log({ id });
    // console.log(res);
    Http.get(`/smart_building/data/v1/tables/${id}`, {}).then((res) => {
      // console.log(res);
      /** 设置详情 */
      dispatch({
        type: 'setStructRowData',
        structRowData: res.data.result
      });
      // console.log(res.data.result);
      // setCols(res.data.result.columns);

      /** 编辑表公共信息 */
      const {
        name, code, type, moduleId
      } = res.data.result;

      form.setFieldsValue({
        name, code, type, moduleId
      });
    });
  }, []);

  // console.log({ structTableData });

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

  const formItemsConfigInit = {
    name: {
    /** 表单项属性 */
      itemAttr: {
        label: "数据表名称",
        name: "name",
        rules: [
          { required: true, message: '请输入数据表名称!' },
          { pattern: /^[\u4e00-\u9fa5_a-zA-Z0-9()]+$/, message: '输入字段可以为中文、英文、数字、下划线、括号' },
          { max: 64, message: '最多只能输入64个字符' },
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
        disabled: true,
        // readOnly: true,
      }
    },
    moduleId: {
      itemAttr: {
        name: "moduleId",
        label: "归属模块"
      },
      compAttr: {
        type: 'TreeSelect',
        enum: TableTypeEnum,
        treeData: []
        // ...tProps
      }
    },
  };

  const [formItemsConfig, setFormItemsConfig] = useState(formItemsConfigInit);
  /**
  * 获取树选择数据
  */
  const fetchSelectTreeData = async () => {
    const data = await GetMenuTree();
    formItemsConfig.moduleId.compAttr.treeData = data as never[];
    /**
    * 更新表单渲染数据
    */
    setFormItemsConfig({ ...formItemsConfig });
  };

  /**
   * 凡是http请求，都会造成页面死循环,都要放在useEffect中
   */
  useEffect(() => {
    fetchSelectTreeData();
  }, []);

  const formButs = [
    {
      text: '保存',
      onClick: () => {
        Http.put('/smart_building/data/v1/tables/', structRowData).then((res) => {
          Msg.success('操作成功');
          onNavigate({
            type: "GO_BACK",
          });
        });
      }
    },
    {
      text: '返回',
      onClick: () => {
        onNavigate({
          type: "GO_BACK",
        });
      }
    },
  ];

  // console.log({ tagsData });
  const [selectedTags, setSelectedTags] = useState([]);
  const handleTagChange = (tag, checked) => {
    const nextSelectedTags = checked ? [tag] : selectedTags.filter((t) => t !== tag);
    setSelectedTags(nextSelectedTags);
  };

  const tabsConf = {
    attr: {
      defaultActiveKey: 'TableField',
      type: "card" as const,
      size: 'small' as const,
      style: { marginTop: '20px' },
      onTabClick: (activeKey) => {
        console.log(activeKey);
      },
    },
    panes: [
      { tab: '表字段', key: 'TableField', tableData: columns },
      { tab: '引用表', key: 'ReferenceTable', },
      { tab: '外键设置', key: 'ForeignKeySet', alias: 'ReferenceTable' },
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
          {formButs.map((item) => (<Button key={item.text} type='primary' className="button" onClick={item.onClick}>{item.text}</Button>))}
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
                key={tag.name}
                checked={selectedTags.indexOf(tag.name as never) > -1}
                onChange={(checked) => handleTagChange(tag.name, checked)}
              >
                <a>{tag.name}</a>
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
              <BasicStory {...item} type={item.alias || item.key} />
            </TabPane>
          ))
        }
      </Tabs>
    </div>
  );
};

export default Connector(EditStruct);
