import React, { useState } from 'react';
import { TypeOfIUBDSL, DefaultSchemas } from "@iub-dsl/definition";
import { StructRef, FieldRef } from '@iub-dsl/definition/schemas/default-schemas';
import { dependencyInspect } from "..";

const generateDataSource = (dataSource) => {
  const mapping = {};
  Object.keys(dataSource).forEach((tableId) => {
    Object.keys(dataSource[tableId].columns).forEach((dataUUID) => {
      mapping[`${tableId}.${dataUUID}`] = dataSource[tableId].columns[dataUUID];
    });
  });
  return mapping;
};

const useStore = (initialState) => {
  const [state, setstate] = useState(initialState);

  return {
    state, setstate
  };
};

// 解析同时存储原本的
/**
 * 缺少校验信息、数据选择权重、元数据映射
 */
const parseStruct = (struct: { [str: string]: FieldRef}) => {
  const initialState = {};
  let temp: FieldRef;
  Object.keys(struct).forEach((dataUUID) => {
    temp = struct[dataUUID];
    switch (temp.type) {
      case 'boolean':
        initialState[dataUUID] = temp.defaultVal || false;
        break;
      case 'num':
        initialState[dataUUID] = temp.defaultVal || null;
        break;
      case 'any':
      case 'string':
      default:
        initialState[dataUUID] = temp.defaultVal || '';
        break;
    }
  });
  return initialState;
};

const createStore = (schemasRef: DefaultSchemas) => {
  const store: any = {};
  let tempRef: StructRef;
  let initialState;
  let newStore;
  Object.keys(schemasRef).forEach((schemasUUID) => {
    tempRef = schemasRef[schemasUUID];
    switch (tempRef.type) {
      case 'array':

        break;
      case 'object':
      default:
        initialState = parseStruct(tempRef.struct);
        store[schemasUUID] = useStore(initialState);
        break;
    }
    initialState = null;
  });
  return store;
};

const parseMetaData = ({ metadataCollection, schemas, sysRtCxtInterface }: TypeOfIUBDSL) => {
  console.log({ metadataCollection, schemas, sysRtCxtInterface });
  if (dependencyInspect()) {
    // 元数据映射集合
    // const metadataMapping = generateDataSource(metadataCollection.dataSource);
    // console.log(metadataMapping);

    const transfromStruct = () => ({}); // 将UUID结构转化为

    const pageStore = createStore(schemas.page);
    const flowStore = createStore(schemas.flow);

    return {
      pageStore: Object.assign(flowStore, pageStore)
    };
  }
  return {};
};

export default parseMetaData;
