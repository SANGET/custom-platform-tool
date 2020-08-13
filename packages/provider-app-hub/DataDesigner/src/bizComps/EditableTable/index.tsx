import React, { useState } from 'react';
import {
  Table, Input, InputNumber, Popconfirm, Form, Button
} from 'antd';

interface Item {
  key: string|number;
  name: string;
  age: number|string;
  address: string;
}

const originData: Item[] = [];
for (let i = 0; i < 3; i++) {
  originData.push({
    key: i.toString(),
    name: `Edrward ${i}`,
    age: 32,
    address: `London Park no. ${i}`,
  });
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

const EditableTable = () => {
  const [form] = Form.useForm();
  const [data, setData] = useState(originData);
  const [editingKey, setEditingKey] = useState('');

  const isEditing = (record: Item) => record.key === editingKey;

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
      dataIndex: 'key',
      width: 100,
      editable: false,
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
      width: 200,
      editable: true,
    },
    {
      title: '字段编码',
      dataIndex: 'age',
      width: 140,
      editable: true,
    },
    {
      title: '关联表',
      dataIndex: 'address',
      width: 300,
      editable: true,
    },
    {
      title: '关联字段',
      dataIndex: 'address',
      width: 140,
      editable: true,
    },
    {
      title: '显示字段',
      dataIndex: 'address',
      width: 140,
      editable: true,
    },
    // {
    //   title: '弹窗配置',
    //   dataIndex: 'address',
    //   width: 140,
    //   editable: true,
    // },
    // {
    //   title: '是否存在多层上级',
    //   dataIndex: 'address',
    //   width: 140,
    //   editable: true,
    // },
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
            <Popconfirm title="Sure to delete?" onConfirm={() => handleDelete(record.key)}>
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

  const TableHeadMenus = [
    { text: "新增", onClick: () => { handleAdd(); } },
  ];

  return (
    <div>
      <section className="table-head-menu">
        <div className="ant-table-title">引用字段列表</div>
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
          scroll={{ x: 200 }}
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

export default EditableTable;
