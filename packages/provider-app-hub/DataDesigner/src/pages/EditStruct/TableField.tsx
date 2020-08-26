import React, { useState, useRef } from 'react';
import { Form, Modal } from 'antd';

/** 状态管理方法 */
import { useMappedState, useDispatch } from 'redux-react-hook';

/** getModalConfig-弹窗公共配置, 中文转拼音 */
import { PinYin, getModalConfig } from '@provider-app/data-designer/src/tools/mix';

/**
*  可编辑单元格组件
*/
import BasicEditTable from '@provider-app/data-designer/src/components/BasicEditTable';
/**
* 表头菜单组件
*/
import TableHeadMenu from '@provider-app/data-designer/src/bizComps/TableHeadMenu';
/**
* 关联表-外键设置 共用表单组件
*/
import ReferenceForm from '@provider-app/data-designer/src/pages/EditStruct/ReferenceForm';

/** 字段类型与数据类型，数据类型与长度 小数位 必填 唯一 字典 是否转拼音 编码规则联动关系 */
import { fieldLinkObj } from '@provider-app/data-designer/src/pages/EditStruct/fieldLink';

/**
* 字典管理弹窗组件
*/
// import DictManage from '@provider-app/data-designer/src/pages/DictManage';
import DictModal from '@provider-app/data-designer/src/pages/EditStruct/DictModal';

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

/**
 * 表字段组件
 * updateListData-更新数据函数
*/
const TableField = ({ updateListData }) => {
  /**
  * 树形数据,表编辑行记录详情,  在多个地方要使用, 表字段 是否过滤系统类型行记录页面刷新时要保持记忆 因此保存在store中
  */
  const dispatch = useDispatch();
  const { structRowData, treeData, sysFieldCtrl } = useMappedState((state) => ({
    structRowData: state.structRowData,
    treeData: state.treeData,
    sysFieldCtrl: state.sysFieldCtrl
  }));

  /**
  * 设置+引用字段，+外键字段弹窗标题
  */
  const [modalTitle, setModalTitle] = useState('表字段');
  /** 页面名称与行记录详情数据中的key对应关系 */
  const PageKey = {
    外键关联表信息: 'foreignKeys',
    关联表信息: 'references',
    表字段: 'columns'
  }[modalTitle];

  /** 创建+字典字段弹窗表单实例 */
  // const [dictForm] = Form.useForm();

  /** 创建+表字段 行记录编辑表单实例 */
  const [fieldForm] = Form.useForm();

  /**
  * 添加一行记录
  * @param args name-code 复制行记录的时候要传入默认值
  */
  const handleAdd = (args = { name: '', code: '' }) => {
    const { name, code } = args;
    const newRowData = {
      /** 还未提交到后端的数据标记, 删除要进行类型区分 */
      isUnSubmit: true,
      id: `${new Date().getTime()}`,
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
      dictionaryForeign: '',
      fieldSize: 2,
      /** 转换成拼音 */
      pinyinConvent: 'true',
    };
    editTableRef.current.onAddRow(newRowData);
  };
  /**
   * 删除一行记录
   */
  const handleDelete = (row) => {
    /** 用key,过滤掉这一行数据 */
    /** 要用store缓存起来,刷新页面时，可以恢复数据 */
    /** 页面销毁时,要清楚所有的localStorage中的内容 */

    const delRow = (row) => {
      structRowData[PageKey] = structRowData[PageKey].filter((item) => item.id !== row.key);
      updateListData(PageKey, structRowData[PageKey]);
    };
    /**
     * 数据未提交之前,前端要判断要删除的表字段是否被引用
     */
    if (row.isUnSubmit) {
      const useTableObj = {
        foreignKeys: '外键关联表',
        references: '关联表',
      };
      let useTable;
      const isUsed = ['foreignKeys', 'references'].some((key) => {
        useTable = useTableObj[key];
        return structRowData[key].some((item) => item.code === row.code);
      });
      /** 正在使用中,不能删除 */
      if (isUsed) {
        Msg.error(`该字段被${useTable}引用，不能删除`);
      } else {
        delRow(row);
      }
    } else {
      /** 已提交数据,由后端判断是否已经被使用 */
      Http.get(`/smart_building/data/v1/tables/column/allowedDeleted/${row.id}`).then((res) => {
        /**
        * true 存在与页面控件相互绑定,false没有与页面控件相互绑定
        */
        // console.log(res);
        if (res.data.result === 'false') {
          delRow(row);
        } else {
          Msg.error('该字段与页面控件相绑定，不能删除');
        }
      });
    }
  };
  /** fieldType 必须配置初始值 */
  const [link, setLink] = useState({ dataType: 'PK', fieldType: 'VARCHAR' });
  // console.log(fieldLinkObj[link.fieldType].DataTypeEnum);

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

    return !fieldLinkObj[fieldType][dataType][key] || false;
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
        compAttr: {
          type: 'Input',
          onChange: () => {
            /** 将表格名称转换为汉字首字母拼音 */
            fieldForm.setFieldsValue({ code: PinYin.getCamelChars(fieldForm.getFieldValue('name')) });
          }
        },
        itemAttr: {
          rules: [{
            required: true,
            message: '请输入字段名称'
          }]
        }
      },
      width: 200,
    },
    {
      title: '字段编码',
      dataIndex: 'code',
      formConfig: {
        compAttr: { type: 'Input' },
        itemAttr: {
          rules: [{
            required: true,
            message: '请输入字段编码'
          }]
        }
      },
      editable: true,
      width: 200,
    },
    {
      title: '字段类型',
      dataIndex: 'fieldType',
      formConfig: {
        compAttr: {
          type: 'BasicSelect',
          enum: FieldTypeEnum,
          onChange: (fieldType) => {
            // console.log(fieldType);
            setLink({ ...link, fieldType });
            fieldForm.setFieldsValue({ dataType: '' });
            // console.log({ ...link, fieldType }, fieldLinkObj[link.fieldType]);
          }
        },
        itemAttr: {
          rules: [{
            required: true,
            message: '请选择字段类型'
          }]
        }
      },
      editable: true,
      width: 160,
    },
    {
      title: '数据类型',
      dataIndex: 'dataType',
      formConfig: {
        compAttr: {
          type: 'BasicSelect',
          enum: fieldLinkObj[link.fieldType].DataTypeEnum,
          onChange: (dataType) => {
            setLink({ ...link, dataType });
          }
        },
        itemAttr: {
          rules: [{
            required: true,
            message: '请选择数据类型'
          }]
        }
      },
      editable: true,
      width: 160,
    },
    {
      title: '长度',
      dataIndex: 'fieldSize',
      formConfig: {
        compAttr: {
          type: 'InputNumber',
          placeholder: '正整数,2-64',
          disabled: isDisabled({ fieldType: link.fieldType, dataType: link.dataType, key: 'isDisabledFieldSize' })
        },
        itemAttr: {
          rules: [
            /** 自定义校验器 */
            ({ getFieldValue }) => ({
              validator(rule, value) {
                if (value === '' || value === undefined) {
                  return Promise.resolve();
                }
                if (!REG.plusInt.test(value)) {
                  return Promise.reject(new Error('必须是正整数2-64之间'));
                }

                if (value < 2 || value > 64) {
                  return Promise.reject(new Error('必须在2-64之间'));
                }
                return Promise.resolve();
              },
            }),
          ]
        }
      },
      editable: true,
      width: 200,
    },
    {
      title: '小数点',
      dataIndex: 'decimalSize',
      formConfig: {
        compAttr: {
          type: 'InputNumber',
          disabled: isDisabled({ fieldType: link.fieldType, dataType: link.dataType, key: 'isDisabledDeciSize' })
        },
      },
      editable: true,
      width: 160
    },
    {
      title: '必填',
      dataIndex: 'required',
      formConfig: {
        compAttr: {
          type: 'BasicSelect',
          enum: YNTypeEnum,
          disabled: isDisabled({ fieldType: link.fieldType, dataType: link.dataType, key: 'isDisabledRequired' })
        },
      },
      editable: true,
      width: 100
    },
    {
      title: '唯一',
      dataIndex: 'unique',
      formConfig: {
        compAttr: {
          type: 'BasicSelect',
          enum: YNTypeEnum,
          disabled: isDisabled({ fieldType: link.fieldType, dataType: link.dataType, key: 'isDisabledUni' })
        },
      },
      editable: true,
      width: 100,
    },
    {
      title: '字典',
      dataIndex: 'dictionaryForeign',
      formConfig: {
        compAttr: {
          type: 'Input',
          disabled: isDisabled({ fieldType: link.fieldType, dataType: link.dataType, key: 'isDisabledDict' }),
          onFocus: () => {
            // console.log('xx');
            setDictFieldVisible(true);
          }
        },
      },
      editable: true,
      width: 200,
    },
    {
      title: '转换成拼音',
      dataIndex: 'pinyinConvent',
      formConfig: {
        compAttr: {
          type: 'BasicSelect',
          enum: YNTypeEnum,
          disabled: isDisabled({ fieldType: link.fieldType, dataType: link.dataType, key: 'isDisabledPY' }),
        },
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
  ];

  const [clickRow, setClickRow] = useState({ id: '' });

  // console.log(structRowData.columns);

  /**
  * 将后端返回的列表值转换成页面的显示值
  */
  const toShow = (data) => {
  // console.log({ toShow: data });
    const copyData = JSON.parse(JSON.stringify(data));
    return copyData.map((row, index) => {
    /**
    * 唯一,必填,转换成拼音 这几项后端返回的值是一个对象,页面展示需要进行拆解
    */
      /** 有可能没有值 */
      if (row.fieldProperty) {
        row.unique = codeToText({ arr: YNTypeEnum, val: row.fieldProperty.unique }) || '';
        row.required = codeToText({ arr: YNTypeEnum, val: row.fieldProperty.required }) || '';
        row.pinyinConvent = codeToText({ arr: YNTypeEnum, val: row.fieldProperty.pinyinConvent }) || '';
      }
      //  else {
      //   row.unique = '';
      //   row.required = '';
      //   row.pinyinConvent = '';
      // }

      /** 前后端的数据结构不一致,后端将 unique required pinyinConvent 写在一个对象中,前端是分开的,所以要做转换 */
      row.unique = codeToText({ arr: YNTypeEnum, val: row.unique }) || '';
      row.required = codeToText({ arr: YNTypeEnum, val: row.required }) || '';
      row.pinyinConvent = codeToText({ arr: YNTypeEnum, val: row.pinyinConvent }) || '';

      /**
* 数据类型代码转文本
*/
      row.dataType = codeToText({ arr: DataTypeEnum, val: row.dataType });
      /**
* 字段类型代码转文本
*/
      row.fieldType = codeToText({ arr: FieldTypeEnum, val: row.fieldType });
      /** 只有系统类型,会出现BIGINT,与产品协商,将BIGINT转换成数字 */
      if (row.fieldType === 'BIGINT') {
        row.fieldType = '数字';
      }

      /**
* 分类代码转文本
*/
      row.species = codeToText({ arr: SpeciesTypeEnum, val: row.species });
      return row;
    });
  };
  /**
   * 是否显示隐藏系统字段,需要使用两个数组对象且这两个对象，可以更新视图
   */
  const filterTableData = () => {
    return sysFieldCtrl.isShow ? toShow(structRowData.columns) : toShow(structRowData.columns).filter((item) => item.species === '业务');
  };

  const editTableRef = useRef();
  /**
  * 编辑表格属性配置
  */
  const editTableProps = {
    columns,
    rowKey: 'id',
    childRef: editTableRef,
    form: fieldForm,
    listData: structRowData[PageKey],
    showListData: filterTableData(),
    rowClassName: (row) => (clickRow.id === row.id ? 'select-row editable-row' : 'editable-row'),
    onClick: (row) => setClickRow(row),
    onDelRow: handleDelete,
    updateListData: (data) => updateListData(PageKey, data),
    rowBtnDis: (record) => record.species === '系统'
  };

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
      // { text: "删除", onClick: () => {} },
      {
        text: `${sysFieldCtrl.title}系统字段`,
        onClick: () => {
          const title = sysFieldCtrl.title === "显示" ? '隐藏' : "显示";
          const isShow = !sysFieldCtrl.isShow;
          dispatch({
            type: 'setSysFieldCtrl',
            sysFieldCtrl: { title, isShow }
          });
        }
      },
    ]
  };

  const [dictFieldVisible, setDictFieldVisible] = useState(false);
  /**
  * 不需要渲染页面的变量或参数,没有必要用useState
  */
  let selDictKey:Array<{name, code}> = [];

  /** 选择字典 DictModal组件属性 */
  const dictManageProps = {
    isModal: true,
    /** 点击事件  */
    onChange: (key) => {
      selDictKey = key;
      // console.log({ 单击选中的key: key });
    }
  };
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
      /**
      * 表字典-字典显示的是name,向后端穿的是 dictionaryForeign:{
      * refTableCode String 是 字典表名
      * refFieldCode String 是 字典保存字段,写死code值
      * refDisplayFieldCode String 是 字典显示字段,写死name值
      * }
      */
      selDictKey.length && fieldForm.setFieldsValue({
        dictionaryForeign: selDictKey[0].name
      });
      setDictFieldVisible(false);
    },
    /** 弹框取消按钮回调 */
    onCancel: (e) => {
      setDictFieldVisible(false);
    },
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
          console.log({ values });
          // 全部是新增操作
          structRowData[PageKey] = structRowData[PageKey] || [];
          structRowData[PageKey].push(values);
          updateListData(PageKey, structRowData[PageKey]);
          Msg.success('操作成功');
          refForm.resetFields();
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
  return (
    <div>
      <TableHeadMenu {...tableHeadMenuProps} />
      {/* 表字段可编辑表格 */}
      <BasicEditTable {...editTableProps} />
      <Modal {...DictManageProps}>
        {/* +字典字段弹窗表单 */}
        <DictModal {...dictManageProps} />
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
