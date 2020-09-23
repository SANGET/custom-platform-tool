export * from './common-struct';
export * from './compose';
export * from './applyMiddleware';
export * from './enhancer';
export * from './assert';
export const sleep = (time = 1) => new Promise(
  (resolve) => setTimeout(() => resolve(), time * 1000)
);
