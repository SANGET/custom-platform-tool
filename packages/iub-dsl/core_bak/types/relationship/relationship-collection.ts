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
  dataPipeData: {
    subscribe: Subscriber;
    broadcast: Broadcaster;
  };
  componentPipeData: {
    [ID: string]: {
      type: string;
      componentID: string;
      field: string;
    };
  };
}

export default RelationshipsCollection;
