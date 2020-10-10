import { WidgetEvents, ActionTypes, ActionRefType } from "@iub-dsl/definition/events/events";
import { normalInputChange } from ".";

export const eventPropsHandle = (key, conf, context) => {
  if (key === 'actions') {
    return eventParser(conf, context).eventParseRes;
  }
  return false;
};

const eventWrap = () => {

};
type Events = keyof WidgetEvents
export const eventParser = (events: WidgetEvents, context) => {
  const event = Object.keys(events);
  const eventParseRes = {};
  // const eventParseRes: any[] = [];
  let eventConf: ActionTypes;
  event.forEach((eKey) => {
    eventConf = events[eKey];
    if (eventConf.type === 'actionRef') {
      // eventParseRes.push(eventParserScheduler(eKey as Events, eventConf));
      eventParseRes[eKey] = eventParserScheduler(eKey as Events, eventConf, context);
    } else {
      // eventParseRes.push(eventConf);
      eventParseRes[eKey] = eventConf;
    }
  });

  return {
    event,
    eventParseRes
  };
};

const getOnChangeHandle = (compTag: string) => {
  switch (compTag) {
    case 'NormalInput':
      return normalInputChange;
    default:
      return () => {};
  }
};

const eventParserScheduler = (eventKey: Events, eventConf: ActionRefType, context) => {
  console.log(eventConf);
  // TODO 有问题
  const { compTag } = context;
  switch (eventKey) {
    case 'onChange':
      return {
        type: 'widgetEvent',
        handle: getOnChangeHandle(compTag),
        conf: eventConf
      };
    default:
      console.error('未处理的事件');
      return () => {};
  }
};
