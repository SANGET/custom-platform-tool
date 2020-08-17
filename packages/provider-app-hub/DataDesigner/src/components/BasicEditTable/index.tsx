import React, { useState, useEffect, useCallback } from 'react';
import {
  Table, Form, Popconfirm, Button, Space
} from 'antd';

/**
* 组件仓库,动态渲染组件时要使用
*/
import BasicStory from '@provider-app/data-designer/src/components/BasicStory';

/**
* 表单校验规则要用到,消除ts赋值时的类型警告
*/
import { Rule } from 'rc-field-form/lib/interface';

import styled from 'styled-components';

/**
* 编辑表页面样式
*/
const EditTableStyled = styled.div`
.editable-cell {
  position: relative;
}

.editable-cell-value-wrap {
  padding: 5px 12px;
  cursor: pointer;
}

.editable-row:hover .editable-cell-value-wrap {
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  padding: 4px 11px;
}

[data-theme='dark'] .editable-row:hover .editable-cell-value-wrap {
  border: 1px solid #434343;
}

.el-table__header {
  table-layout: auto !important;
}
`;

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
  record: unknown;
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
 * 可以编辑的表格
 * @param form 受控表单
 * @param dataSource 表格数据源
 * @param columns 表格列属性配置
 * @param pagination 分页配置
 * @param rest 其它属性
 */
const BasicEditTable = (props) => {
  const {
    form, dataSource, columns, pagination
  } = props;
  return (
    <EditTableStyled>
      <Form form={form} component={false}>

        <Table
          components={{
            body: {
              cell: EditableCell,
            },
          }}

          dataSource={dataSource}
          columns={columns}
          pagination={pagination}
          bordered
          rowClassName="editable-row"

        />
      </Form>
    </EditTableStyled>
  );
};
/**
 * 列表行序号渲染
 * @param page 页码
 * @param pageSize 每页显示记录数量
 */
const renderIndexCol = ({ page, pageSize }) => {
  return {
    title: '序号',
    dataIndex: 'rowIndex',
    width: 80,
    /** 自定义渲染函数 */
    render: (text, record, index) => {
      // console.log({ text, record, index });
      /** 与后端协商,行号由前端计算 */
      return <span>{(page - 1) * pageSize + index + 1}</span>;
    },
  };
};
/**
* 操作列渲染函数
*/
const renderOperCol = (operButs) => {
  return {
    title: '操作',
    dataIndex: 'operCol',
    /** fixed属性会引起eslint告警, 需要使用断言 */
    fixed: 'right' as const,
    /** 每个文本的宽度应设置为80,是通过调整样式得出的合理值 */
    width: operButs.length * 80,
    render: (text, row, index) => {
      return operButs.map((item) => {
        let isShow = true;
        if (item.isShow) {
          isShow = item.isShow(index);
        }

        return isShow ? (

          <Space size="middle" key={item.text}>
            {
              /** 删除需要弹出二次确认框 */
              item.text === '删除'
                ? (<Popconfirm placement="topLeft" title={item.title} onConfirm={() => item.onClick(row)} okText="删除" cancelText="取消">
                  <Button type="link" >
                    {item.text}
                  </Button>
                </Popconfirm>)

                : (<Button type="link" onClick={() => item.onClick(row)}>
                  {item.text}
                </Button>)
            }
          </Space>
        ) : null;
      });
    }
  };
};
export { renderOperCol, renderIndexCol };
export default BasicEditTable;

/**
 * 表字段后端接口返回值，属性对象与前端页面展示值有差异,需要处理一下
 */
// interface Item {
//   id ? :string|number;
//   key: string|number;
//   /** 字段名称 */
//   name: string;
//   /** 字段编码 */
//   code:string;
//   /** 字段类型-VARCHAR(字符串)INT(整型)TIME(时间)DATE(日期时间)TEXT(超大文本) */
//   fieldType:"VARCHAR"|"INT"|"TIME"|"DATE"|"TEXT";
//   /** 数据类型 NORMAL(普通字段)PK(主键字段)QUOTE(引用字段)DICT(字典字段)FK(外键字段) */
//   dataType:'NORMAL'|"PK"|"QUOTE"|"DICT"|"FK";
//   /** 业务字段类型 */
//   species:string;
//   /** 小数位 */
//   decimalSize:number;
//   /** 属性对象 */
//   fieldProperty?:{
//     /** 必填 */
//     required:'true'|'false';
//     /** 唯一 */
//     unique:'true'|'false';
//     /** 转换成拼音 */
//     pinyinConvent: 'true'|'false';
//     regular?:unknown;
//   }
//   /** 字典对象 */
//   dictionaryForeign?:{
//     /** 字典主键 */
//     id?:string|number;
//     /** 表名 */
//     tableName:string;
//     /** 字典字段 */
//     fieldCode:string;
//     /** 字典保存字段表中文名 */
//     refTableName:string;
//     /** 字典保存字段,写死code值 */
//     refFieldCode:string;
//     /** 字典显示字段,写死name值 */
//     refDisplayFieldCode:string;
//   }
//   [propName: string]: unknown;
// }
