import { IVariableData, IFuncTree, IBaseOption } from './interface';
export const DATA_TYPE: IBaseOption[] = [
  {key: 'String', value: '字符串'},
  {key: 'Number', value: '数字'},
  {key: 'Array', value: '数组'},
  {key: 'Object', value: '对象'},
]

export const TYPE_DATA_TAG = {
  '[object String]': {
    type: '文本',
    color: 'magenta',
  },
  '[object Object]': {
    type: '对象',
    color: 'gold',
  },
  '[object Array]': {
    type: '数组',
    color: 'blue',
  },
  '[object Number]': {
    type: '数字',
    color: 'purple',
  },
  '[object Date]': {
    type: '时间',
    color: '#87d068',
  },
};

export const VARIABLE_DATA: IVariableData[] = [
  {
    title: '页面变量',
    key: '$page',
    props: [
      {
        key: '$page.productName',
        title: '产品名称',
        value: '衣服',
        type: 'String',
      },
      {
        key: '$page.productId',
        title: '产品ID',
        value: '123',
        type: 'String',
      },
    ],
  },
  {
    title: '系统变量',
    key: '$system',
    props: [
      {
        key: '$system.userName',
        title: '用户名',
        value: '张三',
        type: 'String',
      },
    ],
  },
];

export const FUNCTION_TREE: IFuncTree[] = [
  {
    key: '0',
    title: '常用函数',
    children: [
      {
        key: '0-1',
        title: 'SUM',
        name: 'FX.SUM()',
        description: `
FX.SUM函数可以获取一组数值的总和
用法：FX.SUM(数字1,数字2,...)
示例：FX.SUM(语文成绩,数学成绩, 英语成绩)返回三门课程的总分
`,
      },
      {
        key: '0-2',
        title: 'GETUSERNAME',
        name: 'FX.GETUSERNAME()',
        description: `
FX.GETUSERNAME函数可以获取当前用户的昵称
用法：FX.GETUSERNAME()
示例：略
`,
      },
    ],
  },
];
