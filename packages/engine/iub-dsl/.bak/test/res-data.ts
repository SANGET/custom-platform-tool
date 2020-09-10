interface ToAPBParams {
  method: 'insert' | 'update' | 'delete';
  tableName: string;
  params: {};
}
interface ToAPBReturn {

}
type ToAPB = (parmas: ToAPBParams) => ToAPBReturn;

const toApb: ToAPB = () => {
  return {};
};

const toRESTFul = ({
  path: '/user',
  method: 'GET',
  params: {
    username: ''
  }
}) => {
  return {};
};

const GetUsername = () => {
  
}


const reqData = {
  "businesscode": "……",
  "steps": [
      {
          // 这是一个功能单元
          "function": {
              "code": "……",
              "params": {……}
          }
      },
      // 一个业务操作可由多个功能组合成
      {
          "function": {
              ……
          }
      }
  ]
}

const resData = {
  "result": [{
    username7: 'user'
  },{
    username7: 'user2'
  }],
  "code": "0000",
  "msg": "doFunctionCode成功",
  "timestamp": 1585118430828
}