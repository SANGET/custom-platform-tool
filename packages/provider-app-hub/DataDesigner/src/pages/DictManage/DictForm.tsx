import React, {
  useState, useEffect
} from 'react';

/** 网络请求工具 */
import Http from '@infra/utils/http';
/** 颜色选择器 */
import BasicColorPicker from '@provider-app/data-designer/src/components/BasicColorPicker';
/** 基础编辑表格组件 */
import BasicEditTable, { renderOperCol } from '@provider-app/data-designer/src/components/BasicEditTable';
import { PlusOutlined, MinusOutlined } from '@ant-design/icons';

import { TableForm } from '@provider-app/data-designer/src/bizComps/TableForm';

/** 基础表单组件 */
import BasicForm from '@provider-app/data-designer/src/components/BasicForm';
/**
* 初始化模态框
*/
import { Connector } from '@provider-app/data-designer/src/connector';
import { getModalConfig } from '../../tools/mix';

/**
 * 字典表单
 */
const DictForm = (props) => {
  /** 导出控制表单 */
  const { form } = props;

  /**
  * 因为会动态增删父组件传进来的表格数据,所以需要用状态值保存
  * 只会初始化一次,发现dataSource有值之后,不会再被执行
  */
  /** 每行记录必须有一个key字段 */
  const [fieldTableData, setFieldTableData] = useState([]);
  /**
  * 颜色面板颜色设置
  */
  const [panelColor, setPanelColor] = useState({ fontColor: '#d9d9d9', bgColor: '#fff' });
  /**
  * 生效颜色设置
  */
  const [color, setColor] = useState({ fontColor: '#d9d9d9', bgColor: '#fff' });
  /**
  * 颜色选择器显示隐藏控制
  */
  const [visible, setVisiable] = useState(false);

  /**
  * 行编辑态设置
  */
  const [editingKey, setEditingKey] = useState<number|string>('');
  /** 操作按钮 */
  const operButs = [
    {
      text: <PlusOutlined />,
      onClick: (row) => {
        handleAdd();
      }
    },
    /** 多于一行记录,才显示-号 */
    { text: <MinusOutlined />, onClick: (row) => { }, isShow: (index) => index },
  ];

  const openColorPicker = () => {
    setVisiable(true);
  };

  /**
  * 表字段列属性配置
  */
  const columns = [
    {
      title: '编码',
      dataIndex: 'code',
      editable: true,
      formConfig: {
        attrs: { type: 'Input', placeholder: '请输入编码' },
        rules: [{
          required: true,
          message: '请输入编码'
        }]
      },
      width: 200,
    },
    {
      title: '名称',
      dataIndex: 'itemName',
      formConfig: {
        attrs: { type: 'Input', placeholder: '请输入名称', style: { color: color.fontColor, backgroundColor: color.bgColor } },
        rules: [{
          required: true,
          message: '请输入名称'
        }]
      },
      editable: true,
      width: 200,
    },
    {
      title: '颜色',
      dataIndex: 'renderColor',
      formConfig: {
        attrs: {
          type: 'BasicColor',
          color: 'green',
          onClick: () => {
            openColorPicker();
          }
        },
        rules: []
      },
      editable: true,
      width: 160,
    },
    renderOperCol(operButs),
  ];
  /**
* 给表字段的编辑列添加编辑属性设置
*/
  const mergedColumns = columns.map((col:{[propName:string]:unknown}) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      /**
    * 传入单元格里面的参数
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
  * 编辑行号与记录行号相符时，设置成编辑状态
  */
  const isEditing = (record) => record.key === editingKey;

  // console.log(dataSource);

  /**
 * 编辑函数初始值设置
 */
  const edit = (record) => {
    form.setFieldsValue({
      ...record
    });
    setEditingKey(record.key);
  };

  useEffect(() => {
    // edit({
    //   key: 1,
    //   name: '',
    //   code: '',
    //   renderColor: '#fff'
    // });
    handleAdd();
  }, []);

  /**
 * 取消编辑
 */
  const cancel = () => {
    setEditingKey('');
  };
  /**
 * 保存编辑行的值
 */
  const save = async (key: React.Key) => {
    try {
      const row = (await form.validateFields()) as Item;

      const newData = [...fieldTableData];
      const index = newData.findIndex((item) => key === item.key);
      if (index > -1) {
        const item = newData[index];
        newData.splice(index, 1, {
          ...item,
          ...row,
        });
        setFieldTableData(newData);
        setEditingKey('');
      } else {
        newData.push(row);
        setFieldTableData(newData);
        setEditingKey('');
      }
    } catch (errInfo) {
      console.log('Validate Failed:', errInfo);
    }
  };

  /**
  * 添加一行记录
  */
  const handleAdd = () => {
    const newData = {
      key: 2,
      /** 字典项名称 */
      name: '',
      /** 字典项编码 */
      code: '',
      /** 背景颜色 */
      renderBgColor: '',
      /** 字体颜色 */
      renderFontColor: '',
    };
    fieldTableData.unshift(newData);
    /**
  * 为什么直接赋值setData(fieldTableData)不更新,非要写成setData([...fieldTableData])才触发更新
  */
    setFieldTableData([...fieldTableData]);
    edit(newData);
    console.log(fieldTableData);
  };
  /**
* 删除一行记录
*/
  const handleDelete = (key) => {
    setFieldTableData(fieldTableData.filter((item) => item.key !== key));
  };
  // console.log(mergedColumns);
  /**
  * 编辑表格属性配置
  */
  const editTableProps = {
    form,
    dataSource: fieldTableData,
    columns: mergedColumns,
    pagination: {
      onChange: cancel,
    }
  };

  /**
  * 颜色选择器弹窗设置
  */
  const modalProps = getModalConfig({
    visible,
    title: '新增字典',
    /**
     * 弹框确定按钮回调
     * @param e  点击按钮事件源
     * @param { form-新建表可控表单实例 }
     */
    onOk: (e) => {
      /** 生效缓存颜色 */
      setColor(panelColor);
      setVisiable(false);
    },
    /** 弹框取消按钮回调 */
    onCancel: (e) => {
      console.log({ color });
      /** 取消时复原 */
      setPanelColor(color);
      setVisiable(false);
    },
  });
  /**
  * 颜色面板属性设置
  */
  const colorProps = {
    color: panelColor,
    modalProps,
    onLeftChangeComplete: (obj) => {
      /** 更新颜色选择器展示颜色 */
      setPanelColor(Object.assign({}, panelColor, { fontColor: obj.hex }));
    },
    onRightChangeComplete: (obj) => {
      setPanelColor(Object.assign({}, panelColor, { bgColor: obj.hex }));
    },
  };

  /**
  * 第一层弹窗表单配置
  */
  const formProps = {
    form,
    colSpan: 12,
    items: {
      name: {
        /** 表单项属性 */
        itemAttr: {
          label: "字典名称",
          rules: [
            { required: true, message: '请输入名称!' },
            { pattern: /^[\u4e00-\u9fa5_a-zA-Z0-9()]+$/, message: '输入字段可以为中文、英文、数字、下划线、括号' },
            { max: 64, message: '最多只能输入64个字符' },
          ],
        },
        /** 表单项包裹组件属性 */
        compAttr: {
          type: 'Input',
          placeholder: '请输入字典名称',
          onChange: (e) => {

          }
        }
      },
      description: {
        /** 表单项属性 */
        itemAttr: {
          label: "字典描述",
          rules: [],
        },
        /** 表单项包裹组件属性 */
        compAttr: {
          type: 'Input',
          placeholder: '请输入字典描述',
          onChange: (e) => {
          }
        }
      }
    },
    // listItems: {
    //   name: {
    //     /** 表单项属性 */
    //     itemAttr: {
    //       rules: [
    //         { required: true, message: '请输入名称!' },
    //         { pattern: /^[\u4e00-\u9fa5_a-zA-Z0-9()]+$/, message: '输入字段可以为中文、英文、数字、下划线、括号' },
    //         { max: 64, message: '最多只能输入64个字符' },
    //       ],
    //     },
    //     /** 表单项包裹组件属性 */
    //     compAttr: {
    //       type: 'Input',
    //       placeholder: '请输入字典项名称',
    //       onChange: (e) => {
    //       }
    //     }
    //   },
    //   code: {
    //     /** 表单项属性 */
    //     itemAttr: {
    //       rules: [
    //         { required: true, message: '请输入字典项编码!' },
    //       ]
    //     },
    //     /** 表单项包裹组件属性 */
    //     compAttr: {
    //       type: 'Input',
    //       placeholder: '请输入字典项编码',
    //       onChange: (e) => {
    //       }
    //     }
    //   },
    //   renderColor: {
    //     /** 表单项属性 */
    //     itemAttr: {
    //     },
    //     /** 表单项包裹组件属性 */
    //     compAttr: {
    //       type: 'Input',
    //       placeholder: '请选择字体和背景颜色',
    //       onChange: (e) => {
    //       }
    //     }
    //   }
    // }
  };

  return (<>

    {/* <Input onFocus={() => { openColorPicker(); }}/> */}
    <BasicForm {...formProps}/>
    {/* <TableForm /> */}
    {/* <BasicEditTable {...editTableProps} /> */}
    <BasicColorPicker {...colorProps} />
  </>);
};

export default DictForm;
