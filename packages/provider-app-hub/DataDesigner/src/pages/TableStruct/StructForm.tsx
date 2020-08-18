import React, { useState, useEffect } from 'react';

/** 导出基础选择框及其枚举数据 */
/** 内聚和单一职责,有时候令人感觉边界不清,枚举值和选择框组件放在一起貌似也不错 */
import { TableTypeEnum } from '@provider-app/data-designer/src/tools/constant';

/** 基本表单 */
import BasicForm from '@provider-app/data-designer/src/components/BasicForm';
/** 中文转拼音工具 */
import PinYin from 'js-pinyin';

/** 中文转换为拼音工具设置选项 */
PinYin.setOptions({
  /** 关闭音调转换功能 */
  checkPolyphone: false,
  /** 将汉字首字母转换为大写拼音 */
  charCase: 0,
});

const StructForm = ({
  form, treeData, ...rest
}) => {
  /** 表单初始化 */
  form.setFieldsValue({
    /** 是 数据表名称  */
    name: '',
    /** 是 数据表编码 */
    code: '',
    /** 是 表类型 */
    type: '',
    /** 是 归属模块 */
    moduleId: '',
    /** 否 业务字段类型，SYS(系统元数据)BIS(业务元数据)，用户填写的表默认BIS即可 */
    species: 'BIS',
    /** 否 备注  */
    description: '',
    /** 否 附属表对象,如果表类型是附属表，则必填 */
    auxTable: {},
    /** 表类型是附属表时,主表表名必填 */
    mainTableCode: '',
    /** 否 树型表对象,如果表类型是树型表，则必填 */
    treeTable: {},
    /** 如果表类型是树型表，则必填 最大层级树 2-15 */
    maxLevel: '',
    /** 否 引用表对象集合 */
    references: [],
    /** 否 外键对象集合 */
    foreign_keys: [],
    /** 否 列对象集合 */
    columns: [],
  });

  // console.log({ treeData});
  /** 树形属性配置 */
  const tProps = {
    treeData,
    value: '',
    placeholder: '请选择父级',
    style: {
      width: '100%'
    }
  };

  /**
  * 表类型联动对象
  */
  const refShowInit = { normalTable: '', tree: 'hide', auxTable: 'hide' };
  /**
  * 表类型联动状态设置
  */
  const [refShow, setRefShow] = useState(refShowInit);
  /**
  *  联动显示
  */
  const onTypeChange = () => {
    const type = form.getFieldValue('typeA');
    const showObj = Object.keys(refShowInit).reduce((prev, key) => {
      prev[key] = key === type ? '' : 'hide';
      return prev;
    }, {});
    // console.log({ showObj });
    setRefShow(showObj as { normalTable: string; tree: string; auxTable: string; });
  };

  /**
  * 表单项配置
  */
  const items = {
    name: {
      /** 表单项属性 */
      itemAttr: {
        label: "数据表名称",
        rules: [
          { required: true, message: '请输入数据表名称!' },
          { pattern: /^[\u4e00-\u9fa5_a-zA-Z0-9()]+$/, message: '输入字段可以为中文、英文、数字、下划线、括号' },
          { max: 64, message: '最多只能输入64个字符' },
        ],
      },
      /** 表单项包裹组件属性 */
      compAttr: {
        type: 'Input',
        placeholder: '最多可输入64个字符，名称唯一。输入字段可以为中文、英文、数字、下划线、括号',
        onChange: (e) => {
          /** 将表格名称转换为汉字首字母拼音 */
          form.setFieldsValue({ code: PinYin.getCamelChars(form.getFieldValue('name')) });
        }
      }
    },
    code: {
      itemAttr: {
        label: "数据表编码",
        rules: [{ required: true, message: '请输入数据表编码!' }],
      },
      compAttr: {
        type: 'Input'
      }
    },
    typeA: {
      itemAttr: {
        label: "表类型"
      },
      compAttr: {
        type: 'BasicSelect',
        enum: TableTypeEnum,
        onChange: () => onTypeChange()
      }
    },
    moduleId: {
      itemAttr: {
        label: "归属模块",
        className: refShow.normalTable,
      },
      compAttr: {
        type: 'TreeSelect',
        enum: TableTypeEnum,
        ...tProps
      }
    },
    maxLevel: {
      itemAttr: {
        label: "最大层级数",
        className: refShow.tree,
        /** 表类型为树表时关联必填 */
        rules: [{ required: refShow.tree === '', message: '请输入最大层级数!' }],
      },
      compAttr: {
        type: 'InputNumber',
        placeholder: '最大层级不能超过5级'
      }
    },
    mainTableCode: {
      itemAttr: {
        label: "主表",
        className: refShow.auxTable,
        /** 表类型为附属表时关联必填 */
        rules: [{ required: refShow.auxTable === '', message: '请输入主表!' }],
      },
      compAttr: {
        type: 'Input',
        placeholder: '请输入主表'
      }
    },
    // tag: {
    //   itemAttr: {
    //     label: "标签"
    //   },
    //   compAttr: {
    //     type: 'Input',
    //   }
    // },
    description: {
      itemAttr: {
        name: "description",
        label: "备注",
        rules: [
          { max: 100, message: '最多只能输入100个中文字符' },
        ],
      },
      compAttr: {
        type: 'TextArea',
        placeholder: '最多支持100个中文字符的输入',
        autoSize: { minRows: 4, maxRows: 6 }
      }
    }
  };
  /**
   * 表单配置
   */
  const formConfig = {
    form,
    items,
    colSpan: 24,
    layout: 'horizontal',
    /** 表单项label和content的宽度 */
    formItemLayout: {
      /** 满栅格是24, 设置label标签宽度 */
      labelCol: {
        span: 4
      },
      /** 设置表单项宽度 */
      wrapperCol: {
        span: 20
      }
    }
  };

  return (
    <BasicForm {...formConfig} />
  );
};

export default StructForm;
