import parserDataChange from "./parserDataChange";

const parseRelation = (opportunity, relcatonCollection) => {
  switch (opportunity) {
    case 'schemasCreate':
      if (relcatonCollection.dataChange) {
        return parserDataChange(relcatonCollection.dataChange);
      }
      break;

    default:
      break;
  }
};

export {
  parseRelation,
  parserDataChange
};
