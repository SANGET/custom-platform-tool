/*
 * @Author: your name
 * @Date: 2020-07-28 15:23:17
 * @LastEditTime: 2020-07-29 21:38:04
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \custom-platform-v3-frontend\packages\infrastructure\utils\converter.ts
 */
/** 导入发http请求的方法 */
import Http from './http';

/** 基本请求参数 */
const UrlBaseParams = {
  /** 基础url */
  baseUrl: `http://dev.hy.com:9000`,
  /** 租户id */
  lesseeCode: 'admin',
  /** 应用id */
  appCode: 'custom',
};

/** RESTful请求传参约束 */
export interface ItoRESTfulFormatArgs {
  method: 'get'|'delete'|'put'|'post'|'patch';
  contentType: 'form'|'json'|'file';
  path: string;
  params?: Record<string, unknown>;
  data?: Record<string, unknown> | FormData;
}

/**
 * 将ItoRESTfulFormatArgs类型的参数转换成axios支持的请求参数
 */
export const toRESTfulFormat = (args:ItoRESTfulFormatArgs) => {
  const {
    method = 'post', contentType = 'application/json', params = {}, path = '', data = {}
  } = args;
  const { baseUrl, lesseeCode, appCode } = UrlBaseParams;
  const preUrl = `${baseUrl}/paas/${lesseeCode}/${appCode}`;
  const typeObj = {
    json: 'application/json',
    form: 'application/x-www-form-urlencoded',
    file: 'multipart/form-data',
  };
  const reqParams = {
    data,
    params,
    method,
    url: `${preUrl}${path}`,
    headers: {
      'Content-Type': typeObj[contentType],
    },
  };
  if (['post', 'put', 'patch'].includes(method)) {
    /** get|delete参数字段名称是params,post|put|patch参数字段名称是data */
    reqParams.data = params;
    /** 文件上传参数要处理成formData格式 */
    if (contentType === 'file') {
      const data = new FormData();
      Object.keys(params).forEach((curKey) => {
        data.append(curKey, params[curKey] as Blob);
      });
      reqParams.data = data;
    }
    delete reqParams.params;
  } else {
    delete reqParams.data;
  }
  return reqParams;
};

/**
 * APB请求类
 * APB-DSL请求与普通axios请求参数相比,只是data字段的内容格式不同,APB-DSL请求data字段内容格式如下：
{
  "businesscode": "……",
  "steps": [
      {
          // 这是一个功能单元
          "function": {
              "code": "……",
              "params": {……}
          }
      },
      // 一个业务操作可能有多个功能单元
      {
          "function": {
              ……
          }
      }
  ]
}
 * 后端接口参见https://www.tapd.cn/41909965/documents/show/1141909965001000509#target%3atoc31
 */

/** steps中的参数约定 */
interface IFunArgs{
  function:{
    code:string;
    params:unknown;
  }
}

/** 操作集合参数约定 */
interface IAPBArgs{
  action:string;
  params:unknown;
}

export class SendAPBRequest {
  /** 业务功能码 */
  public bizCode:string;

  /** 数据表名 */
  public table:string;

  /** 操作集合 */
  public steps:IAPBArgs[]=[];

  constructor({ bizCode, table }) {
    /** 业务编码 */
    this.bizCode = bizCode;
    /** 数据表名称 */
    this.table = table;
    /** 操作集合 */
    this.steps = [];
  }

  insert(params):SendAPBRequest {
    this.record({ action: 'insert', params });
    return this;
  }

  update(params):SendAPBRequest {
    this.record({ action: 'update', params });
    return this;
  }

  del(params):SendAPBRequest {
    this.record({ action: 'delete', params });
    return this;
  }

  query(params):SendAPBRequest {
    this.record({ action: 'query', params });
    return this;
  }

  download(params):SendAPBRequest {
    this.record({ action: 'download', params });
    return this;
  }

  import(params):SendAPBRequest {
    this.record({ action: 'import', params });
    return this;
  }

  export(params):SendAPBRequest {
    this.record({ action: 'export', params });
    return this;
  }

  thirdParty(params):SendAPBRequest {
    /** 三方操作码中的action要传具体的功能码 */
    this.steps.push(params);
    return this;
  }

  send() {
    return this.doRequest(this.toAPBFormat({ bizCode: this.bizCode, steps: this.steps }));
  }

  record(obj) {
    const { action, params } = obj;
    /** 增改删查动作参数中没有传table字段的话,默认使用公共参数中的table */
    if (!params.table && ['insert', 'update', 'del', 'query'].includes(action)) params.table = this.table;
    this.steps.push({ action, params });
  }

  doRequest(data) {
    const { baseUrl, lesseeCode, appCode } = UrlBaseParams;

    const { businesscode, steps } = data;

    /** 参数合法性检查 */
    const isInvalid = steps.every((step:IFunArgs) => {
      if (!step.function) return false;
      const { code, params } = step.function;
      return (code
        && typeof code === 'string'
        && Object.prototype.toString.call(params) === '[object Object]');
    });
    if (isInvalid) {
      return console.log('参数不合法,请检查入参');
    }

    const url = `${baseUrl}/hy/saas/${lesseeCode}/${appCode}/business/${businesscode}`;
    /** 请求发送之后,清空参数 */
    this.steps = [];
    /** 发送APB-DSL请求方法 */
    return Http({
      url,
      data,
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  toAPBFormat(args) {
    const getActionCode = (action) => {
      this.table = "";
      /** 动作业务代码 */
      const actionMap = {
        insert: 'TABLE_INSERT',
        update: 'TABLE_UPDATE',
        delete: 'TABLE_DELETE',
        query: 'TABLE_SELECT',
        download: 'DOWNLOAD',
        import: 'IMPORT_DATA',
        export: 'EXPORT_TO_FILE',
      };
      /** 如果不是上面枚举的动作,则按第三方业务码处理 */
      return actionMap[action] ? actionMap[action] : action;
    };
    const { bizCode, steps } = args;
    return steps.reduce(
      (prev, cur) => {
        const { action, params } = cur;
        /** 参数名称转换 */
        prev.steps.push({
          function: {
            code: getActionCode(action),
            params,
          },
        });
        return prev;
      },
      { businesscode: bizCode, steps: [] }
    );
  }
}
