import React, { useState, useImperativeHandle } from 'react';

import {
  Table, Form, Popconfirm, Button, Space,
  Tooltip
} from 'antd';

/** randomNum-生成5位随机数  */
/**
* 组件仓库,动态渲染组件时要使用
*/
import BasicStory from '@provider-app/data-designer/src/components/BasicStory';

/**
* 表单校验规则要用到,消除ts赋值时的类型警告
*/
import { Rule } from 'rc-field-form/lib/interface';

import { PinYin, randomNum } from '@provider-app/data-designer/src/tools/mix';
import './index.less';
/** 中文转拼音 */

/**
 * 编辑表格属性约束
 */
interface EditableCellProps extends React.HTMLAttributes<HTMLElement> {
  editing: boolean;
  dataIndex: string;
  title: string;
  formConfig:{
    compAttr:{
      type:'InputNumber' | 'Input' | 'BasicSelect';
      enum?:Array<{value, text}>;
      placeholder?:string;
      [propName:string]:unknown
    }
    itemAttr:{
      rules?:Rule[];
      [propName:string]:unknown
    }
  }
  record: unknown;
  index: number;
  children: React.ReactNode;
}

/**
 * 编辑行单元格设置,这里是重点
 * @param editing- true 列单元渲染成表单项  false 列单元渲染成文字
 * @param dataIndex-列单元的key
 * @param title-列单元标题
 * @param formConfig-列单元表单项配置
 * @param record-列单元数据记录
 * @param index-第几列
 * @param children-列单元文本元素ReactNode
 * @param title-列单元标题
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
          {...formConfig.itemAttr}
        >
          <BasicStory {...formConfig.compAttr} />
        </Form.Item>
      ) : (
        <Form.Item>
          {children}
        </Form.Item>
      )}
    </td>
  );
};
/**
 * 可编辑表格
 * @param ref   子组件的引用
 * @param form   行编辑受控表单
 * @param listData 表格数据源
 * @param showListData 展示数据源(对数据字段做了转译,与提交数据不同)
 * @param columns 表格列属性配置(不含操作列)
 * @param pagination 分页配置
 * @param rowKey 每一行的唯一标识key的属性名,antd table要求每行要有一个唯一标识
 * @param updateListData 更新列表数据函数,入参是要更新的列表数据
 * @param onDelRow 添加额外的行记录删除逻辑
 * @param rest 其它属性
 */
const BasicEditTable = ({
  childRef, form, columns, rowKey, listData, updateListData, ...rest
}) => {
  /** 属性书写顺序,  数据在前,事件在后 , 相关项写在一起 */
  const {
    showListData, pagination, rowEditBtnDis, rowDelBtnDis, onClick, onDelRow
  } = rest;
  /** 列表显示数据有时与提交数据一致,有时不一致 */
  const dataSource = showListData || listData;

  useImperativeHandle(childRef, () => ({
    // newRowData 是子组件暴露给父组件的方法
    onAddRow: (newRowData) => {
      edit(newRowData);
      listData.unshift(newRowData);
      updateListData(listData);
    }
  }));

  /**
  * 每一行有一个唯一的key,用 row key设置那一行处于编辑态
  */
  const [editingKey, setEditingKey] = useState<number|string>('');
  /**
   * 编辑行号与记录行号相等时，设置成编辑状态
   */
  const isEditing = (record) => {
    // console.log(record.id, editingKey);
    return record[rowKey] === editingKey;
  };

  /**
   * 取消编辑
   */
  const cancel = () => {
    setEditingKey('');
  };

  /**
 * 编辑函数初始值设置
 */
  const edit = (record) => {
    // console.log({ record, editingKey });
    /**
    * 将行记录的值设置到表单-这里前端显示值和后端返回值可能并不完全一样，需要转换
    */
    form.setFieldsValue({
      ...record
    });
    /**
   * 设置编辑行--编辑行的按钮是保存和取消
   */
    setEditingKey(record.id);
  };

  /**
   * 记录复制
   * @param row --原始行信息
   */
  const copy = (row) => {
    const { name } = row;
    const copyName = `${name}_副本_${randomNum(10000, 99999)}`;
    const newRowData = Object.assign({}, row,
      {
        id: `${new Date().getTime()}`,
        name: copyName,
        code: PinYin.getCamelChars(copyName),
        isUnSubmit: true
      });

    const index = listData.findIndex((item) => row.id === item.id);

    listData.splice(index, 0, newRowData);
    edit(newRowData);
    updateListData(listData);
  };

  /**
  * 保存编辑行的值
  * key-编辑行的key
  * rowKey--每行数据的唯一标识key的属性名
  */
  const save = async ({ key, rowKey, id }) => {
    // console.log({ key, rowKey });
    try {
      /**
       * 先进行表单校验,校验通过可以拿到该行的表单值
       */
      const row = (await form.validateFields());
      /** 选项值为code */
      // const row = listData.find((item) => item.id === id);

      /** 字典字段 页面上拿到的是名称,提交时按照接口约定的字段对象属性提交 */
      if (row.dictionaryForeign) {
        row.dictionaryForeignSubmit = {
          refTableCode: row.dictionaryForeign,
          refFieldCode: 'code',
          refDisplayFieldCode: 'name'
        };
      }

      /**
      * 复制一份表格数据
      */
      const newData = [...listData];
      /** 找到编辑行的索引号 */
      const index = newData.findIndex((item) => key === item[rowKey]);

      /** 如果找到,把新值合并到旧值对象上,替换掉原有的那一行记录 */
      if (index > -1) {
        const item = newData[index];
        newData[index] = {
          ...item,
          ...row,
        };
      } else {
        /** 没有找到该记录,插入一条新记录,显示在第一行 */
        newData.unshift(row);
      }

      /** 更新表格数据 */
      updateListData(JSON.parse(JSON.stringify(newData)));

      /** 清除编辑行的key */
      setEditingKey('');
    } catch (errInfo) {
      console.log('Validate Failed:', errInfo);
    }
  };
  /**
   * 删除一行记录回调
   */
  const handleDelete = (row, rowKey) => {
    /** 如果定义了onDelRow方法,执行自定义删除逻辑 */
    if (onDelRow) {
      onDelRow(row);
    } else {
    /** 否则执行通用删除逻辑 */
    /** 过滤是否写死使用id,这个写法不通用,但是适合后端返回数据 */
      listData = listData.filter((item) => item[rowKey] !== row[rowKey]);
      updateListData(listData);
    }
  };

  /**
  * 公共操作列
  * 因为这里有判断逻辑,所以没有调用生成通用操作列的renderOperCol 方法
  */
  const operCol = {
    title: '操作',
    dataIndex: 'operation',
    fixed: 'right',
    width: 180,
    render: (text, record, index) => {
      const editable = isEditing(record);
      /** 系统类型--不能编辑,不能删除 */
      const isShowEditBtn = (rowEditBtnDis && rowEditBtnDis(record)) ? 'hide' : 'show';

      /** 系统元数据 业务元数据 可以编辑，不能删除 */
      const isShowDelBtn = (rowDelBtnDis && rowDelBtnDis(record)) ? 'hide' : 'show';
      return editable ? (
        <Space>
          {/* 编辑行,展示保存和取消按钮 */}
          <Button type='link' onClick={() => save({ key: record[rowKey], rowKey, id: record.id })}>
            保存
          </Button>
          <Button type='link' onClick={cancel}>取消</Button>
        </Space>
      ) : (
        <Space>
          {/* 非编辑行，展示编辑和删除按钮,如果有一行处于编辑态,禁用编辑按钮 */}
          <Button type='link' className={isShowEditBtn} disabled={editingKey !== ''} onClick={() => edit(record)}>
          编辑
          </Button>
          <Button type='link' className={isShowEditBtn} disabled={editingKey !== '' } onClick={() => copy(record)}>
          复制
          </Button>

          <Popconfirm title="你确定要删除吗?" okText="确定" cancelText="取消" onConfirm={() => handleDelete(record, rowKey)}>
            <Button type='link' className={isShowDelBtn } >删除</Button>
          </Popconfirm>
        </Space>
      );
    },
  };

  /** 将操作列合并到表格列属性配置中 */
  const cols = columns.concat(operCol);
  /**
  * 给表字段的编辑列添加编辑属性设置
  */
  const mergedColumns = cols.map((col) => {
    col.key = col.dataIndex;
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

  /** 分页配置 */
  const pagerConf = {
    onChange: cancel,
    ...pagination,
  };

  return (
    <div className="edit-table">
      <Form form={form} component={false}>
        <Table
          components={{
            body: {
              cell: EditableCell,
            },
          }}

          dataSource={dataSource}
          columns={mergedColumns}
          rowKey={(record) => record[rowKey]}
          pagination={pagerConf}
          bordered
          rowClassName={ rest.rowClassName || "editable-row"}
          onRow={(record) => {
            return {
              onClick: (event) => {
                onClick && onClick(record);
              }
            };
          }}

        />
      </Form>
    </div>
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
      return operButs.map((item, i) => {
        let isShow = true;
        if (item.isShow) {
          console.log(index, 'index-------');
          isShow = item.isShow(index);
          console.log(isShow, 'isShow--------');
        }
        // console.log(item);

        return isShow ? (
          <Space size="middle" key={i}>
            {
              /** 删除需要弹出二次确认框 */
              item.text === '删除' || item.text === '删除子项'
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

export const getColConfig = (col) => {
  return Object.assign({}, {
    key: col.dataIndex,
    ellipsis: {
      showTitle: true
    },
    render: (text) => (
      <Tooltip placement="topLeft" title={text}>
        {text}
      </Tooltip>
    ),

  }, { ...col });
};
export { renderOperCol, renderIndexCol };
export default BasicEditTable;
