var recusiveGetEntity = (data, nestingIdx, key) => {
  let resData;
  const recusive = (d, deep) => {
    const i = nestingIdx[deep];
    const _d = d[i];
    const nextDeep = deep++;
    if (_d[key] && typeof nestingIdx[nextDeep] !== 'undefined') {
      recusive(_d[key], nextDeep);
    } else {
      resData = _d;
    }
  };
  recusive(data, 0);
  return resData;
};
var res = recusiveGetEntity([
  {
    id: 1,
    body: [
      {
        id: 2,
        body: [
          {
            id: 3
          }
        ]
      },
      {
        id: 4
      }
    ]
  }
], [0, 0], 'body');
console.log(res)