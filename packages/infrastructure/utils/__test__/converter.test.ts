/*
 * @Author: your name
 * @Date: 2020-07-29 09:21:59
 * @LastEditTime: 2020-08-01 17:04:54
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \custom-platform-v3-frontend\packages\infrastructure\utils\__test__\converter.test.ts
 */ 
import { SendAPBRequest,toRESTfulFormat,ItoRESTfulFormatArgs } from '../converter';
// import Http  from '../http'


const log=(info)=>console.log(JSON.stringify(info,null,2));


const apb = new SendAPBRequest({ table: 'data_design', bizCode: 'FC009' });

test('apb实例初始化测试', () => {
  expect(apb.table).toBe('data_design');
  expect(apb.bizCode).toBe('FC009');
});

/** 数据插入请求 */
const insertArgs={
  "table": "user",
  "set": [
    {
      "id": "999",
      "name": "张三",
      "age": 23
    }
  ]
};
/** 数据插入转换结果 */
const insertRes={
  "function": {
    "code": "TABLE_INSERT",
    "params": insertArgs
  }
}
/** 数据更新 */
const updateArgs={
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
/** 数据更新转换结果 */
const updateRes={
  "function": {
    "code": "TABLE_UPDATE",
    "params": updateArgs
  }
}

/** 数据删除 */
const delArgs={
  "table": "user",
  "condition": {
      "and": [{
              "equ": {
                  "name": "张三"
              }
          },
          {
              "notEqu": {
                  "age": 21
              }
          }
      ]
  }
}
/** 数据删除转换结果 */
const delRes={
  "function": {
    "code": "TABLE_DELETE",
    "params": delArgs
  }
}
/** 数据查询 */
const queryArgs={
  "condition": {
      "and": [{
              "equ": {
                  "name": "张三"
              }
          },
          {
              "notEqu": {
                  "age": 21
              }
          }
      ]
  },
}

/** 数据查询转换结果 */
const queryRes={
  "function": {
    "code": "TABLE_SELECT",
    "params": queryArgs
  }
}

/** 上传操作 */
const downloadArgs={
  "test_file":  'MultipartFile@12345abc'
}

/** 上传操作转换结果 */
const downloadRes={
  "function": {
    "code": "DOWNLOAD",
    "params":downloadArgs
  }
}



/** 导入操作 */
const importArgs={
  "multipart_file": "file",
  "template_id": "导入模板id"
}

/** 导入操作转换结果 */
const importRes={
  "function": {
    "code": "IMPORT_DATA",
    "params":importArgs
  }
}


/** 导出操作 */
const exportArgs={ 
  "file_type": "excel",
  "template_ids": "模板id",
  "file_name": "文件名",
  "data": [{
      "function": {
          "code": "TABLE_SELECT",
          "params": {
              "table": "user",
              "condition": {
                  "and": [{
                          "equ": {
                              "name": "张三"
                          }
                      },
                      {
                          "notEqu": {
                              "age": 21
                          }
                      }
                  ]
              },
              "fields": [{
                  "fieldName": "mid",
                  "alias": "id"
              }]
          }
      }
  }]
}

/** 导出操作转换结果 */
const exportRes={
  "function": {
    "code": "EXPORT_TO_FILE",
    "params":exportArgs
  }
}


 // 第三方业务操作参数
const thirdPartyArgs = { 
  action: 'THIRD_PARTY_CLOSE_LIGHT', 
  params: {
    "sid": "$.steps[0].id" // 取的第一步的id值
  }   
}

/** 第三方业务转换结果 */
const thirdPartyRes={
  "function": {
    "code": thirdPartyArgs.action,
    "params": thirdPartyArgs.params
  }
}



test('apb数据insert测试', () => {

  apb.insert(insertArgs);
  const {table,bizCode,steps}=apb;
  const execRes=apb.toAPBFormat({table,bizCode,steps});
  /** 控制台上深层级的对象会被显示成[Object] [Array],用JSON.stringify 处理一下，才能看全*/
  //  execRes.steps.forEach((item)=>{
    // console.log(JSON.stringify(execRes,null,2));
  // })
  const response={
    "businesscode": "FC009",
    "steps": [
      insertRes
    ]
  }
 
  expect(execRes).toEqual(response);
 
});

test('apb数据update测试', () => {

  apb.update(updateArgs);
  const {table,bizCode,steps}=apb;
  const execRes=apb.toAPBFormat({table,bizCode,steps});
  const response={
    "businesscode": "FC009",
    "steps": [
      insertRes,
      updateRes,
    ]
  }
 
  expect(execRes).toEqual(response);
 
});

test('apb数据delete测试', () => {

  apb.del(delArgs);
  const {table,bizCode,steps}=apb;
  const execRes=apb.toAPBFormat({table,bizCode,steps});
  const response={
    "businesscode": "FC009",
    "steps": [
      insertRes,
      updateRes,
      delRes
    ]
  }
 
  expect(execRes).toEqual(response);
 
});

test('apb数据query测试', () => {

  apb.query(queryArgs);
  const {table,bizCode,steps}=apb;
  const execRes=apb.toAPBFormat({table,bizCode,steps});
  const response={
    "businesscode": "FC009",
    "steps": [
      insertRes,
      updateRes,
      delRes,
      queryRes
    ]
  }
 
  expect(execRes).toEqual(response);
 
});

test('apb下载测试', () => {

  apb.download(downloadArgs);
  const {table,bizCode,steps}=apb;
  const execRes=apb.toAPBFormat({table,bizCode,steps});
  const response={
    "businesscode": "FC009",
    "steps": [
      insertRes,
      updateRes,
      delRes,
      queryRes,
      downloadRes
    ]
  }
 
  expect(execRes).toEqual(response);
 
});

test('apb导入测试', () => {

  apb.import(importArgs);
  const {table,bizCode,steps}=apb;
  const execRes=apb.toAPBFormat({table,bizCode,steps});
  const response={
    "businesscode": "FC009",
    "steps": [
      insertRes,
      updateRes,
      delRes,
      queryRes,
      downloadRes,
      importRes
    ]
  }
 
  expect(execRes).toEqual(response);
 
});
test('apb导出测试', () => {

  apb.export(exportArgs);
  const {table,bizCode,steps}=apb;
  const execRes=apb.toAPBFormat({table,bizCode,steps});
  const response={
    "businesscode": "FC009",
    "steps": [
      insertRes,
      updateRes,
      delRes,
      queryRes,
      downloadRes,
      importRes,
      exportRes
    ]
  }
 
  expect(execRes).toEqual(response);
 
});

test('apb三方业务测试', () => {
 
  apb.thirdParty(thirdPartyArgs)
  const {table,bizCode,steps}=apb;
  const execRes=apb.toAPBFormat({table,bizCode,steps});
  // log(execRes)
  const response={
    "businesscode": "FC009",
    "steps": [
      insertRes,
      updateRes,
      delRes,
      queryRes,
      downloadRes,
      importRes,
      exportRes,
      thirdPartyRes
    ]
  };
  expect(execRes).toEqual(response)

})

  //** 请求入参 */
  const config:ItoRESTfulFormatArgs = {
    contentType: 'form',
    path: '/auth/users/1',
    method: 'get',
    params: {
      page: 1,
      size: 100,
    },
  };

  // 期望结果
  const response={
        params: { page: 1, size: 100 },
        method: 'get',
        url: 'http://dev.hy.com:9000/paas/admin/custom/auth/users/1',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
  };

test('toRESTfulFormat参数转换测试-get-from', () => {
  /** toBe不支持对象比较,比较对象是否相等要用toEqual*/
  expect(toRESTfulFormat(config)).toEqual(response);
});

test('toRESTfulFormat参数转换测试-post-json', () => {

  const postArgs=Object.assign({},config,{method:'post',contentType:'json'})
  const postRes:any=Object.assign({},response,{method:'post',headers: { 'Content-Type': 'application/json' }})
  postRes.data=postRes.params;
  delete postRes.params
  expect(toRESTfulFormat(postArgs)).toEqual(postRes);
});


test('toRESTfulFormat参数转换测试-post file', () => {

  const postArgs=Object.assign({},config,{method:'post',contentType:'file'})
  const postRes:any=Object.assign({},response,{method:'post',headers: { 'Content-Type': 'multipart/form-data' }})
  const data = new FormData();
  Object.keys(postRes.params).forEach((curKey) => {
    data.append(curKey, postRes.params[curKey] as Blob);
  });
  postRes.data=data;
  delete postRes.params
  expect(toRESTfulFormat(postArgs)).toEqual(postRes);
});

test('toRESTfulFormat参数转换测试-put-json', () => {

  const postArgs=Object.assign({},config,{method:'put',contentType:'json'})
  const postRes:any=Object.assign({},response,{method:'put',headers: { 'Content-Type': 'application/json' }})
  postRes.data=postRes.params;
  delete postRes.params
  expect(toRESTfulFormat(postArgs)).toEqual(postRes);
});

test("toRESTfulFormat 未赋值默认赋值测试", () => {
  const testArgs=Object.assign({},config,{method:undefined,contentType:undefined,path:undefined,data:undefined,params:undefined})
  const testRes= {
    method:'post',
    headers: { 'Content-Type': 'application/json' },
    url:'http://dev.hy.com:9000/paas/admin/custom',
    data:{},
  }
  expect(toRESTfulFormat(testArgs)).toEqual(testRes);

})




test('doRequest方法测试-参数非法', () => {

  const reqArgs= {
    "businesscode": "FC987",
    "steps": [{
        "action": {
            "code": "第三方业务功能吗",
            "params": {
            }
        }
    }]
  }
  expect(apb.doRequest(reqArgs)).toEqual(true);
});

test('send方法测试-请求url不存在', async() => {

    /** 请求地址不存在，会引起控制台报错，可以忽略 */
    await apb.send().catch((e)=>{
      expect(e.message).toBe('Network Error');
    });

});









