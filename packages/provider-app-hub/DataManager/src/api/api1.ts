import RESTFulT from '';
import Fetch from '';

const GetUsers = async ({
  pageSize = 0,
  pageIdx = 0,
}) => {
  const restfulData = RESTFulT({
    method: 'GET',
    params: {
      pageSize,
      pageIdx
    }
  });

  const resData = await Fetch(restfulData);

  return resData;
};

GetUsers({
  pageIdx: 1,
  pageSize: 10
});
