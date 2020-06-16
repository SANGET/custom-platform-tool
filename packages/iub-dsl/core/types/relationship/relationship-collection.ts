import TriggerEvents from "../actions/events";

interface Trigger {
  field: string; // tableUUid
  when: TriggerEvents | TriggerEvents[];
  how: {
    type: string; // 'actionRef'
    /** action ref id */
    actionID: string;
  };
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
