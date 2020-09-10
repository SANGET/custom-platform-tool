import { getLocationType } from "./action-test";

export const conditionP = (params) => {
  return (runtimeContext) => {
    return true;
  };
};

export const whenP = (params) => {
  return (runtimeContext) => {
    return true;
  };
};

// onChange
// action ?? 流程?? 这个应该是怎样的
export const funcP = (params, actionId) => {
  return (IUBRuntimeContext, eventCtx) => {
    const { stateManage: { setState, getState } } = IUBRuntimeContext;
    const { eventType, value, key } = eventCtx;
    switch (eventType) {
      case 'inputChange':
      case 'slectChange':
        setState({ [key]: value });
        break;
      case 'inputClick':
        // 打开窗口
        setState({ [key]: true });
        break;
      case 'tableColClick':
        // 表格行点击
        setState({ [key]: value });

        // 如何获取和转换
        setState({ dId3: value.foucsData.sdId1 || '' }); // null 会有问题
        break;

      case 'addBtn':
        const state = getState({
          dId1: 'dId1',
          dId2: 'dId3',
          dId3: 'dId3',
        });
        console.log(state);

        break;
      default:
        break;
    }
  };
};
