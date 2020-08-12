/*
 * @Author: wangph
 * @Date: 2020-07-10 12:00:29
 * @Last Modified by:   wangph
 * @Last Modified time: 2020-07-10 12:00:29
 */

import React, { useEffect, useState } from 'react';
import {
  Table, Button, Space, Tooltip, Popconfirm
} from 'antd';

/** react路由暴露出来的页面跳转方法 */
import { useHistory } from 'react-router-dom';

/** 状态管理方法 */
import { useMappedState, useDispatch } from 'redux-react-hook';

/** 网络请求工具 */
import Http from '@infra/utils/http';

/**  */
/** 共享状态值--表结构分页和树形源数据 */
const mapState = (state) => ({
  structPager: state.structPager,
});
const TableField = (props) => {
  // const {
  //   tableData, scroll, style, title
  // } = props;

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

  const [tableData, setTableData] = useState([]);

  useEffect(() => {
    const getPageData = async () => {
      /** 请求菜单树,表结构的表类型列依赖菜单树数据 */
      // const menuTreeRes = await Http.get('http://localhost:60001/mock/menu.json', {});
      // const tData = listToTree(menuTreeRes.data.result);
      // dispatch({ type: 'setTreeData', treeData: tData });

      /** 请求表结构列表数据 */
      const tableRes = await Http.get('http://localhost:60001/mock/structList.json', {});

      /** 表格数据格式转换-注意setTableData之后不能立刻获取最新值 */
      setTableData(tableRes.data.result.data.map((col) => {
        /** 根据节点的key查找节点完整信息 */
        /** 返回节点的名称 */
        // col.module_id = treeQuery(tData, col.module_id).title;
        // // console.log(col.module_id);
        // /** 将表类型代码转换为文字 */
        // const showText = TableTypeEnum.find((item) => item.value === col.type);
        // col.type = showText ? showText.text : '';
        // /** gmt时间格式转yyyy-MM-dd hh:mm:ss */
        // col.gmt_create = formatGMT(col.gmt_create);
        // col.gmt_modified = formatGMT(col.gmt_modified);
        /** antd table每行记录必需有key字段 */
        col.key = col.id;
        return col;
      }));
    };

    getPageData();

    // window.onresize = function () {
    //   console.log('log');
    // };
  }, []);

  /** 表格属性 */
  const tableProps = {
    treeData: [],
    tableData,
    scroll: {
      /** 必须设置，不然表格列过多时内容会撑开容器,并且不能设置成true,要设置成数字,不然列宽设置无效 */
      x: 200,
      /** 设置之后 ,表格头就会被固定 */
      y: document.documentElement.clientHeight - 200,
    },
    style: {
      margin: '0 20px',
    },
  };

  /** 单元格属性集合 */
  const columns = (() => {
    // /** 操作按钮 */
    // const operButs = [
    //   { text: '编辑', onClick: (row) => { History.push('/EditStruct'); } },
    //   { text: '删除', onClick: (row) => { } },
    //   { text: '复制', onClick: (row) => { } },
    //   { text: '表关系图', onClick: (row) => { } },
    // ];

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
        title: '字段名称',
        dataIndex: 'name',
        width: 140,
      },
      {
        title: '列名',
        dataIndex: 'code',
        width: 140,
      },
      {
        title: '字段类型',
        dataIndex: 'type',
        width: 100,
      },
      {
        title: '数据类型',
        dataIndex: 'module_id',
        width: 140,
      },
      {
        title: '长度',
        dataIndex: 'gmt_create',
        width: 160,
      },
      {
        title: '小数点',
        dataIndex: 'version',
        width: 100
      },
      {
        title: '必填',
        dataIndex: 'tag',
        width: 100
      },
      {
        title: '唯一',
        dataIndex: 'gmt_modified',
        width: 160,
      },
      {
        title: '字典',
        dataIndex: 'modified_by',
        width: 140,
      },
      {
        title: '转换成拼音',
        dataIndex: 'modified_by',
        width: 140,
      },
      {
        title: '校验规则',
        dataIndex: 'modified_by',
        width: 140,
      },
      {
        title: '分类',
        dataIndex: 'modified_by',
        width: 140,
      },
      // {
      //   title: '操作',
      //   dataIndex: 'operCol',
      //   /** fixed属性会引起eslint告警, 需要使用断言 */
      //   fixed: 'right' as const,
      //   /** 每个文本的宽度应设置为80,是通过调整样式得出的合理值 */
      //   width: operButs.length * 80,
      //   render: (row) => {
      //     return operButs.map((item) => {
      //       return (
      //         <Space size="middle" key={item.text}>
      //           {
      //             /** 删除需要弹出二次确认框 */
      //             item.text === '删除'
      //               ? (<Popconfirm placement="topLeft" title={'你确定要删除这条记录吗?'} onConfirm={() => item.onClick(row)} okText="删除" cancelText="取消">
      //                 <Button type="link" >
      //                   {item.text}
      //                 </Button>
      //               </Popconfirm>)

      //               : (<Button type="link" onClick={() => item.onClick(row)}>
      //                 {item.text}
      //               </Button>)
      //           }
      //         </Space>
      //       );
      //     });
      //   },
      // },
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

  const TableHeadMenus = [
    { text: "+字段", onClick: () => {} },
    { text: "+字典字段", onClick: () => {} },
    { text: "+引用字段", onClick: () => {} },
    { text: "+外键字段", onClick: () => {} },
    { text: "删除", onClick: () => {} },
    { text: "保存", onClick: () => {} },
    { text: "隐藏系统字段", onClick: () => {} },
  ];

  return (
    <>
      <section className="table-head-menu">
        <div className="ant-table-title">数据表列表</div>
        <div >
          {TableHeadMenus.map((item) => (<Button key={item.text} type="primary" className="button" onClick={item.onClick}>{item.text}</Button>))}
        </div>
      </section>
      <Table
        bordered
        dataSource={tableProps.tableData}
        columns={columns}
        scroll={tableProps.scroll}
        style={tableProps.style}
        rowClassName="editable-row"
        pagination={{
          showTotal: ((total) => {
            return `共 ${total} 条`;
          }),
          onChange: (page, pageSize) => {
            dispatch({ type: 'triggerStructPager', structPager: { page, pageSize } });
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
    </>
  );
};

export default TableField;
