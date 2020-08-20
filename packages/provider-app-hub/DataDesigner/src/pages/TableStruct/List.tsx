/*
 * @Author: wangph
 * @Date: 2020-07-10 12:00:29
 * @Last Modified by:   wangph
 * @Last Modified time: 2020-07-10 12:00:29
 */

import React, { useEffect, useState } from 'react';
import {
  Table, Button, Space, Tooltip, Popconfirm, Modal, Form
} from 'antd';

/** react路由暴露出来的页面跳转方法 */
// import { useHistory } from 'react-router-dom';
import { onNavigate } from 'multiple-page-routing';

/** 状态管理方法 */
import { useMappedState, useDispatch } from 'redux-react-hook';
import Http, { Msg } from '@infra/utils/http';

/** 导出接口 */
import { ReqCopyTableStructRecord } from '@provider-app/data-designer/src/api';

/** 基本表单 */
import BasicForm from '@provider-app/data-designer/src/components/BasicForm';
/**
* 正则表达式
*/
import REG from '@provider-app/data-designer/src/tools/reg';

import PinYin from 'js-pinyin';
import { getModalConfig, randomNum } from '../../tools/mix';

/** 中文转拼音工具 */

/** 中文转换为拼音工具设置选项 */
PinYin.setOptions({
  /** 关闭音调转换功能 */
  checkPolyphone: false,
  /** 将汉字首字母转换为大写拼音 */
  charCase: 0,
});

/** 共享状态值--表结构分页和树形源数据 */
const mapState = (state) => ({
  structPager: state.structPager,
});
const List = (props) => {
  const {
    tableData, scroll, style, title, pagination, queryList, setData
  } = props;

  /** react路由跳转方法,必须定义在react 组件中,跳转到编辑表页面时要用 */
  // const History = useHistory();
  /** 在网络请求工具中,要用dispatch更改共享状态 */
  const dispatch = useDispatch();
  /** structPager显示列表序号的时候要用 treeData 左侧菜单树要用 */
  const { structPager } = useMappedState(mapState);
  const { page, pageSize } = structPager;

  useEffect(() => {

    // window.onresize = function () {
    //   console.log('log');
    // };
  }, []);

  /** 单元格属性集合 */
  const columns = (() => {
    /** 操作按钮 */
    const operButs = [
      {
        text: '编辑',
        onClick: (row) => {
          console.log(row);
          onNavigate({
            type: "PUSH",
            route: '/EditStruct/',
            params: { id: row.id }
          });
          // History.push({ pathname: `/EditStruct/${row.id}`, state: { id: row.id } });
        }
      },
      {
        text: '删除',
        onClick: (row) => {
          Http.delete(`/data/v1/tables/${row.id}`).then((res) => {
            Msg.success('操作成功');
            queryList();
          });
        }
      },
      {
        text: '复制',
        onClick: (row) => {
          setVisible(true);
          const { id } = row;
          /**
          * 复制记录时，数据表名称后面要加五位随机数
          */
          const copyName = `${row.name}_副本_${randomNum(10000, 99999)}`;
          form.setFieldsValue({ id, code: PinYin.getCamelChars(copyName), name: copyName });
        }
      },
      { text: '表关系图', onClick: (row) => { } },
    ];

    const cols = [
      {
        title: '序号',
        dataIndex: 'rowIndex',
        width: 80,
        /** 自定义渲染函数 */
        render: (text, record, index) => {
          // console.log({ text, record, index });
          /** 与后端协商,行号由前端计算 */
          return <span>{(page - 1) * pageSize + index + 1}</span>;
        },
      },
      {
        title: '数据表名称',
        dataIndex: 'name',
        width: 140,
      },
      {
        title: '数据表编码',
        dataIndex: 'code',
        width: 140,
      },
      {
        title: '表类型',
        dataIndex: 'type',
        width: 100,
      },
      {
        title: '归属模块',
        dataIndex: 'moduleId',
        width: 140,
      },
      {
        title: '创建时间',
        dataIndex: 'gmtCreate',
        width: 160,
      },
      // {
      //   title: '版本',
      //   dataIndex: 'version',
      //   width: 100
      // },
      // {
      //   title: '标签',
      //   dataIndex: 'tag',
      //   width: 100
      // },
      {
        title: '最后修改时间',
        dataIndex: 'gmtModified',
        width: 160,
      },
      {
        title: '最后修改人员',
        dataIndex: 'modifiedBy',
        width: 140,
      },
      {
        title: '操作',
        dataIndex: 'operCol',
        /** fixed属性会引起eslint告警, 需要使用断言 */
        fixed: 'right' as const,
        /** 每个文本的宽度应设置为80,是通过调整样式得出的合理值 */
        width: operButs.length * 80,
        render: (row, record, index) => {
          // console.log(row, record, index);
          return operButs.map((item) => {
            return (
              <Space size="middle" key={item.text}>
                {
                  /** 删除需要弹出二次确认框 */
                  item.text === '删除'
                    ? (<Popconfirm placement="topLeft" title={'你确定要删除这条记录吗?'} onConfirm={() => item.onClick(record)} okText="确定" cancelText="取消">
                      <Button type="link" >
                        {item.text}
                      </Button>
                    </Popconfirm>)

                    : (<Button type="link" onClick={() => item.onClick(record)}>
                      {item.text}
                    </Button>)
                }
              </Space>
            );
          });
        },
      },
    ];
    /**  公共设置 */
    return cols.map((col) => {
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
    });
  })();

  const [visible, setVisible] = useState(false);
  /** 创建可控表单实例--复制表单 */
  const [form] = Form.useForm();
  /** 模态框属性 */
  const modalProps = getModalConfig({
    visible,
    title: '复制数据表',
    /**
   * 弹框确定按钮回调
   * @param e  点击按钮事件源
   * @param { form-新建表可控表单实例 }
   */
    onOk: (e) => {
      form
        .validateFields() /** 表单校验 */
        .then((values) => {
          console.log(values, form.getFieldsValue());
          // value;
          /** 新建表数据提交 */
          ReqCopyTableStructRecord(values).then(() => {
            Msg.success('操作成功');
            queryList();
            /** 关闭弹窗 */
            setVisible(false);
          });
        })
        .catch((errorInfo) => {
          /** 校验未通过 */
          console.log(errorInfo);
          Msg.error('表单校验未通过');
        });
      // }
    },
    /** 弹框取消按钮回调 */
    onCancel: (e) => {
      setVisible(false);
      form.resetFields();
    },
    width: 500,
  });

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
    id: {
      /** 表单项属性 */
      itemAttr: {
        label: "id",
        className: 'hide',
      },
      /** 表单项包裹组件属性 */
      compAttr: {
        type: 'Input',
      }
    },
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
        span: 6
      },
      /** 设置表单项宽度 */
      wrapperCol: {
        span: 18
      }
    }
  };
  return (
    <>
      <Table
        bordered
        title={title}
        dataSource={tableData}
        columns={columns}
        scroll={scroll}
        style={style}
        rowClassName="editable-row"
        pagination={{
          showTotal: ((total) => {
            return `共 ${total} 条`;
          }),
          onChange: (page, pageSize) => {
            dispatch({ type: 'triggerStructPager', structPager: { page, pageSize } });
            pagination && pagination(page, pageSize);
          }
        }}

        onRow={(record) => {
          return {
            onDoubleClick: (event) => {
            },
            onMouseLeave: (event) => {
            },
            onContextMenu: (event) => { },
            onMouseEnter: (event) => { },
            onClick: (event) => { }
          };
        }}
      ></Table>
      <Modal {...modalProps}>
        <BasicForm {...formConfig} />
      </Modal>
    </>
  );
};

export default List;
