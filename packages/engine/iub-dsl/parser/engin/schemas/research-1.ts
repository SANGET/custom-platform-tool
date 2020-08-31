/**
 * 经历的总结
 * * 第一
 * 1. 一开始的想法一个context穿透所有 failed
 * 2. 元数据、schemas,全部都在一起, 提供固定的API, 一套通用
 *
 * 不足
 * ! 没有考虑灵活扩展、由IUB-DSL描述各部分关系复杂起来, 该模块需要强行扩展. 后续会达到一个不可维护的目的
 * ! 没有明确的规则、标准.. 想过制定,但是没有找到其中最直接的关联关系
 *
 * * 第二
 * 1. 想要有一定的数据结构标准, 进行通信和描述
 *
 * 不足
 * ! 但是还没有解决根本问题思考到, 需要接入其他引擎, 也并没有考虑好
 *
 * * 第三
 * ? 数据解析原则
 * 1. 数据结构是恒定的, 但是解析器不一定.
 * * 一个结构解析器, 将内部数据全部暴露出去, 让外部自行确定解析器和上下文
 *
 * 2. 针对解析, 单个解析能力是有限的而且是独立的. 「很好的隔离和结合」
 * * 需要一个标准和工具组合这些单独功能单元并且确保运行「增强器「增强器也有很多种增强标准」、上下文标准」
 *
 * ! 未解决问题
 * !1. 通用结构标准未能准确的确定, 每一个确定的上下标准, 页面元数据描述标准也还没有很好确定,
 * !2. 异步问题「组件、循环中的异步」
 * !3. 该增强容器是否所有都适用?
 * !4. 是否需要有生命周期钩子的实现?
 * !5. 经过增强的 解析/执行 也需要作为插件贡其他单独功能单元增强 ?**?
 *
 */

import { useState, useEffect } from 'react';
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
