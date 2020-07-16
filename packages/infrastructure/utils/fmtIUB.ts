// REST转换器
enum ContentType {form, json, file}
enum MethodType {get, delete, put, post, patch}
// 传参约束
interface toRESTfulFormatArgs {
  method: MethodType;
  contentType: ContentType | string;
  path: string;
  params: unknown;
}
// 返回约束
interface toRESTfulFormatRet {
  method: MethodType;
  url: string;
  headers:unknown;
}

// 按照axios传参要求格式化参数
const toRESTfulFormat = (args:toRESTfulFormatArgs): toRESTfulFormatRet => {
  const {
    method = 'post', contentType, params = {}, path = ''
  } = args;
  const baseUrl = 'baseUrl' + '/platform/version';
  const typeObj = {
    json: 'application/json',
    form: 'application/x-www-form-urlencoded',
    file: 'multipart/form-data',
  };
  const reqParams = {
    params,
    data: any,
    method,
    url: `${baseUrl}${path}`,
    headers: {
      'Content-Type': typeObj[contentType],
    },
  };
  if (['post', 'put', 'patch'].includes(method)) {
    // get|delete参数字段名称是params,post|put|patch参数字段名称是data
    delete reqParams.params;
    reqParams.data = params;
    // 文件上传参数要处理成formData格式
    if (contentType === 'file') {
      const data = new FormData();
      Object.keys(params).forEach((prev, curKey) => {
        data.append(curKey, params[curKey]);
      });
      reqParams.data = data;
    }
  } else {
    delete reqParams.data;
  }
  return reqParams;
};

export { toRESTfulFormat };
