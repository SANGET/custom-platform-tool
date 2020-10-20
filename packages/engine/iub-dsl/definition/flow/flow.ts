import { CommonCondition } from "..";

/**
 * 条件:
 * 一个流程的执行有条件
 * 动作的执行有条件
 * 动作执行完的不同出口有条件
 * 线:
 * 一个出口有多条输出的线
 * 每条线指向的动作是哪个
 */

const flowActions = {
  action1: (msg) => {
    msg.payload = Date.now();
    msg.topic = 'action1';
    return msg;
  },
  action2: (msg) => {
    msg.payload = '2f6df13a.9a2e1e';
    return msg;
  },
  action3: (msg) => {
    console.log('action3');
    return msg;
  },
  action4: (msg) => {
    console.log('action4 async');

    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(msg);
      }, 2000);
    });
  },
  action5: (msg) => {
    console.log('action5 switch');
    msg.payload = Date.now().toFixed(2) + 0;
    return msg;
  },
  action6: (msg) => {
    console.log('action6 flow end');
    return msg;
  },
  action7: (msg) => {
    console.log('action7');
    return msg;
  },
  action8: (msg) => {
    console.log('action8');
    return msg;
  },
  action9: (msg) => {
    console.log('action9 flow end');
    return msg;
  },
};

const flowCollection: FlowCollection = {
  flow1: {
    id: 'flow1',
    actionId: 'action1',
    flowOutCondition: [],
    flowOut: [['flow3', 'flow7', 'flow5']]
  },
  flow2: {
    id: 'flow2',
    actionId: 'action2',
    flowOutCondition: [],
    flowOut: [['flow5', 'flow7']]
  },
  flow3: {
    id: 'flow3',
    actionId: 'action3',
    flowOutCondition: [],
    flowOut: [['flow4']]
  },
  flow4: {
    id: 'flow4',
    actionId: 'action4',
    flowOutCondition: [],
    flowOut: [['flow6', 'flow7']]
  },
  flow5: {
    id: 'flow5',
    actionId: 'action5',
    flowOutCondition: [],
    flowOut: [
      ['flow4'],
      ['flow8', 'flow9']
    ]
  },
  flow6: {
    id: 'flow6',
    actionId: 'action6',
    flowOutCondition: [],
    flowOut: []
  },
  flow7: {
    id: 'flow7',
    actionId: 'action7',
    flowOutCondition: [],
    flowOut: [['flow8']]
  },
  flow8: {
    id: 'flow8',
    actionId: 'action8',
    flowOutCondition: [],
    flowOut: [['flow9']]
  },
  flow9: {
    id: 'flow9',
    actionId: 'action9',
    flowOutCondition: [],
    flowOut: []
  },
};

export interface FlowCollection {
  [flowItemId: string]: FlowItemInfo
}

/**
 * 规则: 「参考Node-Red」
 * 1. 流程开始仅有一个入口和一个出口. 每个流程节点仅有一个入口.
 * 2. 一个出口可以有多条线连接到不同入口.
 * 3. 特殊的流程控制有多个出口.
 * 理解:
 * 1. 不同的FlowItemInfo 看作不同的入口
 * 2. flowOutCondition 和 flowOut 的每一项一一对应, 条件控制该出口是否可用 「特殊的流控有多个出口, 如,prmoise.All, switchCase」
 * 3. FlowOutItemWires 一个出口所连接的下一项流程节点的id「FlowItemInfoId」
 * @extends CommonCondition 该项流程执行的条件
 */
export interface FlowItemInfo extends CommonCondition{
  /** flowItemId */
  id: string;
  /** 该项流程执行的动作 */
  actionId: string;
  /** 条件控制某个出口是否可以使用 */
  flowOutCondition: CommonCondition[];
  /** 流程的出口个数 */
  flowOut: FlowOutItemWires[];
}

/**
 * 每个出口的连接线ID
 * @string 连接线指向下一项流程的Id[flowItemInfoId]
 */
export type FlowOutItemWires = string[]
