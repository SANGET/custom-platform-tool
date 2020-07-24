class Person {
  // 必须定义name的属性，public 共有，private 私有，protected 受保护 默认为public
  name: string;

  // 定义属性
  constructor(name: string) {
    this.name = name;
  }

  // 定义方法 切记中间没有逗号，没有返回值，指定方法类型为void
  print(): void {
    console.log(this.name);
  }
}

const p1: Person = new Person('小胖纸');
p1.print(); // hello ts

// import Http from './http';
// // T 表示传入的类型，可以为number、string、boolean等
// // 传入什么label就是什么类型
// interface labelValue<T> {
//   label: T;
//   value: number;
// }
// interface labelValue {
//   label: number;
//   value: number;
// }

// interface httpParams{
//   url:string;
//   method: string;
//   data: object;
//   headers:object;
// }

// // 传入number类型
// let obj: labelValue<number>;

// /**
//  * APB请求类
//  * 后端接口参见https://www.tapd.cn/41909965/documents/show/1141909965001000509#target%3atoc31
//  */
// class SendAPBRequest {
//   /** 业务功能码 */
//   public bizCode:string;

//   /** 数据表名 */
//   public table:string;

//   /** 操作集合 */
//   public steps:labelValue[];

//   constructor({ _bizCode, _table }) {
//     this.bizCode = _bizCode;
//     this.table = _table;
//     this.steps = [];
//     // this.args = args;
//     // super(args);
//     // {
//     //   bizCode: '', // 业务编码
//     //   steps: [], // 动作步骤
//     //   table: '', // 数据表名称
//     // }
//   }

//   insert(params):SendAPBRequest {
//     this.record({ action: 'insert', params });
//     return this;
//   }

//   update(params):SendAPBRequest {
//     this.record({ action: 'update', params });
//     return this;
//   }

//   del(params):SendAPBRequest {
//     this.record({ action: 'delete', params });
//     return this;
//   }

//   query(params):SendAPBRequest {
//     this.record({ action: 'query', params });
//     return this;
//   }

//   download(params):SendAPBRequest {
//     this.record({ action: 'download', params });
//     return this;
//   }

//   import(params):SendAPBRequest {
//     this.record({ action: 'import', params });
//     return this;
//   }

//   export(params):SendAPBRequest {
//     this.record({ action: 'export', params });
//     return this;
//   }

//   thirdParty(params):SendAPBRequest {
//     // 三方操作码中的action要传具体的功能码
//     this.args.steps.push(params);
//     return this;
//   }

//   // send() {
//   //   return this.doRequest(this.toAPBFormat(this.args));
//   // }

//   record(obj) {
//     const { action, params } = obj;
//     // 增改删查动作参数中没有传table字段的话,默认使用公共参数中的table
//     if (!params.table && ['insert', 'update', 'del', 'query'].includes(action)) params.table = this.table;
//     this.steps.push({ action, params });
//   }

//   doRequest(data) {
//     // 发送APB-DSL请求方法
//     const { businesscode, steps } = data;
//     // 参数合法性检查
//     const isInvalid = steps.every((step) => {
//       if (!step.function) return false;
//       const { code, params } = step.function;
//       return !!(code
//         && typeof code === 'string'
//         && Object.prototype.toString().call(params) === '[object Object]');
//     });
//     if (isInvalid) {
//       return console.log('参数不合法,请检查入参');
//     }
//     const baseUrl = `http:${ip}:${port}`;
//     const lesseeCode = 'xxx'; // 租户id
//     const appCode = 'xxx'; // 应用id
//     const url = `${baseUrl}/hy/saas/${lesseeCode}/${appCode}/business/${businesscode}`;
//     return Http({
//       url,
//       method: 'post',
//       data: params,
//       headers: {
//         'Content-Type': 'application/json',
//       },
//     });
//   }

//   toAPBFormat(args) {
//     const getActionCode = (action) => {
//       const actionMap = {
//         insert: 'TABLE_INSERT',
//         update: 'TABLE_UPDATE',
//         delete: 'TABLE_DELETE',
//         query: 'TABLE_SELECT',
//         download: 'DOWNLOAD',
//         import: 'IMPORT_DATA',
//         export: 'EXPORT_TO_FILE',
//       };
//       // 如果不是上面枚举的动作,则按第三方业务码处理
//       return actionMap[action] ? actionMap[action] : action;
//     };
//     const { bizCode, steps } = args;
//     return steps.reduce(
//       (prev, cur) => {
//         const { action, params } = cur;
//         prev.steps.push({
//           function: {
//             code: getActionCode(action),
//             params,
//           },
//         });
//         return prev;
//       },
//       { businesscode: bizCode, steps: [] }
//     );
//   }
// }

// const APBRequest = new SendAPBRequest();

// export { APBRequest };
