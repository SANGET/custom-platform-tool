import React, { useState, useEffect } from 'react';

/** 导出基础选择框及其枚举数据 */
/** 内聚和单一职责,有时候令人感觉边界不清,枚举值和选择框组件放在一起貌似也不错 */
import { TableTypeEnum } from '@provider-app/data-designer/src/tools/constant';

/** 基本表单 */
import BasicForm from '@provider-app/data-designer/src/components/BasicForm';

/**
* 正则表达式
*/
import REG from '@provider-app/data-designer/src/tools/reg';
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
  form, treeData, queryList, ...rest
}) => {
  // console.log({ treeData});
  /** 树形属性配置 */
  const tProps = {
    treeData,
    value: '',
    placeholder: '',
    style: { width: '100%' }
  };

  /**
  * 表类型联动对象
  */
  const refShowInit = { normalTable: 'show', tree: 'hide', auxTable: 'hide' };
  /**
  * 表类型联动状态设置
  */
  const [refShow, setRefShow] = useState(refShowInit);
  /**
  *  联动显示
  */
  const onTypeChange = () => {
    const type = form.getFieldValue('type');
    const showObj = Object.keys(refShowInit).reduce((prev, key) => {
      prev[key] = key === type ? 'show' : 'hide';
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
          { pattern: REG.znEnNum, message: '输入字段可以为中文、英文、数字、下划线、括号' },
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
        type: 'Input',
        placeholder: '会自动将中文转为首字母大写英文,可手动修改'
      }
    },
    type: {
      itemAttr: {
        label: "表类型",
        rules: [{ required: true, message: '请选择表类型!' }],
      },
      compAttr: {
        type: 'BasicSelect',
        enum: TableTypeEnum,
        onChange: () => onTypeChange()
      }
    },
    maxLevel: {
      itemAttr: {
        label: "最大层级数",
        className: refShow.tree,
        /** 表类型为树表时关联必填 */
        rules: [
          /** required设置条件必须未生效,要展示必填项前面的红色*,需要把这一项设置为true */
          { required: refShow.tree === 'show' },
          ({ getFieldValue }) => ({
            validator(rule, value) {
              /** 当表类型不是附属表时,不对提交内容做校验 */
              if (refShow.tree === 'hide') {
                return Promise.resolve();
              }
              /** 这里如果不写成new Error,会触发eslint告警 */
              if (value === '' || value === undefined) {
                return Promise.reject(new Error('请输入最大层级数'));
              }
              if (!REG.plusInt.test(value)) {
                return Promise.reject(new Error('必须是正整数'));
              }
              if (value > 5) {
                return Promise.reject(new Error('最大层级数不能超过5级'));
              }
              return Promise.resolve();
            },
          }),
        ],
      },
      compAttr: {
        type: 'InputNumber',
        placeholder: '须为正整数,最大层级不超过5级'
      }
    },
    mainTableCode: {
      itemAttr: {
        label: "主表",
        className: refShow.auxTable,
        /** 表类型为附属表时关联必填 */
        rules: [{ required: refShow.auxTable === 'show', message: '请输入主表!' }],
      },
      compAttr: {
        type: 'Input',
        placeholder: '请输入主表',
        onFocus: () => {
          console.log({});
        }
      }
    },
    moduleId: {
      itemAttr: {
        label: "归属模块",
        className: refShow.normalTable,
        rules: [{ required: true, message: '请选择归属模块' }],
      },
      compAttr: {
        type: 'TreeSelect',
        enum: TableTypeEnum,
        ...tProps
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
          { max: 100, message: '最多只能输入100个字' },
        ],
      },
      compAttr: {
        type: 'TextArea',
        placeholder: '最多只能输入100个字',
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
