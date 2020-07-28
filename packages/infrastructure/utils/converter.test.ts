import { SendAPBRequest } from './converter';

test('测试用例示例, 使用 jest 测试模块，babel-jest 可以实现 es6 的测试用例写法', () => {
  const apb = new SendAPBRequest({ table: 'dataDesign', bizCode: 'FC009' });
  expect(apb.table).toBe('dataDesign');
});
