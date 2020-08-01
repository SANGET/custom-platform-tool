/*
 * @Author: your name
 * @Date: 2020-07-29 09:21:59
 * @LastEditTime: 2020-08-01 15:34:27
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \custom-platform-v3-frontend\packages\infrastructure\utils\__test__\converter.test.ts
 */ 

import {alertMsg,alertMsgArgs}  from '../utils'



test('alertMsg参数配置测试,期望入参经过转换之后,与antd要求的参数一致', () => {


  const args:alertMsgArgs={
    type:'info',
    title:'alert',
    desc:'test',
    duration:1,
  }
  const execRes={
    message:'alert',
    description:'test',
    duration:1,
    showIcon: true,
  }
 
  expect(alertMsg(args)).toEqual(execRes);
  args.type=undefined
  expect(alertMsg(args)).toEqual(execRes);
 
});

test('alertMsg参数配置测试,title为空', () => {

  const args:alertMsgArgs={
    type:'info',
    title:'',
    desc:'test',
    duration:1,
  }
  const execRes={
    message:'',
    description:'test',
    duration:1,
    showIcon: true,
  }
  expect(alertMsg(args)).toEqual(execRes);
 
});

