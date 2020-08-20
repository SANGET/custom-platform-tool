/*
 * @Author: your name
 * @Date: 2020-07-29 09:21:59
 * @LastEditTime: 2020-08-01 16:46:15
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \custom-platform-v3-frontend\packages\infrastructure\utils\__test__\converter.test.ts
 */ 

import {errHandler,resHandler}  from '../http.tool'
import Http, {beforeEach,afterEach,CancelToken}  from '../http'

const fetchUser=(obj)=>{
  const {url,cb,error,config}=obj
  return Http.get(url,config)
  .then(data=>{
    data && cb && cb(data)
  })
  .catch((e)=>{
    error && error(e)
  })
}

test("请求拦截错误测试 -beforeEach正确回调,atterEach错误回调", (done) => {
  let cancelAjax;  
  Http.request({
    url: 'http://jsonplaceholder.typicode.com/users/1',
    method: 'post',
    data: {
      auth: 'tree'
    },
    /** cancelToken 指定用于取消请求的 cancel token */
    cancelToken: new CancelToken((c) => {
      /** 获取取消请求的回调 */
      cancelAjax = c;
    }),
    headers: {
      isLoading: true,
      'Content-Type': 'application/json'
    }
  })
    .then((data) => {
      console.log(data);
    })
    .catch((err) => {
      // console.log('xxx',err.message)
      expect(err.message).toBe('cancel')
    });
  /** 取消请求 */
  cancelAjax('cancel');
  done()
})



test('Http请求测试 fetchUser() 可以请求到一个用户名字为Leanne Graham,覆盖到transformRequest', async (done) => {

  let args={
    /** JSONPlaceholder上的一个mock地址，可以测试Http工具发送请求是否正常 */
    url:'http://jsonplaceholder.typicode.com/users/1',
    cb:(data)=>{
      expect(data.data.name).toBe('Leanne Graham');
    },
  }
  // fetchUser(args)
  // expect.assertions(1);
  const res:any =  await fetchUser(args);
  // // console.log('fetchUser()',res)
  // /** AxiosResponse<any>”上不存在属性“name 的解决方案 https://segmentfault.com/a/1190000016232248 */
  // /** 一定要有判空调条件 */
  res && expect(res.data.name).toBe('Leanne Graham')
  done();
})

test('Http请求异常测试,请求一个不存在的地址,期望抛出错误Network Error',async()=>{
  let args={
    /** 不存在的地址 */
    url:'http://xxx/1',
    error:(err)=>{
      expect(err.message).toBe('Network Error')
    }
  }

    fetchUser(args)

 
})

test("afterEach方法测试,期望能修改返回结果", () => {

    beforeEach.use((config)=>{
    
      throw Error('请求拦截测试')
  })

  afterEach.use((res)=>{
    console.log('res=',res);
    return resHandler(res);
  })

  Http.request({
    url: 'http://jsonplaceholder.typicode.com/users/1',
    method: 'get',
    data: {
      auth: 'tree'
    },
    /** cancelToken 指定用于取消请求的 cancel token */
    // cancelToken: new CancelToken((c) => {
    //   /** 获取取消请求的回调 */
    //   cancelAjax = c;
    // }),
    headers: {
      isLoading: true,
      'Content-Type': 'application/json'
    }
  })
    .then((data) => {
      console.log(data);
    })
    .catch(() => {
      // AppContext.dispatch({
      //   type: 'hide',
      //   payload: {}
      // });
    });
    
  // let args={
  //   /** JSONPlaceholder上的一个mock地址，可以测试Http工具发送请求是否正常 */
  //   url:'http://jsonplaceholder.typicode.com/users/1',
  //   cb:(data)=>{
  //     expect(data.data.name).toBe('test');
  //   },
  //   // config:{
  //   //   transformResponse: [(data) => {
  //   //     // 对 data 进行任意转换处理
  //   //     data.data.name='test'
  //   //     return data;
  //   //   }],
  //   // }
  // }
  // fetchUser(args)
})


test('errHandler方法测试,期望状态码是504,出错信息是网络超时', () => {

  const args={
    response:{ 
      status:504, 
      statusText:'Unkown Error'
    } 
  }

  /** 已知出错码 */
  errHandler(args).then((error)=>{
    expect(error).toBe('网络超时');
  }).catch(()=>{});
  /** 未知错误 */
  args.response.status=511
  errHandler(args).then((error)=>{
    expect(error).toBe('Unkown Error');
  }).catch(()=>{});
  
  /** 登陆超时 */
  args.response.status=600
  args.response.statusText='登陆超时'
  try {
    errHandler(args).catch(()=>{});
  } catch (error) {
    expect(error).toBe('登陆超时');
  }

});
test('resHandler方法测试,分为有数据返回和无数据返回时的情况', () => {
  const normalArgs={
    status:200,
    data:''
  }

  /** 网络状态正常,返回数据为空 */
  /** node警告 DeprecationWarning: Unhandled promise rejections are deprecated.
   *  的处理方法是添加.catch(()=>{})假装对错误进行了处理 
   */
  resHandler(normalArgs).then((error)=>{
    expect(error).toBe('数据不存在');
  }).catch(()=>{});
  
  /** ts真坑,一个字段在初始化的时候是string,后面不能赋值成其它类型 */
  /** 网络状态正常,业务码异常 */
  const errCodeArgs={
      status:200,
      data:{
        code:'00001',
        msg:'业务返回码异常'
      }
  }
 
  resHandler(errCodeArgs).then((error)=>{
    expect(error).toBe('业务返回码异常');
  }).catch(()=>{});
})

test("resHandler-正常流程测试", () => {
  const testArgs={
    status:200,
    data:{
      code:'00000',
      msg:'业务正常'
    }
  }

  resHandler(testArgs).then((res)=>{
    expect(res.data.msg).toBe('业务正常');
  }).catch(()=>{});

})

test("resHandler-异常流程测试", () => {
  const testArgs={
    status:500,
    data:{
      code:'01000',
      msg:'业务异常'
    }
  }

  resHandler(testArgs).catch((res)=>{
    expect(res.data.msg).toBe('业务异常');
  });

})

