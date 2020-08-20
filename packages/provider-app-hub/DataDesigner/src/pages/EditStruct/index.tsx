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
import Http from '@infra/utils/http';
/**
 * 在antd Select组件基础上封装的选择框组件
 */
import BasicStory from '@provider-app/data-designer/src/components/BasicStory';
/** 表结构类型 */
import { TableTypeEnum } from '@provider-app/data-designer/src/tools/constant';

import { GetMenuTree } from '@provider-app/data-designer/src/api';

import './EditStruct.less';

// import { useMappedState } from 'redux-react-hook';

const { CheckableTag } = Tag;

const { TabPane } = Tabs;

/**
 * 数据表名称 数据表编码 表类型 归属模块
 */
const EditStruct = () => {
  /**
   * 全局加载动画设置
   */
  // const { structTableData } = useMappedState((state) => ({
  //   structTableData: state.structTableData
  // }));
  /** react路由跳转方法,必须定义在react 组件中,跳转到编辑表页面时要用 */
  // const History = useHistory();

  // console.log(History.location.state.id);

  const [detailData, setDetailData] = useState({ columns: [] });

  /** 创建可控表单实例--用于新建表 */
  const [form] = Form.useForm();

  useEffect(() => {
    // http:// {ip}:{port}/paas/ {lesseeCode}/{applicationCode}/data/v1/tables/00dd1b16e3a84a6fbeed12a661484eba
    const res = getUrlParams(undefined, undefined, true).id;
    console.log(res);
    Http.get(`/data/v1/tables/${History.location.state.id}`, {}).then((res) => {
      // console.log(res);

      setDetailData(res.data.result);

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
        readOnly: true,
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
        Http.put('http://{ip}:{port}/paas/ {lesseeCode}/{applicationCode}/data/v1/tables/').then((res) => {
          const submitData = {
          /** 是 表主键 */
            id: '',
            /** 是 数据表名称  */
            name: '',
            /** 是数据表编码 */
            code: '',
            /** 否表类型normalTable(普通表)tree(树形表)auxTable(附属表) */
            type: '',
            /** 是-归属模块，对应菜单模块主键 */
            moduleId: '',
            /** 否-业务字段类型，SYS(系统元数据)BIS(业务元数据)，用户填写的表默认BIS即可 */
            species: '',
            /** 否-备注 */
            description: '',
            /** 否-附属表对象,如果表类型是附属表，则必填 */
            auxTable: {
              /** 是-主表表名 */
              mainTableCode: '',
            },
            /** 否-树型表对象,如果表类型是树型表，则必填 */
            treeTable: {
              /** 是-最大层级数 */
              maxLevel: '',
            },
            /** 否-引用表对象集合 */
            references: [{
              /**  long 否 引用主键 */
              id: '',
              /**  String 是 字段编码 */
              fieldCode: '',
              /**  String 是 关联表 */
              refTableCode: '',
              /**  String 是 关联字段 */
              refFieldCode: '',
              /**  String 是 显示字段 */
              refDisplayFieldCode: '',
              /**  int */
              sequence: ''
            }],
            /** 否-外键对象集合 */
            foreignKeys: [{
              /**  long 否 主键 */
              id: '',
              /** String 是 字段编码 */
              fieldCode: '',
              /**  String 是 关联表 */
              refTableCode: '',
              /**  String 是 关联字段 */
              refFieldCode: '',
              /**  String 是 显示字段 */
              refDisplayFieldCode: '',
              /**  int 是 排序号 */
              sequence: '',
              /**  String 是 外键约束（删除时）,RESTRICT(存在关联不允许操作)CASCADE(级联)SET_NULL(置空)NO_ACTION(不处理) */
              deleteStrategy: '',
              /**  String 是 外键约束（更新时）,RESTRICT(存在关联不允许操作)CASCADE(级联)SET_NULL(置空)NO_ACTION(不处理) */
              updateStrategy: '',
            }],
            /** 否-列对象集合 */
            columns: [{
              /**  long 否 列主键 */
              id: '',
              /**  String 是 字段名称 */
              name: '',
              /**  String 是 字段编码 */
              code: '',
              /**  String 是 字段类型fieldType只能输入VARCHAR(字符串)INT(整型)TIME(时间)DATE(日期时间)TEXT(超大文本) */
              fieldType: '',
              // int 否 字段长度
              fieldSize: '',
              //  String 是 数据类型,NORMAL(普通字段)PK(主键字段)QUOTE(引用字段)DICT(字典字段)FK(外键字段)
              dataType: '',
              //  String 否 业务字段类型，SYS(系统元数据)BIS(业务元数据)，用户填写的表默认BIS即可
              species: '',
              //  int 否 小数位
              decimalSize: '',
              /**  int 否 排序号 */
              sequence: '',
              /**  Map 否 属性对象,key为列的页面属性，value为对应的属性值 */
              fieldProperty: {
                /**  必填,值true是，false否 */
                required: '',
                /**  唯一,值true是，false否 */
                unique: '',
                /**  装换成拼音,值true是，false否 */
                pinyinConvent: '',
                /**  校验规则 */
                regular: '',
              },
              /**  DictionaryForeignVO 否 字典对象 */
              dictionaryForeign: {
                /** String 是 字典表名 */
                refTableCode: '',
                /** String 是 字典保存字段,写死code值 */
                refFieldCode: '',
                /**  String 是 字典显示字段,写死name值 */
                refDisplayFieldCode: '',
              }
            }]
          };

          // console.log();
        });
      }
    },
    {
      text: '返回',
      onClick: () => {
        onNavigate({
          type: "GO_BACK",
        });
        // console.log(History);
        // History.goBack();
      }
    },
  ];

  const tagsData = ['人员信息', '人员列表'];
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
      { tab: '表字段', key: 'TableField', tableData: detailData.columns },
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
                key={tag}
                checked={selectedTags.indexOf(tag as never) > -1}
                onChange={(checked) => handleTagChange(tag, checked)}
              >
                <a>{tag}</a>
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
              <BasicStory {...item} type={item.key} />
            </TabPane>
          ))
        }
      </Tabs>
    </div>
  );
};
export default EditStruct;
