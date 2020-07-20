import React, { useState } from 'react';
import {
  Table, Form, Input, InputNumber, Select, TreeSelect, Tooltip
} from 'antd';

const { Option } = Select;

const EditableCell = ({
  title, // 列标题
  index, // 行号
  record, // 行数据
  editing, // 编辑态标志位
  dataIndex, // 列数据的key
  formItemType, // 表单项类型
  required, // 是否必须
  children, // 默认表格列内容
  treeData,
  ...restProps // 其余属性
}) => {
  // 选择框组件
  const SelectNode = (() => {
    const opts = [
      { label: '隐藏', value: '0' },
      { label: '禁用', value: '1' }
    ];
    return (
      <Select style={{ width: 120 }} value={0}>
        {opts.map((item) => (
          <Option key={item.value} value={item.value}>
            {item.label}
          </Option>
        ))}
      </Select>
    );
  })();

  // 树选择组件
  const TreeSelectNode = ((treeData) => {
    const tProps = {
      treeData,
      value: '',
      placeholder: '请选择父级',
      style: {
        width: '100%'
      }
    };
    return <TreeSelect {...tProps} />;
  })(treeData);

  // 编辑行表单项类型
  const nodeType = {
    text: <Input />,
    number: <InputNumber />,
    select: SelectNode,
    TreeSelect: TreeSelectNode
  }[formItemType];

  return (
    <td {...restProps}>
      {editing ? (
        <Form.Item
          name={dataIndex}
          style={{
            margin: 0
          }}
          rules={[
            {
              required: required !== undefined ? required : true,
              message: `${title}不能为空!`
            }
          ]}
        >
          {nodeType}
        </Form.Item>
      ) : (
        children
      )}
    </td>
  );
};

const EditableTable = (props) => {
  const { title, tableData, treeData } = props;
  // 创建form 控制实例
  const [form] = Form.useForm();
  const [data, setData] = useState(tableData);
  const [editingKey, setEditingKey] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const isEidtCol = (record) => record.key === editingKey;

  // 设置行编辑状态
  const edit = (record) => {
    // form里面的控件值不能被 setState 动态更新，要用 setFieldsValue 来更新
    form.setFieldsValue({
      authCode: '',
      authName: '',
      parentId: '',
      displayType: '',
      ...record
    });
    setEditingKey(record.key);
  };

  // 取消行编辑状态
  const cancelEditing = () => {
    setEditingKey('');
  };
  /**
   * 保存编辑行数据
   * @param key 行号
   */
  const save = async (key) => {
    try {
      // 触发表单校验
      const row = await form.validateFields();
      // 生成副本
      const newData = JSON.parse(JSON.stringify(data));
      // 获取编辑行的行号
      const index = newData.findIndex((item) => key === item.key);

      const item = newData[index];
      console.log(item);
      // 更新编辑行数据
      newData.splice(index, 1, { ...item, ...row });
      setData(newData);
      cancelEditing();
    } catch (errInfo) {
      console.log('表单校验失败:', errInfo);
    }
  };

  // 单元格属性集合
  const columns = (() => {
    const cols = [
      {
        title: '序号',
        dataIndex: 'key',
        width: 50,
        // 复杂情况渲染函数
        render: (text, record, index) => {
          // console.log({ text, record, index });
          return <span>{(page - 1) * pageSize + index + 1}</span>;
        }
      },
      {
        title: '权限项名称',
        dataIndex: 'authName',
        formItemType: 'text',
        editable: true
      },
      {
        title: '权限编码',
        dataIndex: 'authCode',
        formItemType: 'text',
        editable: true
      },
      {
        title: '上级',
        dataIndex: 'parentId',
        formItemType: 'TreeSelect',
        editable: true,
        required: false,
        render: (key) => {
          if (!key) return;
          // 根据节点的key查找节点
          function treeQuery(tree, key) {
            let queue: Array<{ title: string; key: string; children?: [] }> = [];
            queue = queue.concat(tree);
            while (queue.length) {
              const temp = queue.shift();
              if (temp.children) {
                queue = queue.concat(temp.children);
              }
              if (temp.key === key) {
                return temp;
              }
            }
          }
          return treeQuery(treeData, key).title;
        }
      },
      {
        title: '无权限显示方式',
        dataIndex: 'displayType',
        formItemType: 'select',
        editable: true,
        render: (text) => {
          // 将选项代码转换为文字
          return {
            0: '隐藏',
            1: '禁用'
          }[text];
        }
      },
      {
        title: '创建方式',
        dataIndex: 'createType'
      },
      {
        title: '最后修改时间',
        dataIndex: 'lastModified'
      },
      {
        title: '操作',
        dataIndex: '',
        render: () => <a>删除</a>
      }
    ];
    return cols.map((col) => {
      return {
        width: '',
        ellipsis: {
          showTitle: false
        },
        render: (text) => (
          <Tooltip placement="topLeft" title={text}>
            {text}
          </Tooltip>
        ),
        ...col
      };
    });
  })();
  const mergedColumns = columns.map((col) => {
    if (!col.editable) {
      return col;
    }
    const {
      formItemType, dataIndex, title, required
    } = col;
    // 设置了onCell就可以自定义渲染
    return {
      ...col,
      onCell: (record) => ({
        record,
        title,
        dataIndex,
        formItemType,
        required,
        treeData,
        editing: isEidtCol(record) // 自定义的判断标记
      })
    };
  });
  // 行多选配置
  const rowSelection = {
    /**
     * 选中改变事件触发回调
     * selectedRowKeys 选中行的行号集合
     * selectedRows 选中行行数据
     */
    onChange: (selectedRowKeys, selectedRows) => {
      console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
    },
    /**
     * 更改每行多选设置
     * record-行记录
     */
    getCheckboxProps: (record) => ({
      disabled: record.key === '0' // 禁止选择配置
    })
  };
  return (
    <Form form={form} component={false}>
      <Table
        // components 覆盖默认table元素，可以覆盖的属性有table header body, body属性下面有3个子属性wrapper,row,cell;
        components={{
          body: {
            cell: EditableCell
          }
        }}
        bordered
        rowSelection={{
          type: 'checkbox',
          ...rowSelection
        }}
        title={title}
        dataSource={data}
        columns={mergedColumns}
        rowClassName="editable-row"
        pagination={{
          onChange: (page, pageSize) => {
            setPage(page);
            setPageSize(pageSize);
            cancelEditing();
          }
        }}
        onRow={(record) => {
          return {
            onDoubleClick: (event) => {
              setIsEditing(true);
              edit(record);
            },
            onMouseLeave: (event) => {
              // 添加条件，为了避免鼠标经过时，每行都执行save方法
              if (isEditing) {
                setIsEditing(false);
                save(record.key);
              }
            },
            onContextMenu: (event) => {},
            onMouseEnter: (event) => {}, // 鼠标移入行
            onClick: (event) => {} // 点击行
          };
        }}
      />
    </Form>
  );
};

export default EditableTable;
