/**
 * TODO: 引用 redux
 */

import React, { Children } from 'react';

import { TypeOfIUBDSL } from "@iub-dsl/definition";
import IUBDSLParser from '@iub-dsl/engine';

import IUBDSLRuntimeContainer from '@iub-dsl/engine/IUBDSLRuntimeContainer';
import { AuthUIByUIID, $R } from '../../services';
import { initPageContext } from './context';
import { Loading } from '../common';

const SpecificParser = () => {
  return (
    <div></div>
  );
};

const validAuth = (pageAuthInfo, pageId) => {
  // return AuthUIByUIID(pageId, pageAuthInfo);
  return true;
};

interface PageContainerProps {
  // type: 'iub-dsl' | 'specific';
  dsl: TypeOfIUBDSL;
  pageID?: string;
  pageAuthInfo?: {};
  appContext: {
    [str: string]: unknown
  };
}

const parserLoader = (type, appContext, { dsl, pageAuthInfo }) => {
  switch (type) {
    case 'config':
      return IUBDSLRuntimeContainer({
        // 接口反射，UI 验证
        // context: {
        //   setContext: () => ({}),
        // },
        // authUI: (UIID) => AuthUIByUIID(UIID, pageAuthInfo),
        dslParseRes: dsl
      });
    case 'embed':
      return SpecificParser();
    default:
      return <div></div>;
  }
};

/**
 * 1. appContext注入 、 数据调度器
 * 2. pageContext包揽全局、数据可用性统一管理、初始化的时候的解析和IUB解析的关系、运行时候的仓库
 */
export const PageContainer = (props: PageContainerProps) => {
  const {
    dsl, pageAuthInfo, appContext, pageID, // type, pageID
  } = props;
  if (!dsl) {
    return <Loading></Loading>;
  }

  if (dsl.id === undefined) {
    return (<div>IUB-DSL格式错误</div>);
  }

  const { name, id, type } = dsl;

  if (validAuth(pageAuthInfo, dsl.id)) {
    // 数据的可用性统一管理  (状态校验: loading、路由鉴权)。
    const ParserResult = parserLoader(type, appContext, {
      dsl,
      pageAuthInfo
    });
    // console.log(ParserResult);
    return (<PageContainerWrapper
      key={pageID}
      id={pageID}
      name={name}
    >{
        ParserResult
      }</PageContainerWrapper>);
    // return <div></div>;
  }

  return (<div>Not Permitted</div>);
};

const PageContainerWrapper = (props) => (
  <div className="page-container">
    <h1>{props.id}</h1>
    <h2>{props.name}</h2>
    {props.children}
  </div>
);
