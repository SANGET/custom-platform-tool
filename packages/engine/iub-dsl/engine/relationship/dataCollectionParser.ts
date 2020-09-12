import { DataCollectionRelationship, CommonObjStruct } from "@iub-dsl/types";

const DataCollectionParser = (dataCollection: DataCollectionRelationship, context) => {
  const collectionKey = Object.keys(dataCollection);
  // dataCollection.key.group[0].schemasMapping
  // dataCollection.key.group[0].collectionCondition
  const dataCollectionMappingResult: CommonObjStruct = {};
  collectionKey.forEach((k) => {
    dataCollectionMappingResult[k] = context.mappingEntity.structMapToFiled(
      dataCollection[k].group.reduce((res, groupItem) => {
        res[groupItem.schemasMapping.replace('@(schemas)', '')] = '';
        return res;
      }, {} as CommonObjStruct)
    );
  });

  // TODO: 还没想好
  const getCollectionData = (collectionName: string) => {
    const groupMapping = dataCollectionMappingResult[collectionName];
    if (groupMapping) {
      const groupMappingKey = Object.keys(groupMapping);
      return groupMappingKey.reduce((res, key) => {
        res[groupMapping[key]] = context.pageRuntimeState[key];
        return res;
      }, {});
    }
    return false;
  };

  return {
    dataCollectionMappingResult,
    getCollectionData
  };
};

export default DataCollectionParser;
