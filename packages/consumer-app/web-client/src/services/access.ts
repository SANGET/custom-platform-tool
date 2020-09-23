import { TypeOfIUBDSL } from '@iub-dsl/definition';

const deepClone = (obj) => {
  return JSON.parse(JSON.stringify(obj));
};

const LoadPage = (pageID): Promise<TypeOfIUBDSL> => {
  console.log(pageID);

  return new Promise((resolve, reject) => {
    import('@iub-dsl/demo/business-case/location')
      // import('@iub-dsl/demo/business-case/simple-create-user')
      // import('@iub-dsl/demo/business-case/create-user')
      .then(({ default: IUBDSLData }) => {
        resolve(deepClone(IUBDSLData));
      });
  });
};

export {
  LoadPage
};
