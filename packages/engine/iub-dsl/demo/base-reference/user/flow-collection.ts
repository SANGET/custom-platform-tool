import { FlowCollection } from '@iub-dsl/definition/flow';

export const flowActions = {
  action1: (msg) => {
    msg.payload = Date.now();
    msg.topic = 'action1';
    console.log('action1');
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
        console.log('action4 async resolve');
        resolve(msg);
      }, 3000);
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

export const flowCollection: FlowCollection = {
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
