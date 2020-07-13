import IUBDSLParser from './IUBDSLParser';

function dependencyInspect(): boolean {
  return true;
}

export default IUBDSLParser;

export {
  dependencyInspect
};

interface Props {
  [str: string]: unknown;
}

interface IUB {
  actionsCollection: {
    [actionID: string]: {
      type: 'actionExpression', // 代码段的嵌入
      /**
       * 有没有特殊的执行时机、执行的条件、执行内容
       */
      when?: string; // 描述运行时某些特殊的时机
      condition?: string; // 描述运行这动作的条件
      expression: string; // 运行的函数表达式
      variable?: string; // 运行时的临时变量  是否需要,还是一套默认规则
    }
  },
  // 一个控件的一个事件对应不同的动作「没有任何联系」
  // 数据收集器[定位、搜索]  (对外的标准)
  flowChainCollection: {
    [flowId: string]: {
      type: 'flowControl',
      //  数据结构~~~
      // 配置的互斥关系
      // 配置如何影响流程
      // TODO: 生成者如何知道? 如果能知道,那么action不会是独立的
      // 串
      chain: `
        var actionId1 = @(actions).actionID1(?runtimeContext)
        pipe(
          @(actions).actionID2(runtimeContext, #actionId1),
          @(actions).actionID3(),
          @(actions).actionID4()
        )
      `,
      chain2: `
        
      `
    }
  },
  dataRule: {
    [id: string]: {
      // when?
      condition: string; // 判断?
      expression: string; // 执行?
      // 时机: 监测数据的改变
      change: {
        isShow: '变量1',
        isRead: '变量2',
        isRequery: '变量3',
        // 数据校验~
        // 数据过滤显示
        // 数据脱敏、显示值、实际值「数据结构」
        // 样式关系: 静态/变量?
        // click - open -- waitReturn -- subscribe -- do it
      }
      // 改变的数据?
      // 监测数据--》作用数据? 如何知道作用的是啥?  描述一遍PROPS?
      // [targetCompID: string]: Props
    }
  }
}

const a = {
  onClick: () => {
    // 1
    // 2
    // 3\4
    // 5
  }
};
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
// 控件校验: dataChange+ 「when + 特殊的when」 + 校验「validAction」 +  反馈的action「弹窗」/ changeConf/ changeProps
// 控件格式化: dataShow + filter
// 属性/显隐: dataChange + 「when + 特殊的when」+ action「更改props」
// TODO: 多个事件的顺序和流程~·~!!
// TODO: 模板
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
