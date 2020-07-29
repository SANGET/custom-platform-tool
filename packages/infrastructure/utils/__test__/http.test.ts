/*
 * @Author: your name
 * @Date: 2020-07-28 21:40:49
 * @LastEditTime: 2020-07-28 21:47:48
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \custom-platform-v3-frontend\packages\infrastructure\utils\__test__\http.test.ts
 */ 
import { SendAPBRequest } from '../converter'

test('测试用例示例, 使用 jest 测试模块，babel-jest 可以实现 es6 的测试用例写法', () => {
  let apb=new SendAPBRequest({_bizCode:'FC09',_table:'test'})
  expect(apb.bizCode).toBe('FC09');
});
