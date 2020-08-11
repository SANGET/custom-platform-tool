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
  return ({ pageRuntimeState, setPageRuntimeState }, ...args) => {
    // console.log(...args);
    switch (actionId) {
      case 'getLocationType':
        getLocationType().then((res) => {
          setPageRuntimeState({
            ...pageRuntimeState,
            locationDataTypeSource: res
          });
          console.log(res);
        }).catch();
        break;

      default:
        break;
    }
  };
};
