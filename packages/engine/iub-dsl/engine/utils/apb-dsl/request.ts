import { genUrl } from './url';

export const APBDSLrequest = (reqParam) => {
  const reqUrl = genUrl(34562);
  // console.dir(reqParam, { depth: 3 });
  console.log(JSON.stringify(reqParam));
  console.table(reqParam.steps[0].function.params.set);

  // return fetch(`${reqUrl}`, {
  //   body: JSON.stringify(reqParam),
  //   headers: {
  //     'content-type': 'application/json'
  //   },
  //   method: 'POST',
  //   mode: 'cors',
  // }).then((response: Response) => {
  //   return response.json();
  // }).then((res) => {
  //   console.log(res);
  // });
};
