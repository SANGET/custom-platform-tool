import React, { ReactElement } from 'react';
import createSandbox from '@engine/js-sandbox';

const Context: React.FC = (): ReactElement => {
  const context = {
    a: 1,
    b: 2
  };
  // @ts-ignore
  window.c = 2;
  const sandbox = createSandbox(context);
  const res = sandbox('window.c = 4;return a + b;');
  setTimeout(() => {
    // @ts-ignore
    console.log(window.c);
  }, 1000);
  return <div>
    <div>输出结果: {res.toString()}</div>
    <div>window.a:</div>
  </div>;
};
export default Context;
