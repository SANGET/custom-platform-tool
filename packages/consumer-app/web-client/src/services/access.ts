import { TypeOfIUBDSL } from '@iub-dsl/definition';

const deepClone = (obj) => {
  return JSON.parse(JSON.stringify(obj));
};

const LoadPage = (pageID): Promise<TypeOfIUBDSL> => {
  console.log(pageID);

  return new Promise((resolve, reject) => {
    fetch('http://10.11.6.193:3000/page-data/hy/app/page/1308242886768336896?mode=preview')
      .then((resData) => {
        return resData.json();
      })
      .then((resData) => {
        resolve(resData.result);
      });
    // import('@iub-dsl/demo/business-case/location')
    //   // import('@iub-dsl/demo/business-case/simple-create-user')
    //   // import('@iub-dsl/demo/business-case/create-user')
    //   .then(({ default: IUBDSLData }) => {
    //     resolve(deepClone(IUBDSLData));
    //   });
  });
};

export {
  LoadPage
};
