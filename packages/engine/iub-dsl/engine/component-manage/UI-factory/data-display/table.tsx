import React, { useContext, useMemo } from 'react';
import { Space, Tag } from 'antd';
import ReactDOM from 'react-dom';
import { reject } from 'lodash';
// import { HyTable, HyTableColumn, HyTableColumnGroup } from '../../../ui';
import { mergeChildren } from '../utils';
import { useAsyncMemo } from '../../../utils/use-async-memo';

const CC = React.createContext<any>({});

/**
 * 静态属性无法变成动态属性
 * 动态属性可以变成静态属性
 * 真实的组件, 绑定对应的props
 * 接口反射, 反射不认识的东西出去
 * 1. 解析属性
 * 2. 对接标准, 真实组件
 * 3. 生成组件「函数调用, jsx方式, 传值, 穿透, 递归」
 *
 * 本质、目的
 * 1. 配置解析, props
 * 2. 代理props, useMemo,监听和代理 「递归?」
 */

const data = [
  {
    key: '1',
    firstName: 'John',
    lastName: 'Brown',
    age: 32,
    address: 'New York No. 1 Lake Park',
    tags: ['nice', 'developer'],
  },
  {
    key: '2',
    firstName: 'Jim',
    lastName: 'Green',
    age: 42,
    address: 'London No. 1 Lake Park',
    tags: ['loser'],
  },
  {
    key: '3',
    firstName: 'Joe',
    lastName: 'Black',
    age: 32,
    address: 'Sidney No. 1 Lake Park',
    tags: ['cool', 'teacher'],
  },
];

interface HyColumnStaticProps {
  columnId: string;
  dataIndex: string;
}

interface HyColumnDynamicProps {
  title: string;
  render?: any
}

type HyColumnProps = HyColumnStaticProps & HyColumnDynamicProps

interface HyColumnGroupStaticProps {
  children: React.ReactNode | React.ReactNode[]; // 编译和渲染都可以用
  columnGroupId: string;
  group: string[];
}
interface HyColumnGroupDynaimcProps {
  children: React.ReactNode | React.ReactNode[]; // 编译和渲染都可以用

  title: string;
}
type HyColumnGroupProps = HyColumnGroupStaticProps & HyColumnGroupDynaimcProps

type HyColumnSort = HyColumnGroupProps | string;

interface HyTableProps<D = any> {
  rowKey: string;
  dataSource: D
  columns: HyColumnProps[];
  columnsSort: HyColumnSort[];
}

const tableConf: HyTableProps = {
  rowKey: 'key',
  dataSource: [],
  columns: [
    {
      columnId: 'column1',
      title: 'First Name',
      dataIndex: 'firstName',
    },
    {
      columnId: 'column2',
      title: 'Last Name',
      dataIndex: 'lastName',
    },
    {
      columnId: 'column3',
      title: 'Age',
      dataIndex: 'age',
    },
    {
      columnId: 'column4',
      title: 'Address',
      dataIndex: 'address',
    },
    {
      columnId: 'column5',
      title: 'Tags',
      dataIndex: 'tags',
      render: {
        compTag: 'Tag',
        for: 'tags.length',
        props: {
          color: {
            type: 'condition',
            value: ['blue', 'red']
          }
        }
      }
    },
    {
      columnId: 'column6',
      title: 'Action',
      dataIndex: 'action',
      render: {
        compTag: 'Space',
        props: {
          size: 'middle'
        },
        children: [
          {
            compTag: 'a',
            children: ['Invite {record.lastName}']
          },
          {
            compTag: 'a',
            children: ['删除']
          }
        ]
      }
    }
  ],
  columnsSort: [
    {
      columnGroupId: 'Name',
      group: ['column1', 'column2'],
      title: 'Name'
    },
    'column3',
    'column4',
    'column5',
  ]
};

const CFuntion = (props) => {
  const WrappedComponent = (p) => (<div></div>);
  // 拿真实的上下文
  const ContextToUse = useMemo(() => {
    return React.createContext({});
  }, []);

  const contextValue = useContext(ContextToUse);

  /** 断言 */

  // 新的选择数据的选择器~~!!
  const childPropsSelector = useMemo(() => {
    // return createChildSelector(store);
  }, ['store']);

  // ! 获取 最新的 subscription, notifyNestedSubs
  const [subscription, notifyNestedSubs] = useMemo(() => {
    // const subscription = new Subscription(
    //   store,
    //   didStoreComeFromProps ? null : contextValue.subscription
    // )

    // return [subscription, notifyNestedSubs]
  }, ['store, didStoreComeFromProps, contextValue']);

  const overriddenContextValue = useMemo(() => {
    return {
      ...contextValue,
      subscription
    };
  }, ['didStoreComeFromProps', contextValue, subscription]);

  // !! 获取实际的props
  const actualChildProps = useMemo(() => {
    // return childPropsSelector(store.getState(), wrapperProps)
  }, ['store, previousStateUpdateResult, wrapperProps']);

  // ! 重新订阅更新

  const renderedWrappedComponent = useMemo(
    () => (
      <WrappedComponent
        {...actualChildProps}
        ref={'reactReduxForwardedRef'}
      />
    ),
    ['reactReduxForwardedRef', WrappedComponent, actualChildProps]
  );
};

// 模拟
const canUseStore = (key) => ['title'].includes(key);
const getState = (key) => key;

const TableFactory = (conf = tableConf) => {
  const { rowKey, columns, columnsSort } = conf;

  const table = (
    <HyTable
      key={'hyTable'}
      rowKey={rowKey}
      dataSource={data}
    >
    </HyTable>
  );
  // const renderProps = useAsyncMemo(() => {
  //   const columnId = 'columnId';
  //   const title = 'columnId';
  //   const dataIndex = 'columnId';
  //   const pp = { columnId, title, dataIndex };
  //   return new Promise((resolve) => {
  //     setTimeout(() => {
  //       resolve(pp);
  //     }, 1000);
  //   });
  // }, []);
  // console.log(renderProps);

  const columnsComp = columns.map((c) => {
    const {
      columnId, render, title, dataIndex
    } = c;

    const renderHyTableColumnProps = { columnId, title, dataIndex };
    return <HyTableColumn
      key={columnId}
      title={title}
      dataIndex={dataIndex}
    />;
  });
  return table;
};

export default TableFactory;
