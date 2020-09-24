import {uuidv4} from '../uuid'

test('测试 UUID 生成的长度，必须为 36 个字符长度', () => {
  expect(uuidv4().length).toBe(36);
});