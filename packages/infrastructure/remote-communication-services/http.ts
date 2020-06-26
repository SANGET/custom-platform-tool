export interface HTTPAPIParams {

}
export interface HTTPAPIResponse {

}

const HTTP = (params: HTTPAPIParams): Promise<HTTPAPIResponse> => {
  return new Promise((resolve) => {
    resolve({
      data: {}
    });
  });
};

export default HTTP;
