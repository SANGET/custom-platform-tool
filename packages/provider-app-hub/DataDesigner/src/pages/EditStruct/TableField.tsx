import React, { useState, useEffect, useCallback } from 'react';
import {
  Popconfirm, Form, Button, Modal
} from 'antd';
import { PinYin } from '@provider-app/data-designer/src/tools/mix';

/**
*  可编辑单元格组件
*/
import BasicEditTable from '@provider-app/data-designer/src/components/BasicEditTable';
/**
* 表头菜单组件
*/
import TableHeadMenu from '@provider-app/data-designer/src/bizComps/TableHeadMenu';
/**
* 关联表单组件
*/
import ReferenceForm from '@provider-app/data-designer/src/pages/EditStruct/ReferenceForm';

/**
* 字典管理组件
*/
import DictManage from '@provider-app/data-designer/src/pages/DictManage';

/** 状态管理方法 */
import { useMappedState, useDispatch } from 'redux-react-hook';

// import { Connector } from '@provider-app/data-designer/src/connector';
/** 表类型枚举--表格列代码转文字时 要用 */
import {
  DataTypeEnum, FieldTypeEnum, YNTypeEnum, SpeciesTypeEnum
} from '@provider-app/data-designer/src/tools/constant';
/**
 * 选项框代码转文字
 */
import { codeToText } from '@provider-app/data-designer/src/tools/format';

/**
* 正则表达式
*/
import REG from '@provider-app/data-designer/src/tools/reg';

import Http, { Msg } from '@infra/utils/http';
import { getModalConfig, randomNum } from '../../tools/mix';

/**
 * 表字段组件
*/
const TableField = ({ tableData }) => {
  /**
  * 树形数据在多个地方要使用,因此保存在store中
  */
  const dispatch = useDispatch();
  const { structRowData, treeData } = useMappedState((state) => ({
    structRowData: state.structRowData,
    treeData: state.treeData
  }));

  /**
  * 设置+引用字段，+外键字段弹窗标题
  */
  const [modalTitle, setModalTitle] = useState('表字段');
  const PageKey = {
    外键关联表信息: 'foreignKeys',
    关联表信息: 'references',
    表字段: 'columns'
  }[modalTitle];

  /**
  * 表字段列表的值是通过父组件 EditStruct传进来的
  */
  // console.log({ tableData });

  /**
  * 将后端返回的列表值转换成页面的显示值
  */

  const toShow = (data) => {
    return data.map((row) => {
    /**
    * 唯一,必填,转换成拼音 这几项后端返回的值是一个对象,页面展示需要进行拆解
    */
      /** 有可能没有值 */
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
    * 数据类型代码转文本
    */
      row.dataType = codeToText({ arr: DataTypeEnum, val: row.dataType });
      /**
    * 字段类型代码转文本
    */
      row.fieldType = codeToText({ arr: FieldTypeEnum, val: row.fieldType });
      /**
    * 分类代码转文本
    */
      row.species = codeToText({ arr: SpeciesTypeEnum, val: row.species });
      row.key = row.code;
      return row;
    });
  };

  /**
  * 因为会动态增删父组件传进来的表格数据,所以需要用状态值保存
  * 只会初始化一次,发现dataSource有值之后,不会再被执行
  */
  // const [fieldTableData, setFieldTableData] = useState([]);

  const [fullCols, setFullCols] = useState([]);
  useEffect(() => {
    setFullCols(toShow(structRowData.columns));
    // const data = toShow(structRowData.columns);
    // console.log({ data });
    // structRowData.columns = data.filter((item) => item.species !== '系统');
    // updateTableData();
  }, []);

  /** 创建+字典字段弹窗表单实例 */
  // const [dictForm] = Form.useForm();

  /** 创建+表字段行内表单实例 */
  const [fieldForm] = Form.useForm();
  /**
  * 每一行都有一个唯一的key,记录编辑行是哪一行
  */
  const [editingKey, setEditingKey] = useState<number|string>('');
  /**
  * 编辑行号与记录行号相符时，设置成编辑状态
  */
  const isEditing = (record) => record.key === editingKey;

  // console.log(dataSource);
  /**
  * 编辑函数初始值设置
  */
  const edit = (record) => {
    /**
     * 将行记录的值设置到表单-这里前端显示值和后端返回值可能并不完全一样，需要转换
     */
    fieldForm.setFieldsValue({
      ...record
    });
    /**
    * 设置编辑行--编辑行的按钮是保存和取消
    */
    setEditingKey(record.key);
  };

  /**
   * 保存编辑行的值
   * key-编辑行的key
   */
  const save = async (key: React.Key) => {
    try {
      /**
        * 先进行表单校验,校验通过可以拿到该行的表单值
        */
      const row = (await fieldForm.validateFields());
      /**
       * 复制一份表格数据
       */
      const newData = [...structRowData[PageKey]];
      /** 找到编辑行的索引号 */
      const index = newData.findIndex((item) => key === item.key);
      /** 如果找到,把新值合并到旧值对象上,替换掉原有的那一行记录 */
      if (index > -1) {
        const item = newData[index];
        newData.splice(index, 1, {
          ...item,
          ...row,
        });
      } else {
        /** 没有找到该记录,插入一条新记录,显示在第一行 */
        newData.unshift(row);
      }
      /** 更新表格数据 */
      structRowData[PageKey] = [...newData];
      updateTableData();

      /** 清除编辑行的key */
      setEditingKey('');
    } catch (errInfo) {
      console.log('Validate Failed:', errInfo);
    }
  };
    /**
  * 取消编辑
  */
  const cancel = () => {
    setEditingKey('');
  };
    /**
  * 添加一行记录
  */
  const handleAdd = (args = { id: '', name: '', code: '' }) => {
    const { id, name, code } = args;
    const newData = {
      key: `${new Date().getTime()}`,
      id: id || '',
      /** 字段名称 */
      name: name || '',
      /** 字段编码 */
      code: code || '',
      /** 字段类型-VARCHAR(字符串)INT(整型)TIME(时间)DATE(日期时间)TEXT(超大文本) */
      fieldType: "VARCHAR",
      /** 数据类型 NORMAL(普通字段)PK(主键字段)QUOTE(引用字段)DICT(字典字段)FK(外键字段) */
      dataType: 'FK',
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

    // console.log(PageKey, structRowData);
    structRowData[PageKey].unshift(newData);
    updateTableData();

    edit(newData);
  };
  /**
   * 删除一行记录
   */
  const handleDelete = (row) => {
    /** 用key,过滤掉这一行数据 */
    /** 要用store缓存起来,刷新页面时，可以恢复数据 */
    /** 页面销毁时,要清楚所有的localStorage中的内容 */
    const { id: key, code } = row;
    if (key) {
      Http.delete(`/smart_building/data/v1/tables/column/allowedDeleted/${key}`).then((res) => {
      /**
        * true 存在与页面控件相互绑定,false没有与页面控件相互绑定
        */
        if (res.data.result) {
          Msg.error('该字段与页面控件相绑定，不能删除');
        } else {
          structRowData[PageKey] = structRowData[PageKey].filter((item) => item.key !== key);
          updateTableData();
        }
      });
    } else {
      structRowData[PageKey] = structRowData[PageKey].filter((item) => item.code !== code);
      updateTableData();
    }
  };
  /**
  * 字段类型与数据类型
  * 数据类型与长度 小数位 必填 唯一 字典 是否转拼音 编码规则联动关系
  */
  const linkageObj = {
    VARCHAR: {
      DataTypeEnum: [
        { value: "PK", text: "主键字段" },
        { value: "QUOTE", text: "引用字段" },
        { value: "DICT", text: "字典字段" },
        { value: "FK", text: "外键字段" },
        { value: "pic", text: "图片" },
        { value: "attach", text: "附件" },
        { value: "video", text: "视频" },
        { value: "audio", text: "音频" },
      ],
      Empty: {
        isDisabledFieldSize: true,
        isDisabledDeciSize: false,
        isDisabledRequired: true,
        isDisabledUni: true,
        isDisabledDict: false,
        isDisabledPY: true,
        isDisabledRule: true
      },
      PK: {
        isDisabledFieldSize: true,
        isDisabledRequired: true,
        isDisabledUni: true,
        isDisabledPY: true,
      },
      FK: {
        isDisabledFieldSize: true,
        isDisabledRequired: true,
      },
      QUOTE: {
        isDisabledFieldSize: true,
        isDisabledRequired: true,
      },
      DICT: {
        isDisabledFieldSize: true,
        isDisabledRequired: true,
        isDisabledDict: true,
      },
      pic: {
        isDisabledRequired: true,
      },
      attach: {
        isDisabledRequired: true,
      },
      video: {
        isDisabledRequired: true,
      },
      audio: {
        isDisabledRequired: true,
      },
    },
    INT: {
      DataTypeEnum: [
        { value: "PK", text: "主键字段" },
        { value: "QUOTE", text: "引用字段" },
        { value: "FK", text: "外键字段" },
      ],
      Empty: {
        isDisabledFieldSize: true,
        isDisabledDeciSize: true,
        isDisabledRequired: true,
        isDisabledUni: true,
        isDisabledRule: true
      },
      PK: {
        isDisabledFieldSize: true,
        isDisabledDeciSize: true,
        isDisabledRequired: true,
        isDisabledUni: true,
      },
      FK: {
        isDisabledFieldSize: true,
        isDisabledDeciSize: true,
        isDisabledRequired: true,
      },
      QUOTE: {
        isDisabledFieldSize: true,
        isDisabledDeciSize: true,
        isDisabledRequired: true,
      },
    },
    TIME: {
      DataTypeEnum: [
        { value: "PK", text: "主键字段" },
        { value: "QUOTE", text: "引用字段" },
        { value: "FK", text: "外键字段" },
      ],
      Empty: {
        isDisabledRequired: true,
        isDisabledUni: true,
        isDisabledRule: true
      },
      PK: {
        isDisabledRequired: true,
        isDisabledUni: true,
      },
      FK: {
        isDisabledRequired: true,
      },
      QUOTE: {
        isDisabledRequired: true,
      },
    },
    DATE: {
      DataTypeEnum: [
        { value: "PK", text: "主键字段" },
        { value: "QUOTE", text: "引用字段" },
        { value: "FK", text: "外键字段" },
      ],
      Empty: {
        isDisabledFieldSize: true,
        isDisabledRequired: true,
        isDisabledUni: true,
        isDisabledRule: true
      },
      PK: {
        isDisabledFieldSize: true,
        isDisabledRequired: true,
        isDisabledUni: true,
      },
      FK: {
        isDisabledFieldSize: true,
        isDisabledRequired: true,
      },
      QUOTE: {
        isDisabledRequired: true,
      },
    },
    TEXT: {
      DataTypeEnum: [],
      Empty: {
        isDisabledFieldSize: true,
        isDisabledRequired: true,
        isDisabledUni: true,
      },
    },
  };

  /** fieldType 必须配置初始值 */
  const [link, setLink] = useState({ dataType: 'PK', fieldType: 'VARCHAR' });
  // console.log(linkageObj[link.fieldType].DataTypeEnum);

  /**
   * 是否禁用长度 小数位 必填 唯一 字典 是否转拼音 编码规则属性
   * @param fieldType-字段类型
   * @param dataType-数据类型
   * @param key-禁用设置字段
   */
  const isDisabled = ({ dataType, fieldType, key }) => {
    /**
     * 数据类型,字段类型为空时,允许配置长度 小数位 必填 唯一 字典 是否转拼音 编码规则属性
     * 字段类型和数据类型是必填项,没选这两项之前的选择都是无效选择
     */
    if (!dataType || !fieldType) {
      return false;
    }

    return !linkageObj[fieldType][dataType][key] || false;
  };

  /**
  * 表字段列属性配置
  */
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
        attrs: {
          type: 'Input',
          onChange: () => {
            /** 将表格名称转换为汉字首字母拼音 */
            fieldForm.setFieldsValue({ code: PinYin.getCamelChars(fieldForm.getFieldValue('name')) });
          }
        },
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
        attrs: {
          type: 'BasicSelect',
          enum: FieldTypeEnum,
          onChange: (fieldType) => {
            // console.log(fieldType);
            setLink({ ...link, fieldType });
            fieldForm.setFieldsValue({ dataType: '' });
            // console.log({ ...link, fieldType }, linkageObj[link.fieldType]);
          }
        },
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
        attrs: {
          type: 'BasicSelect',
          enum: linkageObj[link.fieldType].DataTypeEnum,
          onChange: (dataType) => {
            setLink({ ...link, dataType });
          }
        },
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
        attrs: {
          type: 'InputNumber',
          placeholder: '正整数,2-64',
          disabled: isDisabled({ fieldType: link.fieldType, dataType: link.dataType, key: 'isDisabledFieldSize' })
        },
        rules: [
        /** 自定义校验器 */
          ({ getFieldValue }) => ({
            validator(rule, value) {
              if (value === '' || value === undefined) {
                return Promise.resolve();
              }
              if (!REG.plusInt.test(value)) {
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
        attrs: {
          type: 'InputNumber',
          disabled: isDisabled({ fieldType: link.fieldType, dataType: link.dataType, key: 'isDisabledDeciSize' })
        },
        // rules: [{
        //   required: true,
        //   message: '请输入小数点位数'
        // }]
      },
      editable: true,
      width: 160
    },
    {
      title: '必填',
      dataIndex: 'required',
      formConfig: {
        attrs: {
          type: 'BasicSelect',
          enum: YNTypeEnum,
          disabled: isDisabled({ fieldType: link.fieldType, dataType: link.dataType, key: 'isDisabledRequired' })
        },
        // rules: [{
        //   required: true,
        //   message: '请选择'
        // }]
      },
      editable: true,
      width: 100
    },
    {
      title: '唯一',
      dataIndex: 'unique',
      formConfig: {
        attrs: {
          type: 'BasicSelect',
          enum: YNTypeEnum,
          disabled: isDisabled({ fieldType: link.fieldType, dataType: link.dataType, key: 'isDisabledUni' })
        },
        // rules: [{
        //   required: true,
        //   message: '请选择'
        // }]
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
          disabled: isDisabled({ fieldType: link.fieldType, dataType: link.dataType, key: 'isDisabledDict' }),
          onFocus: () => {
            // console.log('xx');
            setDictFieldVisible(true);
          }
        },
        // rules: [{
        //   required: true,
        //   message: '请选择字典'
        // }]
      },
      editable: true,
      width: 200,
    },
    {
      title: '转换成拼音',
      dataIndex: 'pinyinConvent',
      formConfig: {
        attrs: {
          type: 'BasicSelect',
          enum: YNTypeEnum,
          disabled: isDisabled({ fieldType: link.fieldType, dataType: link.dataType, key: 'isDisabledPY' }),
        },
        // rules: [{
        //   required: true,
        //   message: '请选择'
        // }]
      },
      editable: true,
      width: 160,
    },
    // {
    //   title: '校验规则',
    //   dataIndex: '',
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
      render: (text, record, index) => {
        /**
        * 如果该行的key与记录的编辑行的key相等,则展示保存和取消按钮
        */
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
            {/* 正在编辑的话,禁用其它行的编辑按钮 */}
            <Button type='link' disabled={editingKey !== ''} style={{ marginRight: 8 }} onClick={() => edit(record)}>
            编辑
            </Button>
            <Popconfirm title="你确定要删除吗?" okText="确定" cancelText="取消" onConfirm={() => handleDelete(record)}>
              <Button type='link'>删除</Button>
            </Popconfirm>
          </span>
        );
      },
    },
  ];
  /**
  * 给表字段的编辑列添加编辑属性设置
  */
  const mergedColumns = columns.map((col) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      /**
      * 传入单元格里面的参数,每次页面状态更新,都会执行onCell方法
      * 某一行的key与设置编辑行的key相等时,该行每列元素就会变成可编辑态
      */
      onCell: (record) => ({
        record,
        formConfig: col.formConfig,
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
      }),
    };
  });

  const [clickRow, setClickRow] = useState({});

  console.log(structRowData.columns);

  /**
  * 编辑表格属性配置
  */
  const editTableProps = {
    form: fieldForm,
    dataSource: toShow(structRowData.columns),
    columns: mergedColumns,
    rowKey: (record) => record.code,
    rowClassName: (record) => (clickRow.code === record.code ? 'select-row editable-row' : 'editable-row'),
    onClick: (row) => {
      setClickRow(row);
    },
    pagination: {
      onChange: cancel,
    }
  };

  /**
  * 显示隐藏系统字段标题
  */
  const [sysBtnTitle, setSysBtnTitle] = useState('显示');

  /**
  * 字段列表属性配置
  */
  const tableHeadMenuProps = {
    title: '字段列表',
    menus: [
      {
        text: "+字段",
        onClick: () => {
          setModalTitle('表字段');
          handleAdd();
        }
      },
      {
        text: "+字典字段",
        onClick: () => {
          setDictFieldVisible(true);
        }
      },
      {
        text: "+引用字段",
        onClick: () => {
          setModalTitle('关联表信息');
          setRefModalVisible(true);
        }
      },
      {
        text: "+外键字段",
        onClick: () => {
          setModalTitle('外键关联表信息');
          setRefModalVisible(true);
        }
      },
      {
        text: "复制",
        onClick: () => {
          if (!clickRow.code) {
            return Msg.warning('请先选择一行');
          }
          const { name, id } = clickRow;
          const copyName = `${name}_副本_${randomNum(10000, 99999)}`;

          /** 有参数 */
          handleAdd({ id, name: copyName, code: PinYin.getCamelChars(copyName) });
        }
      },
      // { text: "删除", onClick: () => {} },
      {
        text: `${sysBtnTitle}系统字段`,
        onClick: () => {
          /**
          * 因为setXXX之后不能立刻拿到最新值,所以需要借助变量,获取最新值
          */
          const title = sysBtnTitle === "显示" ? '隐藏' : "显示";
          setSysBtnTitle(title);
          // if (title === '')
          // // console.log({ title, dataSource });
          // {
          // structRowData.columns = fullCols.filter((item) => {
          //   /**
          //   * 当按钮为显示时,过滤掉系统类型字段,否则显示系统字段
          //   */
          //   return title === '显示' ? item.species === '业务' : true;
          // });
          // }
          updateTableData(() => {

          });
        }
      },
    ]
  };

  // console.log({ tableData, fieldTableData });
  const [dictFieldVisible, setDictFieldVisible] = useState(false);
  /**
  * +字典字段弹窗属性
  */
  const DictManageProps = getModalConfig({
    visible: dictFieldVisible,
    title: '选择字典',
    /**
   * 弹框确定按钮回调
   * @param e  点击按钮事件源
   * @param { fieldForm-新建表可控表单实例 }
   */
    onOk: (e) => {
      // dictForm
      //   .validateFields() /** 表单校验 */
      //   .then((values) => {
      //     /**
      //      * 与后端协商,只提交页面上有的字段,没有的不传
      //      */
      //     // console.log(values);
      //     // /** 新建表数据提交 */
      //     // Http.post('http://{ip}:{port}/paas/{lesseeCode}/{applicationCode}/smart_building/data/v1/tables/', {
      //     //   data: values
      //     // }).then(() => {
      //     //   /** 关闭弹窗 */
      //     //   setDictFieldVisible(false);
      //     // });
      //   })
      //   .catch((errorInfo) => {
      //     /** 校验未通过 */
      //     console.log(errorInfo);
      //   });
      // }
    },
    /** 弹框取消按钮回调 */
    onCancel: (e) => {
      setDictFieldVisible(false);
    },
    onChange: (key) => {
      console.log({ 单击选中的key: key });
    }
  });

  /**
  * +引用字段弹窗表单-显示隐藏状态变量和模态框属性配置
  */
  const [refModalVisible, setRefModalVisible] = useState(false);

  /**
   * 创建+引用字段弹窗表单实例
   */
  const [refForm] = Form.useForm();
  const refModalProps = getModalConfig({
    visible: refModalVisible,
    title: modalTitle,
    /**
   * 弹框确定按钮回调
   * @param e  点击按钮事件源
   * @param { fieldForm-新建表可控表单实例 }
   */
    onOk: (e) => {
      refForm
        .validateFields() /** 表单校验 */
        .then((values) => {
          setRefModalVisible(false);
          // 全部是新增操作
          structRowData[PageKey].push(values);
          updateTableData();
          Msg.success('操作成功');
        })
        .catch((errorInfo) => {
        /** 校验未通过 */
          console.log(errorInfo);
        });
    },
    /** 弹框取消按钮回调 */
    onCancel: (e) => {
      setRefModalVisible(false);
      refForm.resetFields();
    },
  });
  const updateTableData = (cb) => {
    dispatch({
      type: 'setStructRowData',
      structRowData: Object.assign({},
        structRowData,
        {
          [PageKey]: structRowData[PageKey].map((item, index) => {
            item.sequence = index;
            return item;
          })
        })
    });
  };
  /**
  * 引用字段表单组件属性
  * 将一个组件的相关属性放在一起
  */
  const refFormProps = {
    form: refForm,
    modalTitle,
    treeData,
    tableData: []
  };
  const dictManageProps = {
    isModal: true
  };
  return (
    <div>
      <TableHeadMenu {...tableHeadMenuProps} />
      {/* 组件传参格式的写法很重要,如果组件的参数是通过列举的方式展开,那么延展符这种写法就是错误的,会导致页面报错 */}
      <BasicEditTable {...editTableProps} />
      <Modal {...DictManageProps}>
        {/* +字典字段弹窗表单 */}
        <DictManage {...dictManageProps} />
      </Modal>
      {/* +引用字段弹窗表单 */}
      <Modal {...refModalProps}>
        {/* 引用路径 ReferenceForm-->TreeListModal--> MenuTree & BasicStory */}
        <ReferenceForm {...refFormProps} />
      </Modal>
    </div>
  );
};

export default TableField;
