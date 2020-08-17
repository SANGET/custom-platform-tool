import React, { useState, useEffect, useCallback } from 'react';
import { Form } from 'antd';
/** 左树右列表弹窗组件 */
import TreeListModal from '@provider-app/data-designer/src/bizComps/TreeListModal';
/**
*  模态框默认初始化方法
*/
import { getModalConfig } from '@provider-app/data-designer/src/tools/mix';

/**
 * +引用字段弹窗组件
 * @param treeData--关联表弹窗左侧树要用的数据
 * @param tableData--关联表弹窗右侧表格要用的数据
 */
const ReferenceForm = ({
  treeData, tableData, ...rest
}) => {
  /**
   * 引用字段--关联字段，显示字段下拉选项值
   */
  const RefFieldEnum = tableData.map((item) => {
    return {
      text: item.name,
      value: item.code,
    };
  });

  /**
   * 创建+引用字段弹窗表单实例
   */
  const [refForm] = Form.useForm();

  /**
   * 选择关联表弹窗--左侧菜单树点击的节点值
   */
  const [selectMenuTreeNode, setSelectMenuTreeNode] = useState({});
  /**
   * 选择关联表弹窗--关联表搜索框值
   */
  const [selectTableSearchValue, setSelectTableSearchValue] = useState('');

  /**
   * 树形属性配置
   * 写到这里遇到一个问题,是把公共数据放在store中好,还是通过传回调的方式好
   * 回传获取最新值的时机好把握
   */
  const treeProps = {
    value: '',
    dataSource: treeData,
    placeholder: '请选择父级',
    style: {
      width: '100%'
    },
    getClickNodeValue: (node) => {
      console.log({ '选择关联表弹窗--左侧菜单树点击的节点值': node });
      setSelectMenuTreeNode(node);
    }
  };
  /**
   * 搜索条件-表名称
   */
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
  * 选择关联表弹窗显隐控制
  */
  const [selectRefTableVisible, setSelectRefTableVisible] = useState(false);
  /**
  * 选择关联表弹窗属性配置
  */
  const selectTableModalProps = getModalConfig({
    visible: selectRefTableVisible,
    title: '选择关联表',
    /**
     * 弹框确定按钮回调
     * @param e  点击按钮事件源
     * @param { form-新建表可控表单实例 }
     */
    onOk: (e) => {
      console.log('ok');
      refForm.setFieldsValue({ refTableCode: selectTableSearchValue });
      setSelectRefTableVisible(false);
    },
    /** 弹框取消按钮回调 */
    onCancel: (e) => {
      console.log('cancel');
      setSelectRefTableVisible(false);
    },
  });
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
          setSelectRefTableVisible(true);
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

  /**
  * 表单配置
  */
  const formProps = {
    form: refForm,
    formItemsConfig,
  };
  return (
    <TreeListModal formProps={formProps} modalProps={ selectTableModalProps} treeProps={treeProps} tableProps={tableProps} searchProps={searchProps} />
  );
};

export default ReferenceForm;
