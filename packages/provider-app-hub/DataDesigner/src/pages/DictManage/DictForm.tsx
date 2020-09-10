import React, {
  useState, useEffect
} from 'react';

/** 颜色选择器 */
import BasicColorPicker from '@provider-app/data-designer/src/components/BasicColorPicker';
/** 拼音转换 */
import { PinYin } from '@provider-app/data-designer/src/tools/mix';
/** 基础编辑表格组件 */
import { renderOperCol } from '@provider-app/data-designer/src/components/BasicEditTable';
import { PlusOutlined, MinusOutlined } from '@ant-design/icons';

/** 基础表单组件 */
import BasicForm from '@provider-app/data-designer/src/components/BasicForm';
/**
* 初始化模态框
*/

import { getModalConfig } from '../../tools/mix';

/**
 * 字典表单
 */
const DictForm = (props) => {
  /** 导出控制表单 */
  const { form, isSub, isAddEditRow } = props;

  /**
  * 因为会动态增删父组件传进来的表格数据,所以需要用状态值保存
  * 只会初始化一次,发现dataSource有值之后,不会再被执行
  */
  /** 每行记录必须有一个key字段 */
  const [fieldTableData, setFieldTableData] = useState<any>([]);
  /**
  * 颜色面板颜色设置
  */
  const [panelColor, setPanelColor] = useState({ fontColor: '#000000a6', bgColor: 'transparent' });
  /**
  * 生效颜色设置
  */
  const [color, setColor] = useState({ fontColor: '#d9d9d9', bgColor: '#fff' });

  //
  const [id, setId] = useState(0);
  /**
  * 颜色选择器显示隐藏控制
  */
  const [colorPicker, setColorPicker] = useState({ visiable: false, title: '', selectRowIndex: 0 });

  /**
  * 行编辑态设置
  */
  const [editingKey, setEditingKey] = useState<number | string>('');
  /** 操作按钮 */
  const operButs = [
    {
      text: <PlusOutlined />,
      onClick: (row) => {
        console.log('row', row);
        setId(id + 1);
        handleAdd();
      }
    },
    /** 多于一行记录,才显示-号 */
    {
      text: <MinusOutlined />,
      onClick: (row) => {
        console.log('row----', row);
        const { key } = row;
        handleDelete(key);
      },
      isShow: (index) => index
    },
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
        attrs: {
          type: 'Input',
          placeholder: '请输入编码',
          onChange: (e) => {
            console.log('请输入编码', e.target.value); //-------------------
          }
        },
        rules: [{
          required: true,
          message: '请输入编码'
        }]
      },
      width: 200,
    },
    {

      title: '名称',
      dataIndex: 'dictName',
      formConfig: {
        attrs: {
          type: 'Input',
          placeholder: '请输入名称',
          style: { color: color.fontColor, backgroundColor: color.bgColor },
          onChange: (e) => {
            console.log('请输入名称', e.target.value);
          }
        },
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
  const mergedColumns = columns.map((col: { [propName: string]: unknown }) => {
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

  useEffect(() => {
    // edit({
    //   key: 1,
    //   name: '',
    //   code: '',
    //   renderColor: '#fff'
    // });
    setId(id + 1);
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
      key: id,
      /** 字典项名称 */
      dictName: '',
      /** 字典项编码 */
      code: '',
      /** 背景颜色 */
      renderBgColor: '',
      /** 字体颜色 */
      renderFontColor: '',
    };
    fieldTableData.push(newData);
    /**
  * 为什么直接赋值setData(fieldTableData)不更新,非要写成setData([...fieldTableData])才触发更新
  */
    console.log('newData', newData);

    setFieldTableData([...fieldTableData]);
    // edit(newData);
    console.log('fieldTableData', fieldTableData);
  };
  /**
* 删除一行记录
*/
  const handleDelete = (key) => {
    setFieldTableData(fieldTableData.filter((item) => item.key !== key)); //------
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
    visible: colorPicker.visiable,
    title: colorPicker.title,
    /**
     * 弹框确定按钮回调
     * @param e  点击按钮事件源
     * @param { form-新建表可控表单实例 }
     */
    onOk: (e) => {
      /** 生效缓存颜色 */
      setColor(panelColor);
      // 将生效颜色设置到form.list对应的行中
      const values = form.getFieldsValue();
      const rowIndex = colorPicker.selectRowIndex;
      values.items[rowIndex].renderFontColor = panelColor.fontColor;
      values.items[rowIndex].renderBgColor = panelColor.bgColor;
      form.setFieldsValue({ ...values });
      setColorPicker({ visiable: false, title: '', selectRowIndex: 0 });
    },
    /** 弹框取消按钮回调 */
    onCancel: (e) => {
      console.log({ color });
      /** 取消时复原 */
      setPanelColor(color);
      setColorPicker({ visiable: false, title: '', selectRowIndex: 0 });
    },
    width: 420,
  });
  /**
  * 颜色面板属性设置
  */
  const colorProps = {
    color: colorPicker.title === '字体颜色' ? panelColor.fontColor : panelColor.bgColor,
    modalProps,
    selectRowIndex: colorPicker.selectRowIndex,
    onChangeComplete: (obj) => {
      /** 更新颜色选择器展示颜色 */
      if (colorPicker.title === '字体颜色') {
        setPanelColor(Object.assign({}, panelColor, { fontColor: obj.hex }));
      } else {
        setPanelColor(Object.assign({}, panelColor, { bgColor: obj.hex }));
      }
    },
  };

  /**
  * 第一层弹窗表单配置
  */
  const formProps = {
    form,
    colSpan: 12,
    items: {
      id: {
        /** 表单项属性 */
        itemAttr: {
          className: 'hide'
        },
        /** 表单项包裹组件属性 */
        compAttr: {
          type: 'Input',
        }
      },
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
            console.log('请输入字典名称', e.target.value);
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
    listItems: {
      name: {
        /** 表单项属性 */
        itemAttr: {
          rules: [
            { required: true, message: '请输入字典项名称' },
            { pattern: /^[\u4e00-\u9fa5_a-zA-Z0-9()]+$/, message: '输入字段可以为中文、英文、数字、下划线、括号' },
            { max: 64, message: '最多只能输入64个字符' },
          ],
        },
        /** 表单项包裹组件属性 */
        compAttr: {
          type: 'Input',
          placeholder: '请输入字典项名称',
          onChange: (e, index) => {
            /** 将表格名称转换为汉字首字母拼音 */
            const values = form.getFieldsValue();
            values.items[index].code = PinYin.getCamelChars(values.items[index].name);
            form.setFieldsValue({ ...values });
          }
        }
      },
      code: {
        /** 表单项属性 */
        itemAttr: {
          rules: [
            { required: true, message: '请输入字典项编码!' },
          ]
        },
        /** 表单项包裹组件属性 */
        compAttr: {
          type: 'Input',
          placeholder: '请输入字典项编码',
          onChange: (e) => {
            console.log('请输入字典描述', e.target.value);
          }
        }
      },
      renderFontColor: {
        /** 表单项属性 */
        itemAttr: {
          rules: [],
        },
        /** 表单项包裹组件属性 */
        compAttr: {
          type: 'BasicColor',
          color: color.fontColor,
          placeholder: '请选择字体颜色',
          onClick: (e, selectRowIndex) => {
            openColorPicker({ title: '字体颜色', visiable: true, selectRowIndex });
          },
        }
      },
      renderBgColor: {
        /** 表单项属性 */
        itemAttr: {
          rules: [],
        },
        /** 表单项包裹组件属性 */
        compAttr: {
          type: 'BasicColor',
          color: color.bgColor,
          placeholder: '请选择字体颜色',
          onClick: (e, selectRowIndex) => {
            openColorPicker({ title: '背景颜色', visiable: true, selectRowIndex });
          },
        }
      },
    }
  };

  const getFormConfig = (isSub, formProps) => {
    if (isSub) {
      delete formProps.items;
    }

    return formProps;
  };

  const formConfig = getFormConfig(isSub, formProps);
  // console.log(formConfig);

  return (
    <div className="data-designer">
      <BasicForm {...formConfig} isAddEditRow={isAddEditRow} />
      <BasicColorPicker {...colorProps} />
    </div>
  );
};

export default DictForm;
