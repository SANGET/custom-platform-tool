/*
 * @Author: your name
 * @Date: 2020-07-29 09:21:59
 * @LastEditTime: 2020-07-29 21:17:50
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \custom-platform-v3-frontend\packages\infrastructure\utils\__test__\converter.test.ts
 */ 
import { SendAPBRequest,toRESTfulFormat,ItoRESTfulFormatArgs } from '../converter';
import Http  from '../http'


const log=(info)=>console.log(JSON.stringify(info,null,2));
const fetchUser=()=>{
  //** JSONPlaceholder上的一个mock地址，可以测试Http工具发送请求是否正常 */
  return Http.get('http://jsonplaceholder.typicode.com/users/1').then(data=> data).catch((err)=>console.log(err))
}

const apb = new SendAPBRequest({ table: 'data_design', bizCode: 'FC009' });

test('apb实例初始化测试', () => {
  expect(apb.table).toBe('data_design');
  expect(apb.bizCode).toBe('FC009');
});


test('apb数据更新业务测试', () => {
  const args={
    table: 'user',
    condition: {
      and: [
        {
          equ: {
            name: '张三',
          },
        },
      ],
    },
    set: [
      {
        id: '999',
        name: '张三',
        age: 23,
      },
    ],
  }
  apb.insert(args);
  const {table,bizCode,steps}=apb;
  const execRes=apb.toAPBFormat({table,bizCode,steps});
  /** 控制台上深层级的对象会被显示成[Object] [Array],用JSON.stringify 处理一下，才能看全*/
  //  execRes.steps.forEach((item)=>{
    // console.log(JSON.stringify(execRes,null,2));
  // })

  const res={
    "businesscode": "FC009",
    "steps": [
      {
        "function": {
          "code": "TABLE_INSERT",
          "params": {
            "table": "user",
            "condition": {
              "and": [
                {
                  "equ": {
                    "name": "张三"
                  }
                }
              ]
            },
            "set": [
              {
                "id": "999",
                "name": "张三",
                "age": 23
              }
            ]
          }
        }
      }
    ]
  }
 
  expect(execRes).toEqual(res);
 
});

test('apb三方业务测试', () => {
  // 第三方业务操作参数
  let thirdPartyParams = { 
    action: 'THIRD_PARTY_CLOSE_LIGHT', 
    params: {
      "sid": "$.steps[0].id" // 取的第一步的id值
    }   
  }
  apb.thirdParty(thirdPartyParams)
  const {table,bizCode,steps}=apb;
  const execRes=apb.toAPBFormat({table,bizCode,steps});
  // log(execRes)
  const res={
    "businesscode": "FC009",
    "steps": [
      {
        "function": {
          "code": "TABLE_INSERT",
          "params": {
            "table": "user",
            "condition": {
              "and": [
                {
                  "equ": {
                    "name": "张三"
                  }
                }
              ]
            },
            "set": [
              {
                "id": "999",
                "name": "张三",
                "age": 23
              }
            ]
          }
        }
      },
      {
        "function": {
          "code": "THIRD_PARTY_CLOSE_LIGHT",
          "params": {
            "sid": "$.steps[0].id"
          }
        }
      }
    ]
  };
  expect(execRes).toEqual(res)

})


test('toRESTfulFormat参数转换测试-get', () => {
  //** 请求入参 */
  const args:ItoRESTfulFormatArgs = {
    contentType: 'form',
    path: '/auth/users/1',
    method: 'get',
    params: {
      page: 1,
      size: '100',
    },
  };

  // 期望结果
  const res={
        params: { page: 1, size: '100' },
        method: 'get',
        url: 'http://dev.hy.com:9000/paas/admin/custom/auth/users/1',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
  };
  /** toBe不支持对象比较,比较对象是否相等要用toEqual*/
  expect(toRESTfulFormat(args)).toEqual(res);

});



test('Http请求测试 fetchUser() 可以请求到一个用户名字为Leanne Graham', async () => {
  // expect.assertions(1);
  const res =  await fetchUser();
  // console.log('fetchUser()',res)
  /** AxiosResponse<any>”上不存在属性“name 的解决方案 https://segmentfault.com/a/1190000016232248 */
  /** 一定要有判空调条件 */
  res && expect(res.data.name).toBe('Leanne Graham')
})

