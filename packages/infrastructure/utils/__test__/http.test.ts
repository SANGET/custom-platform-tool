import {http} from '../http'

test('测试用例示例, 使用 jest 测试模块，babel-jest 可以实现 es6 的测试用例写法', () => {
  expect(http()).toBe('http');
});
