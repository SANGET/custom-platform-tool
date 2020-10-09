import React, { FC, useState, useEffect } from 'react';
/** react路由暴露出来的页面跳转方法 */
// import { useHistory, Location } from 'react-router-dom';
import { onNavigate } from 'multiple-page-routing';
import { getUrlSearchParams } from "@mini-code/request/url-resolve";
import {
  Tabs, Form, Tag, Row, Col, Button, Input
} from 'antd';
/*
* 网络请求工具
*/
import Http, { Msg } from '@infra/utils/http';
/**
 * 在antd Select组件基础上封装的选择框组件
 */
import BasicStory from '@provider-app/data-designer/src/components/BasicStory';
/** 表类型枚举 */
import { TableTypeEnum } from '@provider-app/data-designer/src/tools/constant';

import { GetMenuTree, GetTableData } from '@provider-app/data-designer/src/api';

import './EditStruct.less';
/** 可以简化redux书写的语法糖 */
import { useDispatch, useMappedState } from 'redux-react-hook';
/** 提交数据后重置表结构行记录详情要用 */
import { defaultState } from '@provider-app/data-designer/src/store/initState';
/**
* 连接器的作用给子项目的redux-react-hook提供一个provider,还有限定样式作用域
* 用到redux-react-hook的地方，都要用链接器包裹
*/
import { Connector } from '@provider-app/data-designer/src/connector';

/** 表类型枚举--表格列代码转文字时 要用 */
import {
  DataTypeEnum, FieldTypeEnum, YNTypeEnum, SpeciesTypeEnum
} from '@provider-app/data-designer/src/tools/constant';

/** 关联页面要用到的tag组件 */
const { CheckableTag } = Tag;
/** tab面板 */
const { TabPane } = Tabs;

/**
 * 编辑表组件
 */
const EditStruct: HY.SubApp = (props) => {
  /**
   * 表编辑详情数据存储在store中,因为多个组件都会用到这里的状态
   */
  const dispatch = useDispatch();
  const { structRowData } = useMappedState((state) => ({
    structRowData: state.structRowData
  }));

  /** 关联页面 */
  const { relationTables = [] } = structRowData;

  // 关联页面配置--选中的tag集合
  const [selectedTags, setSelectedTags] = useState([]);
  /** 选中页面 */
  const handleTagChange = (tag, checked) => {
    /** 更新选中项 */
    setSelectedTags([tag]);
    onNavigate({
      type: "PUSH",
      path: tag.id
    });
  };

  /**
  * 更新表结构行记录详情-主要是更新表字段 关联字段 外键字段这几个数组对象
  * key-表字段 关联字段 外键字段列表数组在行记录详情对象中对应的key
  * data-要更新的数据
  * 为了是函数有扩展性,函数所需要的参数都通过传递,而不是在函数中直接使用全局变量
  */
  const updateListData = (key, data) => {
    /** 表字段提交数据处理逻辑 */
    if (key === 'columns') {
      /** 当表格中的行编辑表单有选项框时, 退出编辑状态时, 表单选项值原本的code,会被赋值成文本, */
      /* 与后端要求的提交格式不一致, 所以要将选项文本值转换成对应的代码 */
      data = data.map((item) => {
        const enumMap = [
          { key: 'fieldType', enumArr: FieldTypeEnum },
          { key: 'dataType', enumArr: DataTypeEnum },
          { key: 'species', enumArr: SpeciesTypeEnum },
          { key: 'pinyinConvent', enumArr: YNTypeEnum },
          { key: 'required', enumArr: YNTypeEnum },
          { key: 'unique', enumArr: YNTypeEnum },
        ];

        enumMap.forEach((enumItem) => {
          const { key, enumArr } = enumItem;
          const obj = enumArr.find((sub) => sub.text === item[key]);
          if (obj) {
            item[key] = obj.value;
          }
        });
        return item;
        //  YNTypeEnum, SpeciesTypeEnum
      });

      // console.log(data);
    }

    dispatch({
      type: 'setStructRowData',
      structRowData: Object.assign({},
        structRowData,
        {
          [key]: data.map((item, index) => {
          /** 序号后端要求必填,页面不需展示 */
            item.sequence = index;
            return item;
          })
        })
    });
  };

  /** 创建可控表单实例--用于编辑表 */
  const [form] = Form.useForm();

  /**
   * 凡是http请求，放在useEffect中时,第一个参数要从一个空数组,代表组件mount生命周期,不这样做,页面会出现死循环
   */
  useEffect(() => {
    /** 请求左侧树要用到的数据,因为是动态数据,所以每次进入页面都要发请求 */
    fetchSelectTreeData();
    // http:// {ip}:{port}/paas/ {lesseeCode}/{applicationCode}/data/v1/tables/00dd1b16e3a84a6fbeed12a661484eba
    // const res = getUrlSearchParams(undefined, undefined, true).id;
    // console.log(res);
    // const id = window.atob(window.location.hash.split("id=")[1].split("&_R")[0])
    // ReqTableDetail(id).then((res) => {
    // console.log(res);

    /** 如果有记录存在,不在请求后端,不然会覆盖掉还未提交到后端的记录 */
    /** 但要过滤掉新增的什么都没填写的无效记录 */
    // if (structRowData.id) {
    //   ['foreignKeys', 'references', 'columns'].forEach((key) => {
    //     structRowData[key] = structRowData[key].filter((item) => item.isUnSubmit && (item.code || item.fieldCode));
    //     updateListData(key, structRowData[key]);
    //   });
    //   // return;
    // }

    /** 获取表结构列表带过来的行记录id */
    const { id } = getUrlSearchParams({ fromBase64: true });
    // console.log({ id });
    /** 发现页面刷新时,从表结构列表通过路由跳转传过来的id会丢失,而redux中的数据,会被存储到localStorage中 */
    /** 如果id丢失,就从localStorage中取缓存的id */
    const rowId = id || structRowData.id;
    /** 查询表结构详情 */
    $R_P.get(`/data/v1/tables/${rowId}`).then((res) => {
      /** 编辑表表单公共信息 */
      const {
        name, code, type, moduleId, columns
      } = res?.result;
      /** 设置表结构编辑表单公共信息 */
      form.setFieldsValue({
        name, code, type, moduleId
      });

      /** 表结构-字典字段 提交到页面显示数据格式转换 */
      res.result.columns = columns.map((item) => {
        if (item.dictionaryForeign) {
          /** 后端返回的字典数据是一个对象 */
          item.dictionaryForeignSubmit = item.dictionaryForeign;
          /** 页面需要展示中文字典名 */
          item.dictionaryForeign = item.dictionaryForeign.refTableName;
        }
        return item;
      });

      /** 设置表结构详情 */
      dispatch({
        type: 'setStructRowData',
        structRowData: res.result
      });
    });
  }, []);
  /**
   * 编辑表右侧的两个表单按钮
   */
  const formButs = [
    {
      text: '保存',
      onClick: () => {
        console.log(JSON.stringify(structRowData));
        /** 编辑表的主表单在点击保存按钮的时候校验,每个tab中国的表单,在tab页中的子表单中校验 */
        form.validateFields().then(() => {
          /** 新增数据,提交时要清空id,让后端填充 */
          ['foreignKeys', 'references', 'columns'].forEach((key) => {
            structRowData[key] = structRowData[key].map((item, index) => {
              if (item.isUnSubmit) {
                delete item.isUnSubmit;
              }
              /** 排序号后端要求必须填写 */
              item.sequence = index + 1;
              return item;
            });
          });

          /** 表字段 页面数据转提交数据 */
          structRowData.columns = structRowData.columns.map((item) => {
            // console.log(item);
            item.fieldProperty = item.fieldProperty || {};
            ['pinyinConvent', 'required', 'unique'].forEach((key) => {
              if (item[key]) {
                item.fieldProperty[key] = item[key];
              }
              item[key] !== undefined && delete item[key];
            });
            /** 字典字段转换 页面展示时是一个字符值,提交时是一个对象 */
            if (item.dictionaryForeignSubmit) {
              item.dictionaryForeign = item.dictionaryForeignSubmit;
              delete item.dictionaryForeignSubmit;
            }

            return item;
          });

          $R_P.put('/data/v1/tables/', structRowData).then((res) => {
            const { code, msg } = res || {};
            if (code === '00000') {
              resetStore();
              Msg.success('操作成功');
              // onNavigate({
              //   type: "PUSH",
              //   params: { title: '表结构管理' },
              //   path: '/TableStruct'
              // });
            } else {
              Msg.error(msg);
            }
          });
        });
      }
    },
    {
      text: '返回',
      onClick: () => {
        resetStore();
        onNavigate({
          type: "GO_BACK",
        });
      }
    },
  ];

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
  /**
   * 表结构-新建表表单配置
   */
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
        onChange: (e) => {
          const name = e?.target?.value;
          dispatch({
            type: 'setStructRowData',
            structRowData: Object.assign({},
              structRowData,
              { name })
          });
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
        treeData: [],
        onSelect: (moduleId, node) => {
          const moduleName = node?.title;
          dispatch({
            type: 'setStructRowData',
            structRowData: Object.assign({},
              structRowData,
              { moduleId, moduleName })
          });
        }
        // ...tProps
      }
    }
  };
  /** 把formItemsConfig定义成state数据,是因为formItemsConfig的moduleId.compAttr.treeData属性要被更新  */
  /** 把formItemsConfig定义成普通对象,更新formItemsConfig的moduleId.compAttr.treeData属性时组件不渲染  */
  const [formItemsConfig, setFormItemsConfig] = useState(formItemsConfigInit);
  /**
  * 获取树选择数据
  */
  const fetchSelectTreeData = async () => {
    const dataModule = await GetMenuTree();
    formItemsConfig.moduleId.compAttr.treeData = dataModule as never[];
    /**
    * 更新表单项--所属模块 TreeSelect组件需要用到的渲染数据
    */
    setFormItemsConfig({ ...formItemsConfig });
  };
  /** 重置store状态,主要是为了清除localStorage中的数据,因为store中的数据用localStorage做了持久化 */
  const resetStore = () => {
    dispatch({
      type: 'setStructRowData',
      structRowData: defaultState.structRowData
    });
    dispatch({
      type: 'setSysFieldCtrl',
      sysFieldCtrl: defaultState.sysFieldCtrl
    });
  };

  /** tabs面板配置 */
  const tabsConf = {
    attr: {
      defaultActiveKey: 'TableField',
      type: "card" as const,
      size: 'small' as const,
      style: { marginTop: '20px' },
      onTabClick: (activeKey) => {
        // console.log(activeKey);
      },
    },
    panes: [
      { tab: '表字段', key: 'TableField', updateListData },
      { tab: '引用表', key: 'ReferenceTable', updateListData },
      /** 引用表和外键设置,共用一个组件,而tab面板的key不能重复, */
      /** 而tab面板内容组件是通过传递key值给仓库组件动态渲染出来的, 这里就产生了冲突,需要用multiplex传递真正要渲染的组件 */
      {
        tab: '外键设置', key: 'ForeignKeySet', multiplex: 'ReferenceTable', updateListData
      },
      { tab: '组合唯一', key: 'ComposeUnique', },
      { tab: '索引设置', key: 'IndexSet', },
      { tab: '触发器', key: 'Trigger', },
      { tab: '表操作日志', key: 'TableLog', },
    ]
  };

  const getMainTableWhenSub = () => {
    const type = structRowData?.type;
    if (type !== 'AUX_TABLE') return null;
    const mainTableName = structRowData?.auxTable?.parentTable?.name;
    if (!mainTableName) return null;
    return (
      <Col span={4}>
        <Form.Item
          label="主表名称："
        >
          <Input disabled={true} defaultValue={mainTableName}/>
        </Form.Item>
      </Col>);
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
        <Row gutter={24}>
          {
            Object.keys(formItemsConfig).map((key) => (
              /**
            *    设置表单项每项占行宽的24之五
            */
              <Col key={key} span={5}>
                <Form.Item key={key} {...formItemsConfig[key].itemAttr} className="w100">
                  <BasicStory {...formItemsConfig[key].compAttr} />
                </Form.Item>
              </Col>
            ))
          }
          { getMainTableWhenSub()}

        </Row>
      </Form>

      {/* 关联页面 部分 */}
      <Row gutter={24}>
        <Col span={20} style={{ display: 'flex' }}>
          {/* 关联页面label宽度 */}
          <div className="ant-form-item-label" style={{ width: '115px' }}>
            <label title="数据表名称">关联页面</label>
          </div>
          {/* 关联页面内容 */}
          <div style={{ border: '1px solid #ccc', width: '100%', padding: '6px 16px', }}>
            {relationTables.map((tag) => (
              <CheckableTag
                key={tag.name}
                checked={selectedTags.indexOf(tag.name as never) > -1}
                onChange={(checked) => handleTagChange(tag, checked)}
              >
                <a>{tag.name}</a>
              </CheckableTag>
            ))}
          </div>
        </Col>

        {/* 设置按钮的宽度占行宽的24之四 */}
        <Col span={4} className="form-buts">
          {formButs.map((item) => (<Button key={item.text} type='primary' className="button" onClick={item.onClick}>{item.text}</Button>))}
        </Col>
      </Row>
      {/* tab面板部分 */}
      <Tabs {...tabsConf.attr}>
        {
          tabsConf.panes.map((item) => (
            <TabPane tab={item.tab} key={item.key}>
              <BasicStory {...item} type={item.multiplex || item.key} />
            </TabPane>
          ))
        }
      </Tabs>
    </div>
  );
};

export default Connector(EditStruct);
