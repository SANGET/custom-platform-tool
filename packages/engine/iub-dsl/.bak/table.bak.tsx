import React, { useContext } from 'react';
import { Space, Tag } from 'antd';
import ReactDOM from 'react-dom';
import { HyTable, HyTableColumn, HyTableColumnGroup } from '../../../ui';
import { mergeChildren } from '../utils';

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

/**
  * react-redux简记
  * 1. context, 为他的context
  * 2. useSelect
  *   1. store或subscription改变, 触发副作用, 好像用于强制更新checkForUpdates
  *   2. 默认从redux.store中提取数据
  *   3. 记录了4个东西, latestSubscriptionCallbackError、latestSelector、latestStoreState、latestSelectedState
  * 3. useDispatch就是store的dispatch
  * 4. Provider
  *   1. contextValue传入react的context, useMemo监听store变化
  *   2. useEffect监听contextValue, previousState变化, previousState !== store.getState()  更新视图subscription.notifyNestedSubs()
  * 5. connectHOC模式
  * 1. actual Child Props // 实际的子props
  * 2. overriddenContextValue覆盖上下文的值
  * 3. ContextToUse // 使用得上下文
  ¥ 4. const Connect = pure ? React.memo(ConnectFunction) : ConnectFunction // 纯函数模式
  *
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
      // render={(tags) => (
      //   <>
      //     {tags.map((tag) => (
      //       <Tag color="blue" key={tag}>
      //         {tag}
      //       </Tag>
      //     ))}
      //   </>
      // )}
    },
    {
      columnId: 'column6',
      title: 'Action',
      dataIndex: 'action',
      // render={(text, record: any) => (
      //   <Space size="middle">
      //     <a>Invite {record.lastName}</a>
      //     <a>Delete</a>
      //   </Space>
      // )}
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

const TableFactory = () => {
  const compArr = tableColumnParser(tableConf);
  console.log(compArr);

  return (
    <HyTable
      rowKey='key'
      dataSource={data}
    >
      {compArr.map((Comp, i) => {
        // if (typeof Comp === 'function') {
        // console.log(<Comp />); // 又包装了一层
        // console.log(React.createElement(Comp));

        // console.log(Comp());
        // const Temp = (props) => (<>{Comp(props)}</>);
        // console.log(<Temp />);

        // console.log(<HyTableColumn
        //   title={'title'}
        //   dataIndex={'dataIndex'}
        //   key={'columnId'}
        //   render={(text, record, index) => {
        //     return `${text}    ${JSON.stringify('dynamicProps')}`;
        //   }}
        // />);

        return <Comp
          dataIndex={'dataIndex'}
          key={'columnId'}
          render={(text, record, index) => {
            return `${text}    ${JSON.stringify('dynamicProps')}`;
          }}
        />;
        // }
        // return Comp.comp({
        //   children: Comp.children.map((c) => c(i))
        // });
        // console.log(<Comp />);
      })}
    </HyTable>
  );
};

// useMemo?
const tableColumnParser = (conf: HyTableProps) => {
  const { columns, columnsSort } = conf;
  const columnsId: string[] = [];
  const columnsHandle = (info: HyColumnProps) => {
    columnsId.push(info.columnId);
    return genColumnFactory(info);
  };
  const columnsComp = {};
  columns.forEach((item) => columnsComp[item.columnId] = columnsHandle(item));
  console.log(columnsComp);

  return columnsSort.map((sortInfo) => {
    if (typeof sortInfo === 'string') {
      return columnsComp[sortInfo] || '';
    }
    const children: any[] = sortInfo.group.map((columnId) => columnsComp[columnId]);
    return {
      comp: genColumnGroupFactory({
        ...sortInfo,
      }),
      children
    };
  }).filter((a) => a);
};

const genColumnFactory = (staticProps: HyColumnProps) => {
  const { title, dataIndex, columnId } = staticProps;
  return (dynamicProps: HyColumnDynamicProps) => {
    return (
      <HyTableColumn
        title={title}
        dataIndex={dataIndex}
        key={columnId}
        render={(text, record, index) => {
          return `${text}    ${JSON.stringify(dynamicProps)}`;
        }}
      />
    );
  };
};

const genColumnGroupFactory = (staticProps: HyColumnGroupProps) => {
  const { title, columnGroupId, children } = staticProps;
  return (dynamicProps: HyColumnGroupDynaimcProps) => {
    const { children: dynmaicChildren } = dynamicProps;

    return (
      <HyTableColumnGroup
        key={columnGroupId}
        title={title}
        children={mergeChildren(children, dynmaicChildren)}
      />
    );
  };
};

export default TableFactory;
