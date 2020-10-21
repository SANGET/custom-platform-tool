import { genUrl } from './url';

enum APBDSLResponeCode {
  SA0000 = 'SA0000',
  SA0002 = 'SA0002',
  SA0003 = 'SA0003',
  SA0004 = 'SA0004',
  SA0005 = 'SA0005',
  SA0006 = 'SA0006',
  SA0007 = 'SA0007',
  SA0008 = 'SA0008',
  SA0009 = 'SA0009',
  SA0010 = 'SA0010',
  SA0017 = 'SA0017',
  SA0018 = 'SA0018',
  SA0019 = 'SA0019',
  SA0016 = 'SA0016',
  SA0012 = 'SA0012',
  SA0001 = 'SA0001',
  SA0011 = 'SA0011',
  SA0013 = 'SA0013',
  SA0014 = 'SA0014',
  SA0015 = 'SA0015',
  SA0020 = 'SA0020',
  SA0021 = 'SA0021',
  SA0022 = 'SA0022',
  SA0023 = 'SA0023',
  SA0024 = 'SA0024',
  SA0025 = 'SA0025',
  SA0026 = 'SA0026',
  SA0027 = 'SA0027',
  SA0028 = 'SA0028',
  SA0029 = 'SA0029',
}

export const APBDSLResponseMsg = {
  [APBDSLResponeCode.SA0000]: '业务处理成功！',
  [APBDSLResponeCode.SA0002]: '请使用POST方式提交',
  [APBDSLResponeCode.SA0003]: '找不到匹配业务请求解析器！',
  [APBDSLResponeCode.SA0004]: 'SaasContext不能为NULL！',
  [APBDSLResponeCode.SA0005]: 'code必须是String！',
  [APBDSLResponeCode.SA0006]: 'params必须是Map！',
  [APBDSLResponeCode.SA0007]: '第%s个功能单元缺少%s字段！',
  [APBDSLResponeCode.SA0008]: '提取数据异常: %s',
  [APBDSLResponeCode.SA0009]: '功能码：%s，找不到匹配功能！',
  [APBDSLResponeCode.SA0010]: '业务单元: %s(%s)，没法找到匹配业务解析器',
  [APBDSLResponeCode.SA0017]: '从%s选择一个参数',
  [APBDSLResponeCode.SA0018]: '只能从%s选择一个参数',
  [APBDSLResponeCode.SA0019]: '从%s中选择一个参数',
  [APBDSLResponeCode.SA0016]: '应用未启动',
  [APBDSLResponeCode.SA0012]: '功能执行异常:%s',
  [APBDSLResponeCode.SA0001]: 'businessRequest不是FunctionCodeRequest，应用引擎无法处理！',
  [APBDSLResponeCode.SA0011]: '应用安装错误:%s',
  [APBDSLResponeCode.SA0013]: '只支持文件上传请求！',
  [APBDSLResponeCode.SA0014]: '请求内容缺少file字段！',
  [APBDSLResponeCode.SA0015]: '应用安装异常',
  [APBDSLResponeCode.SA0020]: '转换应用安装包异常:%s',
  [APBDSLResponeCode.SA0021]: '上传的应用包为空！',
  [APBDSLResponeCode.SA0022]: '远程安装应用失败: %s',
  [APBDSLResponeCode.SA0023]: '应用卸载异常',
  [APBDSLResponeCode.SA0024]: '函数功能：%s查找异常！',
  [APBDSLResponeCode.SA0025]: '找不到函数功能：%s！',
  [APBDSLResponeCode.SA0026]: '函数功能：%s执行异常！',
  [APBDSLResponeCode.SA0027]: '租户非法访问！',
  [APBDSLResponeCode.SA0028]: '应用非法访问！',
  [APBDSLResponeCode.SA0029]: '业务非法访问！',
};

interface APBDSLRespone<T = any> {
  code: APBDSLResponeCode
  msg: string
  result: T
  timestamp: string
}
export const APBDSLrequest = (reqParam) => {
  const reqUrl = genUrl(34562);
  // console.dir(reqParam, { depth: 3 });

  return fetch(`${reqUrl}`, {
    body: JSON.stringify(reqParam),
    headers: {
      'content-type': 'application/json'
    },
    method: 'POST',
    mode: 'cors',
  }).then<APBDSLRespone>((response: Response) => {
    return response.json();
  }).then((res) => {
    if (res.code === APBDSLResponeCode.SA0000) {
      return Promise.resolve(res.result);
    }
    return Promise.resolve(false);
  });
};

const result = {
  result: [{
    address: "301描述信息描述描述描述~@!!~", id: "1315554941783384064", age: "96", username: "张三301"
  }, {
    address: "西湖区湖底公园15461~@!!~", id: "1316911754432880640", age: "54", username: "张三5461"
  }, {
    address: "西湖区湖底公园19061~@!!~", id: "1316913644566618112", age: "31", username: "张三9061"
  }, {
    address: "西湖区湖底公园15683~@!!~", id: "1316914075971756032", age: "51", username: "张三5683"
  }, {
    address: "西湖区湖底公园13667~@!!~", id: "1316925293449060352", age: "14", username: "张三3667"
  }, {
    address: "好运连绵", id: "1316925667153158144", age: "99", username: "张三"
  }, {
    address: "@!#好运连绵", id: "1316925884376162304", age: "9", username: "张三1"
  }, {
    address: "西湖区湖底公园15831~@!!~", id: "1318131668028104704", age: "24", username: "张三5831"
  }, {
    address: "西湖区湖底公园18449~@!!~", id: "1318134929674084352", age: "97", username: "张三8449"
  }, {
    address: "西湖区湖底公园11677~@!!~", id: "1318135200512876544", age: "57", username: "张三1677"
  }, {
    address: "西湖区湖底公园11503~@!!~", id: "1318135373955735552", age: "90", username: "张三1503"
  }, {
    address: "西湖区湖底公园1272~@!!~", id: "1318136804200816640", age: "88", username: "张三272"
  }, {
    address: "西湖区湖底公园1272~@!!~", id: "1318136861465649152", age: "88", username: "张三272"
  }, {
    address: "西湖区湖底公园12872~@!!~", id: "1318137345773543424", age: "45", username: "张三2872"
  }, {
    address: "嘻嘻哈哈大佬", id: "1318137637961342976", age: "1", username: "张三52"
  }],
  code: "SA0000",
  msg: "业务处理成功！",
  timestamp: "1603103477448"
};
