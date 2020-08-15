import React, { useState, useEffect, useCallback } from 'react';
import {
  Table, Popconfirm, Form, Button, Modal
} from 'antd';

import BasicStory from '@provider-app/data-designer/src/components/BasicStory';
import ReferenceForm from '@provider-app/data-designer/src/pages/EditStruct/ReferenceForm';

/** 状态管理方法 */
import { useMappedState, useDispatch } from 'redux-react-hook';

/** 表类型枚举--表格列代码转文字时也要用 */
import {
  DataTypeEnum, FieldTypeEnum, YNTypeEnum, SpeciesTypeEnum
} from '@provider-app/data-designer/src/tools/constant';
/**
 * 选项代码转文字
 */
import { codeToText } from '@provider-app/data-designer/src/tools/format';
/**
* 表单校验规则要用到
*/
import { Rule } from 'rc-field-form/lib/interface';
/**
* 正则表达式
*/
import REG from '@provider-app/data-designer/src/tools/reg';
import { getModalConfig } from '@provider-app/data-designer/src/tools/mix';

/**
 * 表字段后端接口返回值，属性对象与前端页面展示值有差异,需要处理一下
 */
interface Item {
  id ? :string|number;
  key: string|number;
  /** 字段名称 */
  name: string;
  /** 字段编码 */
  code:string;
  /** 字段类型-VARCHAR(字符串)INT(整型)TIME(时间)DATE(日期时间)TEXT(超大文本) */
  fieldType:"VARCHAR"|"INT"|"TIME"|"DATE"|"TEXT";
  /** 数据类型 NORMAL(普通字段)PK(主键字段)QUOTE(引用字段)DICT(字典字段)FK(外键字段) */
  dataType:'NORMAL'|"PK"|"QUOTE"|"DICT"|"FK";
  /** 业务字段类型 */
  species:string;
  /** 小数位 */
  decimalSize:number;
  /** 属性对象 */
  fieldProperty?:{
    /** 必填 */
    required:'true'|'false';
    /** 唯一 */
    unique:'true'|'false';
    /** 转换成拼音 */
    pinyinConvent: 'true'|'false';
    regular?:unknown;
  }
  /** 字典对象 */
  dictionaryForeign?:{
    /** 字典主键 */
    id?:string|number;
    /** 表名 */
    tableName:string;
    /** 字典字段 */
    fieldCode:string;
    /** 字典保存字段表中文名 */
    refTableName:string;
    /** 字典保存字段,写死code值 */
    refFieldCode:string;
    /** 字典显示字段,写死name值 */
    refDisplayFieldCode:string;
  }
  [propName: string]: unknown;
}

/**
 * 编辑表格属性约束
 */
interface EditableCellProps extends React.HTMLAttributes<HTMLElement> {
  editing: boolean;
  dataIndex: string;
  title: string;
  formConfig:{
    attrs:{
      type:'InputNumber' | 'Input' | 'BasicSelect';
      enum?:Array<{value, text}>;
    }
    rules:Rule[];
  }
  record: Item;
  index: number;
  children: React.ReactNode;
}

/**
*  编辑表格设置,这里是重点
*/
const EditableCell: React.FC<EditableCellProps> = ({
  editing,
  dataIndex,
  title,
  formConfig,
  record,
  index,
  children,
  ...restProps
}) => {
  return (
    <td {...restProps}>
      {editing ? (
        <Form.Item
          name={dataIndex}
          rules={formConfig.rules}
        >
          <BasicStory {...formConfig.attrs} />
        </Form.Item>
      ) : (
        <Form.Item>
          {children }
        </Form.Item>
      )}
    </td>
  );
};

/**
 * 表字段组件
*/
const TableField = (props) => {
  const {
    tableData, scroll, style, title
  } = props;

  const mapState = useCallback(
    (state) => ({
      treeData: state.treeData
    }),
    []
  );
    /**
   * 共享状态值--表结构分页和树形源数据
   * */
  const { treeData } = useMappedState(mapState);

  /** 创建+引用字段弹窗表单实例 */
  const [refForm] = Form.useForm();

  /** 创建可控表单实例 */
  const [form] = Form.useForm();
  /**
  * 行编辑态设置
  */
  const [editingKey, setEditingKey] = useState<number|string>('');

  /**
  * 编辑行号与记录行号相符时，设置编辑状态
  */
  const isEditing = (record: Item) => record.key === editingKey;

  /**
  * 将后端返回的列表值转换成页面的显示值
  */
  const dataSource = tableData.map((row) => {
    if (row.fieldProperty) {
      row.unique = codeToText({ arr: YNTypeEnum, val: row.fieldProperty.unique }) || '';
      row.required = codeToText({ arr: YNTypeEnum, val: row.fieldProperty.required }) || '';
      row.pinyinConvent = codeToText({ arr: YNTypeEnum, val: row.fieldProperty.pinyinConvent }) || '';
    } else {
      row.unique = '';
      row.required = '';
      row.pinyinConvent = '';
    }
    /**
    * 数据类型代码值转文本
    */
    row.dataType = codeToText({ arr: DataTypeEnum, val: row.dataType });
    /**
    * 字段类型代码值转文本
    */
    row.fieldType = codeToText({ arr: FieldTypeEnum, val: row.fieldType });
    /**
    * 分类代码值转文本
    */
    row.species = codeToText({ arr: SpeciesTypeEnum, val: row.species });
    row.key = row.code;
    return row;
  });

  // console.log(dataSource);
  const [data, setData] = useState(dataSource);

  useEffect(() => {
    // setData(dataSource);
  }, []);

  /**
  * 编辑函数初始值设置
  */
  const edit = (record: Item) => {
    form.setFieldsValue({
      ...record
    });
    setEditingKey(record.key);
  };

  const cancel = () => {
    setEditingKey('');
  };

  const save = async (key: React.Key) => {
    try {
      const row = (await form.validateFields()) as Item;

      const newData = [...data];
      const index = newData.findIndex((item) => key === item.key);
      if (index > -1) {
        const item = newData[index];
        newData.splice(index, 1, {
          ...item,
          ...row,
        });
        setData(newData);
        setEditingKey('');
      } else {
        newData.push(row);
        setData(newData);
        setEditingKey('');
      }
    } catch (errInfo) {
      console.log('Validate Failed:', errInfo);
    }
  };

  const columns = [
    {
      title: '序号',
      dataIndex: 'rowIndex',
      width: 80,
      /** 自定义渲染函数 */
      render: (text, record, index) => {
        // console.log({ text, record, index });
        /** 与后端协商,行号由前端计算 */
        return <span>{index + 1}</span>;
      },
    },
    {
      title: '字段名称',
      dataIndex: 'name',
      editable: true,
      formConfig: {
        attrs: { type: 'Input' },
        rules: [{
          required: true,
          message: '请输入字段名称'
        }]
      },
      width: 200,
    },
    {
      title: '字段编码',
      dataIndex: 'code',
      formConfig: {
        attrs: { type: 'Input' },
        rules: [{
          required: true,
          message: '请输入字段编码'
        }]
      },
      editable: true,
      width: 200,
    },
    {
      title: '字段类型',
      dataIndex: 'fieldType',
      formConfig: {
        attrs: { type: 'BasicSelect', enum: FieldTypeEnum, },
        rules: [{
          required: true,
          message: '请选择字段类型'
        }]
      },
      editable: true,
      width: 160,
    },
    {
      title: '数据类型',
      dataIndex: 'dataType',
      formConfig: {
        attrs: { type: 'BasicSelect', enum: DataTypeEnum, },
        rules: [{
          required: true,
          message: '请选择数据类型'
        }]
      },
      editable: true,
      width: 160,
    },
    {
      title: '长度',
      dataIndex: 'fieldSize',
      formConfig: {
        attrs: { type: 'InputNumber', placeholder: '正整数,2-64' },
        rules: [
        /** 自定义校验器 */
          ({ getFieldValue }) => ({
            validator(rule, value) {
              if (value === '' || value === undefined) {
                return Promise.reject(new Error('请输入字符长度'));
              }
              if (!REG['正整数'].test(value)) {
                return Promise.reject(new Error('必须是正整数'));
              }

              if (value < 2 || value > 64) {
                return Promise.reject(new Error('必须在2-64之间'));
              }
              return Promise.resolve();
            },
          }),
        ]
      },
      editable: true,
      width: 200,
    },
    {
      title: '小数点',
      dataIndex: 'decimalSize',
      formConfig: {
        attrs: { type: 'InputNumber' },
        rules: [{
          required: true,
          message: '请输入小数点位数'
        }]
      },
      editable: true,
      width: 160
    },
    {
      title: '必填',
      dataIndex: 'required',
      formConfig: {
        attrs: { type: 'BasicSelect', enum: YNTypeEnum, },
        rules: [{
          required: true,
          message: '请选择'
        }]
      },
      editable: true,
      width: 100
    },
    {
      title: '唯一',
      dataIndex: 'unique',
      formConfig: {
        attrs: { type: 'BasicSelect', enum: YNTypeEnum, },
        rules: [{
          required: true,
          message: '请选择'
        }]
      },
      editable: true,
      width: 100,
    },
    {
      title: '字典',
      dataIndex: 'dictionaryForeign',
      formConfig: {
        attrs: {
          type: 'Input',
          onFocus: () => {
            setTableFieldVisible(true);
          }
        },
        rules: [{
          required: true,
          message: '请选择字典'
        }]
      },
      editable: true,
      width: 200,
    },
    {
      title: '转换成拼音',
      dataIndex: 'pinyinConvent',
      formConfig: {
        attrs: { type: 'BasicSelect', enum: YNTypeEnum, },
        rules: [{
          required: true,
          message: '请选择'
        }]
      },
      editable: true,
      width: 160,
    },
    // {
    //   title: '校验规则',
    //   dataIndex: 'modifiedBy',
    //   width: 140,
    // },
    {
      title: '分类',
      dataIndex: 'species',
      width: 120
    },
    {
      title: '操作',
      dataIndex: 'operation',
      fixed: 'right',
      width: 180,
      render: (_: any, record: Item) => {
        const editable = isEditing(record);
        return editable ? (
          <span>
            <Button type='link' onClick={() => save(record.key)} style={{ marginRight: 8 }}>
              保存
            </Button>
            <Button type='link' onClick={cancel}>取消</Button>
          </span>
        ) : (
          <span>

            <Button type='link' disabled={editingKey !== ''} style={{ marginRight: 8 }} onClick={() => edit(record)}>
            编辑
            </Button>
            <Popconfirm title="你确定要删除吗?" okText="确定" cancelText="取消" onConfirm={() => handleDelete(record.key)}>
              <Button type='link'>删除</Button>
            </Popconfirm>
          </span>
        );
      },
    },
  ];
  const mergedColumns = columns.map((col) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      /**
      * 传入单元格里面的参数
      */
      onCell: (record: Item) => ({
        record,
        formConfig: col.formConfig,
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
      }),
    };
  });

  const handleAdd = () => {
    const newData = {
      id: '',
      key: '',
      /** 字段名称 */
      name: '',
      /** 字段编码 */
      code: '',
      /** 字段类型-VARCHAR(字符串)INT(整型)TIME(时间)DATE(日期时间)TEXT(超大文本) */
      fieldType: "VARCHAR",
      /** 数据类型 NORMAL(普通字段)PK(主键字段)QUOTE(引用字段)DICT(字典字段)FK(外键字段) */
      dataType: 'NORMAL',
      /** 业务字段类型 SYS(系统元数据)BIS(业务元数据) */
      species: "BIS",
      /** 小数位 */
      decimalSize: 0,
      /** 必填 */
      required: 'false',
      /** 唯一 */
      unique: 'false',
      /** 转换成拼音 */
      pinyinConvent: 'true',
    };
    data.unshift(newData);
    /**
    * 为什么直接赋值setData(data)不更新,非要写成setData([...data])才触发更新
    */
    setData([...data]);
    edit(newData);
    console.log(data);
  };
  const handleDelete = (key) => {
    setData(data.filter((item) => item.key !== key));
  };

  // const TableHeadMenus = [
  //   { text: "新增", onClick: () => { handleAdd(); } },
  // ];

  const TableHeadMenus = [
    { text: "+字段", onClick: () => { handleAdd(); } },
    { text: "+字典字段", onClick: () => {} },
    {
      text: "+引用字段",
      onClick: () => {
        setRefModalVisible(true);
      }
    },
    { text: "+外键字段", onClick: () => {} },
    { text: "删除", onClick: () => {} },
    { text: "保存", onClick: () => {} },
    { text: "隐藏系统字段", onClick: () => {} },
  ];
  /**
   * 引用字段--关联字段，显示字段下拉选项值
   */
  const RefFieldEnum = tableData.map((item) => {
    return {
      text: item.name,
      value: item.code,
    };
  });

  // console.log({ tableData, data });
  const [tableFieldVisible, setTableFieldVisible] = useState(false);
  const modalProps = {
    visible: tableFieldVisible,
    title: '选择字典',
    /**
   * 弹框确定按钮回调
   * @param e  点击按钮事件源
   * @param { form-新建表可控表单实例 }
   */
    onOk: (e) => {
      // form
      //   .validateFields() /** 表单校验 */
      //   .then((values) => {
      //     /**
      //      * 与后端协商,只提交页面上有的字段,没有的不传
      //      */
      //     console.log(values);
      //     /** 新建表数据提交 */
      //     Http.post('http://{ip}:{port}/paas/{lesseeCode}/{applicationCode}/data/v1/tables/', {
      //       data: values
      //     }).then(() => {
      //       /** 关闭弹窗 */
      //       setVisiable(false);
      //     });
      //   })
      //   .catch((errorInfo) => {
      //     /** 校验未通过 */
      //     console.log(errorInfo);
      //   });
      // // }
      setTableFieldVisible(false);
    },
    /** 弹框取消按钮回调 */
    onCancel: (e) => {
      setTableFieldVisible(false);
    },
    okText: '确定',
    cancelText: '取消',
    width: 800,
  };

  /**
  * 选择关联表弹窗显隐控制
  */
  const [selectTableVisible, setSelectTableVisible] = useState(false);
  /**
  * 选择关联表弹窗属性配置
  */
  const selectTableModalProps = getModalConfig({
    visible: selectTableVisible,
    title: '选择关联表',
    /**
   * 弹框确定按钮回调
   * @param e  点击按钮事件源
   * @param { form-新建表可控表单实例 }
   */
    onOk: (e) => {
      console.log('ok');
      setSelectTableVisible(false);
    },
    /** 弹框取消按钮回调 */
    onCancel: (e) => {
      console.log('cancel');
      setSelectTableVisible(false);
    },
  });

  /**
  * 关联表弹窗表单-显示隐藏状态变量和模态框属性配置
  */
  const [refModalVisible, setRefModalVisible] = useState(false);
  const refModalProps = {
    visible: refModalVisible,
    title: '关联表信息',
    /**
   * 弹框确定按钮回调
   * @param e  点击按钮事件源
   * @param { form-新建表可控表单实例 }
   */
    onOk: (e) => {
      // form
      //   .validateFields() /** 表单校验 */
      //   .then((values) => {
      //     /**
      //      * 与后端协商,只提交页面上有的字段,没有的不传
      //      */
      //     console.log(values);
      //     /** 新建表数据提交 */
      //     Http.post('http://{ip}:{port}/paas/{lesseeCode}/{applicationCode}/data/v1/tables/', {
      //       data: values
      //     }).then(() => {
      //       /** 关闭弹窗 */
      //       setVisiable(false);
      //     });
      //   })
      //   .catch((errorInfo) => {
      //     /** 校验未通过 */
      //     console.log(errorInfo);
      //   });
      // // }
      setRefModalVisible(false);
    },
    /** 弹框取消按钮回调 */
    onCancel: (e) => {
      setRefModalVisible(false);
    },
    okText: '确定',
    cancelText: '取消',
    width: 800,
  };

  /**
  * 选择关联表弹窗--左侧菜单树点击的节点值
  */
  const [selectMenuTreeNode, setSelectMenuTreeNode] = useState({});
  /**
  * 选择关联表弹窗--关联表搜索框值
  */
  const [selectTableSearchValue, setSelectTableSearchValue] = useState('');
  /** 树形属性配置 */
  /**
  * 写到这里遇到一个问题,是把公共数据放在store中好,还是通过传回调的方式好
  */
  const treeProps = {
    dataSource: treeData,
    value: '',
    placeholder: '请选择父级',
    style: {
      width: '100%'
    },
    getClickNodeValue: (node) => {
      console.log({ '选择关联表弹窗--左侧菜单树点击的节点值': node });
      setSelectMenuTreeNode(node);
    }
  };

  /** 搜索条件-表名称 */
  const searchProps = {
    value: selectTableSearchValue,
    style: { margin: '16px 0' },
    placeholder: '请输入表名称',
    onSearch: (value) => {
      console.log(value, selectMenuTreeNode);
      // queryList(value);
    },
    enterButton: true,
  };

  /**
   * 列表配置
   */
  const tableProps = {
    columns: [{
      title: '字段名称',
      dataIndex: 'name',
      key: 'name'
    }],
    dataSource: tableData,
    scroll: { y: 300, },
    onRow: (record) => {
      return {
        onClick: (event) => {
          setSelectTableSearchValue('heha');
          console.log(record);
        },
        onDoubleClick: (event) => {},
        onContextMenu: (event) => {},
        onMouseEnter: (event) => {}, // 鼠标移入行
        onMouseLeave: (event) => {},
      };
    }

  };

  // id	long	主键
  // fieldName	String	字段名称
  // fieldCode	String	字段编码
  // refTableCode	String	关联表
  // refFieldCode	String	关联字段
  // refDisplayFieldCode	String	显示字段
  // sequence	int	排序号
  // deleteStrategy	String	外键约束（删除时）,RESTRICT(存在关联不允许操作)CASCADE(级联)SET_NULL(置空)NO_ACTION(不处理)
  // updateStrategy	String	外键约束（更新时）,RESTRICT(存在关联不允许操作)CASCADE(级联)SET_NULL(置空)NO_ACTION(不处理)

  /** 表单配置项 */
  const formItemsConfig = {
    refTableCode: {
      /** 表单项属性 */
      itemAttr: {
        label: "关联表",
        name: "refTableCode",
        rules: [
          { required: true, message: '请选择关联表!' },
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
        placeholder: '请选择关联表',
        onFocus: (e) => {
          setSelectTableVisible(true);
          /** 将表格名称转换为汉字首字母拼音 */
          // form.setFieldsValue({ code: PinYin.getCamelChars(form.getFieldValue('name')) });
        }
      }
    },
    /**
    * 关联字段--数据来自表结构详情中的表字段
    */
    refFieldCode: {
      itemAttr: {
        label: "关联字段",
        name: "refFieldCode",
        rules: [{ required: true, message: '请选择关联字段!' }],
      },
      compAttr: {
        type: 'BasicSelect',
        enum: RefFieldEnum,
      }
    },
    /**
    * 显示字段
    */
    refDisplayFieldCode: {
      itemAttr: {
        name: "refDisplayFieldCode",
        label: "显示字段"
      },
      compAttr: {
        type: 'BasicSelect',
        enum: RefFieldEnum,
        // onChange: onTypeChange
      }
    },
  };
  const formProps = {
    form: refForm,
    formItemsConfig,
  };

  return (
    <div>
      <section className="table-head-menu">
        <div className="ant-table-title">表字段列表</div>
        <div >
          {TableHeadMenus.map((item) => (<Button key={item.text} type="primary" className="button" onClick={item.onClick}>{item.text}</Button>))}
        </div>
      </section>
      <Form form={form} component={false}>

        <Table
          components={{
            body: {
              cell: EditableCell,
            },
          }}

          bordered
          dataSource={data}
          columns={mergedColumns}
          rowClassName="editable-row"
          pagination={{
            onChange: cancel,
          }}
        />
      </Form>
      <Modal {...modalProps}>
        {/* 新建表表单 */}
        {/* <StructForm {...formProps} /> */}
      </Modal>
      {/* +引用字段弹窗表单 */}
      <Modal {...refModalProps}>
        <ReferenceForm formProps={formProps} modalProps={ selectTableModalProps} RefFieldEnum={RefFieldEnum} treeProps={treeProps} tableProps={tableProps} searchProps={searchProps} />
      </Modal>
    </div>
  );
};

export default TableField;
