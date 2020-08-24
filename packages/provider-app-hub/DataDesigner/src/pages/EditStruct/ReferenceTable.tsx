/*
 * @Author: your name
 * @Date: 2020-08-11 09:29:22
 * @LastEditTime: 2020-08-24 23:34:59
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \custom-platform-v3-frontend\packages\provider-app-hub\DataDesigner\src\pages\EditStruct\ReferenceTable.js
 */
// import React from "react";

// const ReferenceTable = () => {
//   return (
//     <>引用表</>
//   );
// };
// export default ReferenceTable;

import React, { useState, useEffect, useCallback } from 'react';
import {
  Popconfirm, Form, Button, Modal
} from 'antd';
import { PinYin } from '@provider-app/data-designer/src/tools/mix';

/**
* 表头菜单组件
*/
import TableHeadMenu from '@provider-app/data-designer/src/bizComps/TableHeadMenu';
// import { Connector } from '@provider-app/data-designer/src/connector';
/** 状态管理方法 */
import { useMappedState, useDispatch } from 'redux-react-hook';

/** 表类型枚举--表格列代码转文字时 要用 */
import {
  DataTypeEnum, FieldTypeEnum, YNTypeEnum, SpeciesTypeEnum
} from '@provider-app/data-designer/src/tools/constant';
/**
 * 选项框代码转文字
 */
import { codeToText } from '@provider-app/data-designer/src/tools/format';

/**
* 模态框默认配置
*/
import { ForeignKeyStgyEnum } from '@provider-app/data-designer/src/tools/constant';
import Http, { Msg } from '@infra/utils/http';
/**
* 可编辑表格
*/
import BasicEditTable from '@provider-app/data-designer/src/components/BasicEditTable';

// const ReferenceTable = () => {
//   return (<BasicEditTable />);
// };

// export default ReferenceTable;

const ReferenceTable = ({ tab }) => {
  const dispatch = useDispatch();

  const { structTableEnum, structRowData } = useMappedState((state) => ({
    structTableEnum: state.structTableEnum,
    structRowData: state.structRowData
  }));

  const PageKey = tab === '外键设置' ? 'foreignKeys' : 'references';

  /** 引用表字段枚举 */
  const FieldNameEnum = structRowData.columns.map((item) => {
    return {
      value: item.code,
      text: item.name
    };
  });

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
      // setFieldTableData(newData);
      dispatch({
        type: 'setStructRowData',
        structRowData: Object.assign({},
          structRowData,
          updateTableData({ data: newData }))
      });
      /** 清除编辑行的key */
      setEditingKey('');
    } catch (errInfo) {
      console.log('Validate Failed:', errInfo);
    }
  };
  const updateTableData = ({ data }) => {
    return {
      [PageKey]: data.map((item, index) => {
        item.sequence = index;
        return item;
      })
    };
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
  const handleAdd = ({ type }) => {
    const rowData = getRowInitData({ type });
    structRowData[PageKey].unshift(rowData);
    /**
   * 为什么直接赋值setData()不更新,非要写成dispatch才触发更新
   */
    dispatch({
      type: 'setStructRowData',
      structRowData: Object.assign({},
        structRowData,
        updateTableData({ data: structRowData[PageKey] }))
    });

    edit(rowData);
  };
  const getRowInitData = ({ type }) => {
    const newData = {
      key: `${new Date().getTime()}`,
      /** 字段名称 */
      fieldName: '',
      /** 字段编码 */
      fieldCode: '',
      /** String 是 关联表 */
      refTableCode: '',
      /** String 是 关联字段 */
      refFieldCode: '',
      /** String 是 显示字段 */
      refDisplayFieldCode: '',
      /** int 是 排序号 */
      sequence: 0
    };

    if (type === '外键设置') {
      return Object.assign({}, newData, { deleteStrategy: "", updateStrategy: "" });
    }
    return newData;
  };
  /**
   * 删除一行记录
   */
  const handleDelete = (key) => {
    /** 用key,过滤掉这一行数据 */
    /** 要用store缓存起来,刷新页面时，可以恢复数据 */
    /** 页面销毁时,要清楚所有的localStorage中的内容 */

    Http.delete(`/smart_building/data/v1/tables/column/allowedDeleted/${key}`).then((res) => {
      /**
        * true 存在与页面控件相互绑定,false没有与页面控件相互绑定
        */
      if (res.data.result) {
        Msg.error('该字段与页面控件相绑定，不能删除');
      } else {
        dispatch({
          type: 'setStructRowData',
          structRowData: Object.assign({},
            structRowData,
            updateTableData({ data: structRowData[PageKey].filter((item) => item.key !== key) }))
        });
      }
    });
  };

  const [refFieldEnum, setRefFieldEnum] = useState([]);
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
      dataIndex: 'fieldName',
      editable: true,
      formConfig: {
        attrs: {
          type: 'BasicSelect',
          enum: FieldNameEnum || [],
          onChange: () => {
            /** 将表格名称转换为汉字首字母拼音 */
            fieldForm.setFieldsValue({ fieldCode: PinYin.getCamelChars(fieldForm.getFieldValue('fieldName')) });
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
      dataIndex: 'fieldCode',
      formConfig: {
        attrs: { type: 'Input', disabled: true },
        rules: [{
          required: true,
          message: '请输入字段编码'
        }]
      },
      editable: true,
      width: 200,
    },
    {
      title: '关联表',
      dataIndex: 'refTableCode',
      formConfig: {
        attrs: {
          type: 'BasicSelect',
          enum: structTableEnum,
          onChange: (id) => {
            Http.get(`/smart_building/data/v1/tables/${id}`).then((res) => {
              setRefFieldEnum(res.data.result.columns.map((item) => ({ value: item.code, text: item.name })));
            });
          }
        },
        rules: [{
          required: true,
          message: '请选择关联表'
        }]
      },
      editable: true,
      width: 160,
    },
    {
      title: '关联字段',
      dataIndex: 'refFieldCode',
      formConfig: {
        attrs: {
          type: 'BasicSelect',
          enum: refFieldEnum,
          onChange: () => {

          }
        },
        rules: [{
          required: true,
          message: '请选择关联字段'
        }]
      },
      editable: true,
      width: 160,
    },
    {
      title: '显示字段',
      dataIndex: 'refDisplayFieldCode',
      formConfig: {
        attrs: {
          type: 'BasicSelect',
          enum: refFieldEnum,
          onChange: () => {

          }
        },
        rules: [{
          required: true,
          message: '请选择显示字段'
        }]
      },
      editable: true,
      width: 160,
    },
  ];

  const joinCols = ({ type, cols }) => {
    const fkFields = [{
      title: '外键约束(删除时)',
      dataIndex: 'deleteStrategy',
      formConfig: {
        attrs: {
          type: 'BasicSelect',
          enum: ForeignKeyStgyEnum,
        },
        rules: [{
          required: true,
          message: '请选择外键约束(删除时)策略!'
        }]
      },
      editable: true,
      width: 160,
    },
    {
      title: '外键约束(更新时)',
      dataIndex: 'updateStrategy',
      formConfig: {
        attrs: {
          type: 'BasicSelect',
          enum: ForeignKeyStgyEnum,
        },
        rules: [{
          required: true,
          message: '请选择外键约束（更新时）策略!'
        }]
      },
      editable: true,
      width: 160,
    }];
    const operColConf = [
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
              <Popconfirm title="你确定要删除吗?" okText="确定" cancelText="取消" onConfirm={() => handleDelete(record.key)}>
                <Button type='link'>删除</Button>
              </Popconfirm>
            </span>
          );
        },
      }];
    if (type === '外键设置') {
      return [...cols, ...fkFields, ...operColConf];
    }
    return [...cols, ...operColConf];
  };
  /**
   * 给表字段的编辑列添加编辑属性设置
   */
  const mergedColumns = joinCols({ type: tab, cols: columns }).map((col) => {
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
  /**
  * 编辑表格属性配置
  */
  const editTableProps = {
    form: fieldForm,
    dataSource: (structRowData[PageKey] && [...structRowData[PageKey]].reverse()) || [],
    rowKey: (record) => record.fieldName,
    columns: mergedColumns,
    pagination: {
      onChange: cancel,
    }
  };

  /**
  * 字段列表属性配置
  */
  const tableHeadMenuProps = {
    title: tab === '外键设置' ? "外键列表" : '引用字段列表',
    menus: [
      { text: "新增", onClick: () => { handleAdd({ type: tab }); } },
    ]
  };

  return (
    <div>
      <TableHeadMenu {...tableHeadMenuProps} />
      <BasicEditTable {...editTableProps} />
    </div>
  );
};
export default ReferenceTable;
