/*
 * @Author: your name
 * @Date: 2020-08-11 09:29:22
 * @LastEditTime: 2020-08-27 14:22:28
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \custom-platform-v3-frontend\packages\provider-app-hub\DataDesigner\src\pages\EditStruct\ReferenceTable.js
 */

import React, { useState, useRef } from 'react';
import { Form } from 'antd';
import { PinYin } from '@provider-app/data-designer/src/tools/mix';

/**
* 表头菜单组件
*/
import TableHeadMenu from '@provider-app/data-designer/src/bizComps/TableHeadMenu';

/** 状态管理方法 */
import { useMappedState, useDispatch } from 'redux-react-hook';

/**
* 模态框默认配置
*/
import { ForeignKeyStgyEnum } from '@provider-app/data-designer/src/tools/constant';
/**
 * 选项框代码转文字
 */
import { codeToText } from '@provider-app/data-designer/src/tools/format';

import Http from '@infra/utils/http';
/**
* 可编辑表格
*/
import BasicEditTable from '@provider-app/data-designer/src/components/BasicEditTable';
import { ItemTypes } from '@engine/visual-editor/spec/types';

/**
 * 引用表和外键设置共用这个组件
 * @param tab区分用户点击了哪个tab面板
 */
const ReferenceTable = ({ tab, updateListData }) => {
  // const dispatch = useDispatch();
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
   * 添加一行记录
   */
  const handleAdd = ({ type }) => {
    const newRowData = getRowInitData({ type });
    editTableRef.current.onAddRow(newRowData);
  };
  /** 新增一条记录初始化数据 */
  const getRowInitData = ({ type }) => {
    const newData = {
      id: `${new Date().getTime()}`,
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

  /** 引用字段枚举 */
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
        compAttr: {
          type: 'BasicSelect',
          enum: FieldNameEnum || [],
          onChange: () => {
            /** 将表格名称转换为汉字首字母拼音 */
            fieldForm.setFieldsValue({ fieldCode: PinYin.getCamelChars(fieldForm.getFieldValue('fieldName')) });
          }
        },
        itemAttr: {
          rules: [{ required: true, message: '请输入字段名称' }]
        }
      },
      width: 200,
    },
    {
      title: '字段编码',
      dataIndex: 'fieldCode',
      formConfig: {
        compAttr: { type: 'Input', disabled: true },
      },
      editable: true,
      width: 200,
    },
    {
      title: '关联表',
      dataIndex: 'refTableCode',
      formConfig: {
        compAttr: {
          type: 'BasicSelect',
          enum: structTableEnum,
          onChange: (id) => {
            /** 关联表不同-联动查询引用字段 */
            Http.get(`/smart_building/data/v1/tables/${id}`).then((res) => {
              setRefFieldEnum(res.data.result.columns.map((item) => ({ value: item.code, text: item.name })));
            });
          }
        },
        itemAttr: {
          rules: [{ required: true, message: '请选择关联表' }]
        }
      },
      editable: true,
      width: 160,
    },
    {
      title: '关联字段',
      dataIndex: 'refFieldCode',
      formConfig: {
        compAttr: {
          type: 'BasicSelect',
          enum: refFieldEnum,
          onChange: (val) => {
            fieldForm.setFieldsValue({ refFieldCodeName: codeToText({ arr: refFieldEnum, val }) });
          }
        },
        itemAttr: {
          rules: [{ required: true, message: '请选择关联字段' }]
        }
      },
      editable: true,
      width: 160,
    },
    {
      title: '显示字段',
      dataIndex: 'refDisplayFieldCode',
      formConfig: {
        compAttr: {
          type: 'BasicSelect',
          enum: refFieldEnum,
          onChange: (val) => { fieldForm.setFieldsValue({ refDisplayFieldCodeName: codeToText({ arr: refFieldEnum, val }) }); }
        },
        itemAttr: {
          rules: [{ required: true, message: '请选择显示字段' }]
        }
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
        compAttr: {
          type: 'BasicSelect',
          enum: ForeignKeyStgyEnum,
        },
        itemAttr: {
          rules: [{ required: true, message: '请选择外键约束(删除时)策略' }]
        }
      },
      editable: true,
      width: 160,
    },
    {
      title: '外键约束(更新时)',
      dataIndex: 'updateStrategy',
      formConfig: {
        compAttr: {
          type: 'BasicSelect',
          enum: ForeignKeyStgyEnum,
        },
        itemAttr: {
          rules: [{ required: true, message: '请选择外键约束(更新时)策略' }]
        }
      },
      editable: true,
      width: 160,
    }];

    if (type === '外键设置') {
      return [...cols, ...fkFields];
    }
    return [...cols];
  };

  /**
  * 将后端返回的列表值转换成页面的显示值
  */
  const toShow = (type, data) => {
    // console.log({ toShow: data });
    const copyData = JSON.parse(JSON.stringify(data));
    return copyData.map((row, index) => {
      const enumArr = [
        { key: 'fieldName', enumList: FieldNameEnum },
        { key: 'refTableCode', enumList: structTableEnum }
      ];
      enumArr.forEach((item) => {
        const { key, enumList } = item;
        row[key] = codeToText({ arr: enumList, val: row[key] });
      });

      if (type === '外键设置') {
        ['deleteStrategy', 'updateStrategy'].forEach((key) => {
          row[key] = codeToText({ arr: ForeignKeyStgyEnum, val: row[key] });
        });
      }

      return row;
    });
  };
  /** 编辑表引用 */
  const editTableRef = useRef();
  /**
  * 编辑表格属性配置
  */
  const editTableProps = {
    columns: joinCols({ type: tab, cols: columns }),
    rowKey: 'id',
    childRef: editTableRef,
    form: fieldForm,
    showListData: toShow(tab, structRowData[PageKey]),
    listData: structRowData[PageKey],
    updateListData: (data) => updateListData(PageKey, data),
    rowBtnDis: (record) => record.species === '系统'
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
