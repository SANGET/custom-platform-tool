import { TypeOfIUBDSL } from '@iub-dsl/core/types';

const LoadPage = (pageID): Promise<TypeOfIUBDSL> => {
  return new Promise((resolve, reject) => {
    import('@iub-dsl/demo/business-case/create-user')
      .then(({ default: IUBDSLData }) => {
        resolve(IUBDSLData);
      });
  });
};

export {
  LoadPage
};
