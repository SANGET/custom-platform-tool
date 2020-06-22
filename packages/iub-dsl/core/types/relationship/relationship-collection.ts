import TriggerEvents from "../actions/events";

interface Trigger {
  when: TriggerEvents;
  how: {
    type: 'actionRef';
    /** action ref id */
    actionID: string;
  };
}

/**
 * 数据关系 - 订阅字段变化
 */
interface Subscriber {
  [componentBindFieldUUID: string]: ({
    /** componentBindFieldUUID */
    target: string;
    trigger?: Trigger;
  })[];
}

/**
 * 数据关系 - 订阅字段变化
 */
interface Broadcaster {
  [componentBindFieldUUID: string]: ({
    target: string;
    trigger?: Trigger;
  })[];
}

interface RelationshipsCollection {
  dataChanged?: {
    [relationId: string]: {
      broadcaster: {
        [componentUuid: string]: {
          [targetComponentUuid: string]: Trigger;
        };
      };
      targetFlowChain: {
        type: string;
        chain: string; // 流程控制链
      };
      flowConditionCollection: {
        [exp: string]: {
          type: string;
          handler?: string;
        };
      };
    };
  };
  runAction?: {};
}

export default RelationshipsCollection;
