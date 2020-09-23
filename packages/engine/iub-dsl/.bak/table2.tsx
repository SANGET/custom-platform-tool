import React, { useContext } from 'react';
import { Space, Tag } from 'antd';
import { HyTable, HyTableColumn, HyTableColumnGroup } from '../../../ui';
import { mergeChildren, isReactDOM } from '../utils';

const CC = React.createContext<any>({});
enum AllCompType {
  tag = 'Tag',
  space = 'Space',
  a = 'a'
}

interface CompParser {
  compTag: AllCompType;
  props: any;
  children: any;
}

interface CompParserRes<T = any> {
  comp: React.FC<T>
  staticProps: any;
  dynamicProps: any;
  children: any;
}

const GetUI = (type: AllCompType) => {
  switch (type) {
    case AllCompType.space:
      return Space;
    case AllCompType.tag:
      return Tag;
    case AllCompType.a:
      return (props) => (<a {...props}>{props.children}</a>);
    default:
      return (props) => <div>error</div>;
  }
};

/**
 * 静态属性无法变成动态属性
 * 动态属性可以变成静态属性
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

const tableConf = {
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
        props: {
          color: 'blue'
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
            children: 'Invite {record.lastName}'
          },
          {
            compTag: 'a',
            children: '删除'
          },
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

const columnRenderChildrenParser = (childrenConf) => {
  const { compTag, props, children } = childrenConf;
  return (<a>{children}</a>);
};

const columnRenderParser = (renderConf) => {
  const { compTag, props, children } = renderConf;
  const Comp = compTag === 'Tag' ? Tag : Space;
  /** 结构不一样, 一个是children, 一个是array */

  return (dProps) => {
    console.log(dProps);

    return (<Comp {...props}>{
      children ? children.map((a) => columnRenderChildrenParser(a)) : Array.isArray(dProps) && dProps.map((d) => d)
    }</Comp>);
  };
};

const columnsParser = (columnsConf) => {
  const {
    columnId, title, dataIndex, render
  } = columnsConf;
  return (props) => {
    return <HyTableColumn
      key={columnId} title={title} dataIndex={dataIndex}
      render={render ? columnRenderParser(render) : undefined}
    />;
  };
};

const groupParser = (conf, resolveContext) => {
  const { columnGroupId, group, title } = conf;
  return (dProps) => {
    return <HyTableColumnGroup title={title} key={columnGroupId} >
      {resolveContext(group)}
    </HyTableColumnGroup>;
  };
};

const tableParser = (compInfo) => {
  const { rowKey, columns, columnsSort } = compInfo;
  const columnsComp = {};
  const columnsCompA: any[] = [];
  columns.forEach((i) => {
    columnsComp[i.columnId] = columnsParser(i);
    columnsCompA.push(columnsComp[i.columnId]);
  });
  console.log(columnsCompA);

  // let Temp;
  // const renderComp = columnsSort.map((i) => {
  //   if (typeof i === 'string') {
  //     // return columnsComp[i];
  //     Temp = columnsComp[i];
  //     return <Temp/>;
  //   }
  //   return groupParser(i, (group) => group.map((id) => columnsComp[id]));
  // });

  // console.log(renderComp.map((Comp, i) => <Comp key={i}/>));

  return <HyTable
    rowKey={rowKey}
    dataSource={data}
  >
    {/* {renderComp.map((Comp, i) => <Comp key={i}/>)} */}
    {columnsCompA.map((Comp, i) => Comp(i))}
  </HyTable>;
};

const TableText = (props) => {
  return tableParser(tableConf);
};

/** 这个思维漩涡有问题 */

export default TableText;
