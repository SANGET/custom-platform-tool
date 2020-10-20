import { genUrl } from './url';

enum APBDSLResponeCode {
  SA0000 = 'SA0000'
}
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
