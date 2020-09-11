function compose(...funcs) {
  if (funcs.length === 0) {
    return (arg) => arg;
  }

  if (funcs.length === 1) {
    return funcs[0];
  }

  return funcs.reduce((a, b) => (...args) => a(b(...args)));
}

export default function applyMiddleware(...middlewares) {
  return (originHandle, middlewareAPI) => (...args) => {
    const originRes = originHandle(...args);
    // let dispatch;
    // let dispatch = () => {
    //   throw new Error(
    //     'Dispatching while constructing your middleware is not allowed. '
    //       + 'Other middleware would not be applied to this dispatch.'
    //   );
    // };

    // const middlewareAPI = {
    //   getState: originRes.getState,
    //   dispatch: (...args) => dispatch(...args)
    // };
    const chain = middlewares.map((middleware) => middleware(middlewareAPI));
    const composeRes = compose(...chain)(originRes);

    return {
      ...originRes,
      ...composeRes
    };
  };
}
