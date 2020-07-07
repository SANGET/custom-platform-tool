import { useState } from 'react';
import {
  MetadataMappingCollection,
  Schemas, SchemaItem,
  FoundationTypeSchemas,
  StructTypeSchemas,
  CommonObjStruct
} from "@iub-dsl/core";

interface ParseSchemasDependency { schemas: Schemas, metadataCollection: MetadataMappingCollection }

interface ParseSchemasResult {
  mappingEntity: unknown;
  schemaStruct: unknown;

  // pageRuntimeState: SchemaStruct;
  // setPageRuntimeState(newState): void;
}

interface SchemaStruct {
  [str: string]: unknown
}

type LocaltionPath = string; // localtionPath

// TODO: 修改类似的Interface
interface DataUUIDMapToMetadata {
  [dataUUID: string]:
  LocaltionPath |
  {
    key: LocaltionPath;
    value: LocaltionPath;
  } |
  (
    LocaltionPath |
    {
      key: LocaltionPath;
      value: LocaltionPath;
    }
  )[];
}

interface resStruct {
  tableName: string;
  field: string;
}

// TODO: 递归结构好像不好描述
// type transformResult =
//   resStruct |
//   (
//     resStruct |
//     {
//       [str: string]: resStruct
//     }
//   )[] |
//   {
//     [str: string]: resStruct
//   }

const parseMetaDataMapping = (
  metadataCollection: MetadataMappingCollection,
  dataUUIDMapToMetadata: DataUUIDMapToMetadata
) => {
  const mappingEntity = metadataCollection.dataSource;

  // 目前只有一个库 就先写简单点
  const locationStrToField = (locationStr: string): resStruct => {
    if (locationStr === '') {
      return {
        tableName: '', field: ''
      };
    }
    const locationArr = locationStr.split('.');
    const { field } = mappingEntity[locationArr[0]].columns[locationArr[1]];
    return {
      tableName: locationArr[0],
      field
    };
  };

  const locationMapToField = (location) => {
    if (typeof location === 'string') {
      return locationStrToField(location);
    }
    if (Array.isArray(location)) {
      return location.map(locationMapToField);
    }
    if (typeof location === 'object') {
      return Object.keys(location).reduce((result, key) => {
        result[key] = typeof location[key] === 'object' ? locationMapToField(location[key]) : locationStrToField(location[key]);
        return result;
      }, {} as any);
    }
    return {
      tableName: '', field: ''
    };
  };

  const dataUUIDMapToField = (dataUUID: string) => {
    const location = dataUUIDMapToMetadata[dataUUID];
    return locationMapToField(location).field; // 现在还没定先只取field
  };
  /**
   * 1. 只会转换结构
   * 多重复合结构还真挺复杂
   * @param struct any
   */
  const structMapToFiled = (struct) => {
    if (typeof struct === 'string') {
      return dataUUIDMapToField(struct);
    }
    if (Array.isArray(struct)) {
      return struct.map(structMapToFiled);
    }
    if (typeof struct === 'object') {
      return Object.keys(struct).reduce((result, key) => {
        // result[key] = typeof struct[key] === 'object' ? locationMapToField(struct[key]) : locationStrToField(struct[key]);
        result[key] = dataUUIDMapToField(key);
        return result;
      }, {} as any);
    }
    return false;
  };

  return {
    locationStrToField,
    locationMapToField,
    dataUUIDMapToField,
    structMapToFiled
  };
};

interface ParseFoundationTypeSchemasRes {
  mapping: string;
  value: string | boolean | number;
  rules?: unknown;
}

const parseFoundationTypeSchemas = (parseParam: FoundationTypeSchemas) => {
  const parseRes: ParseFoundationTypeSchemasRes = {
    mapping: parseParam.fieldMapping,
    value: ''
  };
  switch (parseParam.type) {
    case 'boolean':
      parseRes.value = parseParam.defaultVal || false;
      break;
    case 'num':
      parseRes.value = parseParam.defaultVal || 0;
      break;
    case 'string':
      parseRes.value = parseParam.defaultVal || '';
      break;
    default:
      break;
  }
  return parseRes;
};

const parseStruct = (parseParam: StructTypeSchemas, dataUUIDMapToMetadata: CommonObjStruct) => {
  // const struct = parseParam.struct
  return Object.keys(parseParam.struct).reduce((res, key) => {
    res[key] = '';
    dataUUIDMapToMetadata[key] = parseParam.struct[key].fieldMapping;
    return res;
  }, {} as any);
};

const DataSchemasParser = ({
  schemas, metadataCollection
} : ParseSchemasDependency): ParseSchemasResult => {
  const schemaKey = Object.keys(schemas);
  let schemaItem: SchemaItem;
  let parseTemp: ParseFoundationTypeSchemasRes;
  const schemaStruct: SchemaStruct = {};
  const dataUUIDMapToMetadata: CommonObjStruct = {};

  schemaKey.map((key) => {
    schemaItem = schemas[key];
    switch (schemaItem.type) {
      case 'structArray':
        schemaStruct[key] = []; // TODO: ? 数组怎么玩?
        break;
      case 'structObject':
        dataUUIDMapToMetadata[key] = {};
        schemaStruct[key] = parseStruct(schemaItem, dataUUIDMapToMetadata[key]);
        break;
      case 'string':
      case 'num':
      case 'boolean':
      default:
        parseTemp = parseFoundationTypeSchemas(schemaItem);
        schemaStruct[key] = parseTemp.value;
        dataUUIDMapToMetadata[key] = parseTemp.mapping;
        break;
    }
  });

  const mappingEntity = parseMetaDataMapping(metadataCollection, dataUUIDMapToMetadata);

  return {
    mappingEntity,
    schemaStruct
  };
};

export const InitPageState = (schemaStruct) => {
  const [pageRuntimeState, setState] = useState(schemaStruct);

  function setPageRuntimeState(newState) {
    setState({
      ...pageRuntimeState,
      ...newState
    });
  }

  return {
    pageRuntimeState,
    setPageRuntimeState
  };
};
export default DataSchemasParser;
