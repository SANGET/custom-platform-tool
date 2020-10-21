import IUBDSLParser from './IUBDSLParser';
import IUBDSLRuntimeContainer from './IUBDSLRuntimeContainer';

function dependencyInspect(): boolean {
  return true;
}

export default IUBDSLParser;

export {
  dependencyInspect,
  IUBDSLParser,
  IUBDSLRuntimeContainer
};

/**
 * 整理思路 2020-10-09
 * 1. 解析、运行 、「预备」 「可以是个伪命题都在同一时刻」 TODO: 更新props
 * 2. schemas: 作用, 基础的页面store. 职能, 获取和修改store
 * 3. widget:
 *  1. 生成实际渲染的结构
 *  2. 赋值props
 * 4. 事件/动作/流程:
 *  1.事件包装器, 标准化事件执行上下文
 *  2. 流程执行上下文
 *  3. 单个动作执行上下文
 *
 */

// TODO: 流程控制 这问题?
// 联动: 数据结构+数据收集器 --> 查到数据 --> 按照数据结构写入数据
// 库表操作: 数据结构+数据收集器+数据收集条件  --> CURD操作 --> 结果
// 编码/拼接:  数据结构+数据拼接+[后台查询结果]
// 校验/关联: 校验条件 + 改变数据 「框架还是自己实现??//标准是什么??」
// 搜索和定位: 条件+数据收集

// 获取和改变IUB运行时状态、UUID数据结构转换成元数据映射结构
// 数据收集器
// 真实运行的动作
// 真实渲染的组件

// 页面事件: 加载时onMount「when + 特殊的when」 + 额外动作「conf的Action」 + 真实的动作「actions、动作类型」 + 条件「action Condition」
// 配置弹窗: onClick + open(xxx)「action」 + InputData「struct | condition |  config」 + dataSubscribe
// 联动配置: dataChange + 数据收集 + 查询「action + condition」 + 作用的UUID ————> 视图改变
// 控件校验: dataChange +「when + 特殊的when」 + 校验「validAction」 +  反馈的action「弹窗」/ changeConf/ changeProps
// 控件格式化: dataShow + filter
// 属性/显隐: dataChange + 「when + 特殊的when」+ action「更改props」
// TODO: 多个事件的顺序和流程~·~!!
// TODO: 模板
//
// valueChange --> dospatch == 运行容器 发现 data-1 改变 ..... 广播 产生的影响
//
//
//
//
//
//
// onMount获取表单数据、联动获取的数据、字典数据
// onClick 打开弹窗、 跨页面数据  :: 延后
// dataChange 数据收集
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
// 30秒总结一个故事
// 140字总结一整条链路
// 概述模块关系「你负责的模块和别人的模块」的内容
// 先骗过自己
