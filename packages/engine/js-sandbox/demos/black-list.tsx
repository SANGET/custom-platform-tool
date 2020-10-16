import React, { ReactElement } from 'react';
import createSandbox from '@engine/js-sandbox';

const Base: React.FC = (): ReactElement => {
  const context = {
    a: 1,
    b: 2
  };
  const sandbox = createSandbox(context, {
    blackList: ['b']
  });
  const res = sandbox('a + b');
  return <div>
    <div>输出结果: {res.toString()}</div>
  </div>;
};
export default Base;
