const iub = {
  expression: `insert()`
};

const toRestful = () => {};

const api = (params) => {
  fetch(toRestful(params));
};

const parser = (iub) => {
  switch (iub.method) {
    case 'insert':
      api({
        method: 'post',
      });
      break;

    default:
      break;
  }
};
