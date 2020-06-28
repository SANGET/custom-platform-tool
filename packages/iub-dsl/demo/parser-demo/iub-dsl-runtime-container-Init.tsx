import React, { Component } from 'react';
import { getLayout, getComponent } from '@infra/ui-interface';

const parseData = {
  pageSchema1: {
    UUID1: '',
  }
};

const TableMappingCollection = {
  dataSourceId1: 'User'
};

const MappingCollection = {
  // uuid2: 'dataSourceId2.department', // faild
  uuid3: {
    field: 'dataSourceId2.department',
    relation: '',
  }
};

// TODO:
function EventWrap(events, actions) {
  return () => {
    // 栈处理、是否相互依赖处理、事务
  };
}

// TODO:
// sysContext
// flowStore
// mapping
// 校验规则

// pageStore
const InitStore = () => {
  return {
    pageSchema1: {
      UUID1: '',
    },
    pageSchema2: []
  };
};
const GetStore = () => {
  return InitStore();
};

const getfiledOfStore = (store, filedPath) => {
  filedPath.reduce((res, filedKey, index) => {
    if (res[filedKey] !== undefined) {
      res = res[filedKey];
    } else {
      throw Error();
    }
  }, store);
};

const parseProps = (allProps, compConfig) => {
  const compProps = compConfig.props;
  // 分析Props
  allProps.props = {};
  if (compProps.dataSorce !== undefined) {
    allProps.props.dataSource = getfiledOfStore(store, compProps.dataSorce);
  }
  return allProps;
};

const parseBusiness = (allProps, compConfig) => {
  const compActions = compConfig.actions;
  allProps.actions = {};
  Object.keys(compActions).forEach((events) => {
    allProps.actions.events = EventWrap(events, compActions[events]);
  });

  return allProps;
};

export const parser = (config) => {
  switch (config.type) {
    case 'layout':
      return LayoutParser({ config });
    case 'layout':
      return CompParser({ config });
    default:
      return '404';
  }
  return;
};
export const LayoutParser = ({ config, }) => {
  const LayoutRef = getLayout(config.type);

  return <>
    <LayoutRef {...config} >{parser(config)}</LayoutRef>
  </>;
};

export const CompParser = ({ config }) => {
  // const { pageSchema1, pageSchema2 } = GetStore();
  const store = GetStore();
  const ComponentRef: Component = getComponent(config.component.type);
  // 分析field
  const filedPath = config.component.filed;
  let allProps: any = {
    compId: '',
    sorceFiled: '',
    value: getfiledOfStore(store, filedPath),
  };
  allProps = parseProps(allProps, config);
  allProps = parseBusiness(allProps, config);
  return <>
    <ComponentRef {...allProps}></ComponentRef>
  </>;
};

// 应用：权限、路由、加载资源、页面运行容器、数据调度
// 页面运行：iub-解析、页面上下文(上下文通讯)、
// iub-解析：初始化解析、运行时解析、运行时页面上下文？
