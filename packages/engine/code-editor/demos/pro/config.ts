import { IBaseOption } from "./interface";

interface IFuncTree {
  key: string;
  title: string;
  name?: string;
  description?: string;
  children?: IFuncTree[]
}

export const DATA_TYPE: IBaseOption[] = [
  { key: 'String', value: '字符串' },
  { key: 'Number', value: '数字' },
  { key: 'Array', value: '数组' },
  { key: 'Object', value: '对象' },
];
export const FUNCTION_TREE: IFuncTree = {
  key: "0",
  title: "HY",
  children: [
    {
      key: "0-1",
      title: "常用",
      children: [
        {
          key: "0-1-1",
          title: "中控台输出日志",
          name: "HY.info('xxxx');",
          description: `
HY.info(params);
功能: 在控制台打印info输出日志
@params 类型为字符串或者对象
使用: HY.info("hello, world")
`,
        }, {
          key: "0-1-2",
          title: "错误提醒",
          name: "HY.Modal.warning({title: 'xxxx'});",
          description: `
HY.Modal.warning(params);
功能: 在控制台打印info输出日志
@params object {
title: string;  标题
content: string | ReactNode; 内容
cancelText: string; 取消按钮文字
okText: string; 确认按钮文字
width: string | number; 宽度
zIndex: number; 设置 Modal 的 z-index
maskClosable: boolean; 点击蒙层是否允许关闭
onCancel: function(close); 取消回调，参数为关闭函数
onOk: 点击确定回调
}
使用:
HY.Modal.warning({
title: "测试警告",
content: "内容",
onOk: function() { console.log("onOk") }
})
`
        },
        {
          key: "0-1-3",
          title: "求和",
          name: "HY.R.add(1,2);",
          description: `
HY.R.add(number1, number2, ...numbern);
功能: 求和
@params number1
使用: HY.R.add(1,2)
`,
        }
      ]
    }
  ]
};
