import RelationshipsCollection from "@iub-dsl/definition/relationship/relationship-collection";
import { CommonObjStruct } from "@iub-dsl/definition";
import DataChangeParser from "./dataChangeParser";
import DataCollectionParser from "./dataCollectionParser";

const RelationParser = (opportunity, relcatonCollection: RelationshipsCollection, parseContext) => {
  const parseResult: CommonObjStruct = {};
  switch (opportunity) {
    case 'DataSchemasParseEnd':
      if (relcatonCollection.dataChanged) {
        parseResult.dataChange = DataChangeParser(relcatonCollection.dataChanged, parseContext);
      }
      if (relcatonCollection.dataCollection) {
        parseResult.dataCollection = DataCollectionParser(relcatonCollection.dataCollection, parseContext);
      }
      break;
    default:
      break;
  }
  return parseResult;
};

export {
  RelationParser,
  DataChangeParser
};
