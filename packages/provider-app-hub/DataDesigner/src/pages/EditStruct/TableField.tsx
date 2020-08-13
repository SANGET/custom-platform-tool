import React, { useState, useEffect } from 'react';
import {
  Table, Input, InputNumber, Popconfirm, Form, Button
} from 'antd';

/** 表类型枚举--表格列代码转文字时也要用 */
import { DataTypeEnum, FieldTypeEnum, IYNType } from '@provider-app/data-designer/src/tools/constant';
/** GMT时间格式化 */
import {
  formatGMT, codeToText
} from '@provider-app/data-designer/src/tools/format';

interface Item {
  key: string|number;
  name: string;
  age: number|string;
  address: string;
}

interface EditableCellProps extends React.HTMLAttributes<HTMLElement> {
  editing: boolean;
  dataIndex: string;
  title: any;
  inputType: 'number' | 'text';
  record: Item;
  index: number;
  children: React.ReactNode;
}

const EditableCell: React.FC<EditableCellProps> = ({
  editing,
  dataIndex,
  title,
  inputType,
  record,
  index,
  children,
  ...restProps
}) => {
  const inputNode = inputType === 'number' ? <InputNumber /> : <Input />;

  return (
    <td {...restProps}>
      {editing ? (
        <Form.Item
          name={dataIndex}
          style={{ margin: 0 }}
          rules={[
            {
              required: true,
              message: `Please Input ${title}!`,
            },
          ]}
        >
          {inputNode}
        </Form.Item>
      ) : (
        children
      )}
    </td>
  );
};

const TableField = (props) => {
  const {
    tableData, scroll, style, title
  } = props;

  const [form] = Form.useForm();

  const [editingKey, setEditingKey] = useState('');

  const isEditing = (record: Item) => record.key === editingKey;

  const dataSource = tableData.map((row) => {
    if (row.field_property) {
      row.unique = row.field_property.unique || '';
      row.required = row.field_property.required || 'false';
      row.pinyinConvent = row.field_property.pinyinConvent || 'false';
    } else {
      row.unique = '';
      row.required = '';
      row.pinyinConvent = 'false';
    }
    /**
    * 数据类型代码值转文本
    */
    row.dataType = codeToText({ arr: DataTypeEnum, val: row.dataType });
    /**
    * 字段类型代码值转文本
    */
    row.fieldType = codeToText({ arr: FieldTypeEnum, val: row.fieldType });
    row.key = row.code;
    return row;
  });

  // console.log(dataSource);
  const [data, setData] = useState([]);

  useEffect(() => {
    setData(dataSource);
  }, []);

  const edit = (record: Item) => {
    form.setFieldsValue({
      name: '', age: '', address: '', ...record
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
      width: 140,
    },
    {
      title: '列名',
      dataIndex: 'code',
      editable: true,
      width: 140,
    },
    {
      title: '字段类型',
      dataIndex: 'fieldType',
      editable: true,
      width: 100,
    },
    {
      title: '数据类型',
      dataIndex: 'moduleId',
      editable: true,
      width: 140,
    },
    {
      title: '长度',
      dataIndex: 'fieldSize',
      editable: true,
      width: 160,
    },
    {
      title: '小数点',
      dataIndex: 'decimalSize',
      editable: true,
      width: 100
    },
    {
      title: '必填',
      dataIndex: 'required',
      editable: true,
      width: 100
    },
    {
      title: '唯一',
      dataIndex: 'unique',
      editable: true,
      width: 160,
    },
    {
      title: '字典',
      dataIndex: 'dictionaryForeign',
      editable: true,
      width: 140,
    },
    {
      title: '转换成拼音',
      dataIndex: 'pinyinConvent',
      editable: true,
      width: 140,
    },
    // {
    //   title: '校验规则',
    //   dataIndex: 'modifiedBy',
    //   width: 140,
    // },
    {
      title: '分类',
      dataIndex: 'species',
      editable: true,
    },
    {
      title: '操作',
      dataIndex: 'operation',
      fixed: 'right',
      width: 100,
      render: (_: any, record: Item) => {
        const editable = isEditing(record);
        return editable ? (
          <span>
            <a onClick={() => save(record.key)} style={{ marginRight: 8 }}>
              保存
            </a>
            <Popconfirm title="Sure to cancel?" onConfirm={cancel}>
              <a>取消</a>
            </Popconfirm>
          </span>
        ) : (
          <span>

            <a disabled={editingKey !== ''} style={{ marginRight: 8 }} onClick={() => edit(record)}>
            编辑
            </a>
            <Popconfirm title="你确定要删除吗?" okText="确定" cancelText="取消" onConfirm={() => handleDelete(record.key)}>
              <a>删除</a>
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
      onCell: (record: Item) => ({
        record,
        inputType: col.dataIndex === 'age' ? 'number' : 'text',
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
      }),
    };
  });

  const handleAdd = () => {
    const newData = {
      key: data.length.toString(),
      name: ``,
      age: '',
      address: ``,
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
    { text: "+引用字段", onClick: () => {} },
    { text: "+外键字段", onClick: () => {} },
    { text: "删除", onClick: () => {} },
    { text: "保存", onClick: () => {} },
    { text: "隐藏系统字段", onClick: () => {} },
  ];

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
    </div>
  );
};

export default TableField;
