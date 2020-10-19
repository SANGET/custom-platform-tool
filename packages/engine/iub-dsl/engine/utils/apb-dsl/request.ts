import { genUrl } from './url';

enum APBDSLResponeCode {
  SA0000 = 'SA0000'
}
interface APBDSLRespone {
  code: APBDSLResponeCode
  msg: string
  result: T
  timestamp: string
}
export const APBDSLrequest = (reqParam) => {
  const reqUrl = genUrl(34562);
  // console.dir(reqParam, { depth: 3 });
  console.log(JSON.stringify(reqParam));

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
