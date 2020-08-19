/*
 * @Author: wangph
 * @Date: 2020-07-10 12:00:29
 * @Last Modified by:   wangph
 * @Last Modified time: 2020-07-10 12:00:29
 */

import React, { useEffect, useCallback } from 'react';
import {
  Table, Button, Space, Tooltip, Popconfirm
} from 'antd';

/** react路由暴露出来的页面跳转方法 */
import { useHistory } from 'react-router-dom';

/** 状态管理方法 */
import { useMappedState, useDispatch } from 'redux-react-hook';
import Http, { Msg } from '@infra/utils/http';

/** 共享状态值--表结构分页和树形源数据 */
const mapState = (state) => ({
  structPager: state.structPager,
});
const List = (props) => {
  const {
    tableData, scroll, style, title, pagination, queryList, setData
  } = props;

  /** react路由跳转方法,必须定义在react 组件中,跳转到编辑表页面时要用 */
  const History = useHistory();
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
          History.push({ pathname: `/EditStruct/${row.id}`, state: { id: row.id } });
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
          row.name = `复制${row.name}`;
          setData([row, ...tableData]);
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

  return (
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
  );
};

export default List;
