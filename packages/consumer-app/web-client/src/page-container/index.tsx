/**
 * TODO: 引用 redux
 */

import React, { Children } from 'react';

import { TypeOfIUBDSL } from "@iub-dsl/core/types";
import IUBDSLParser from '@iub-dsl/parser/engin';

import { AuthUIByUIID } from '../services/auth';
import $R from '../services/req';

const SpecificParser = () => {
  return (
    <div></div>
  );
};

interface PageContainerProps {
  // type: 'iub-dsl' | 'specific';
  dsl: TypeOfIUBDSL;
  pageID?: string;
  pageAuthInfo?: {};
}

const parserLoader = (type, { dsl, pageAuthInfo }) => {
  switch (type) {
    case 'config':
      return IUBDSLParser({
        // 接口反射，UI 验证
        context: {
          setContext: () => ({}),
        },
        requestAPI: $R,
        authUI: (UIID) => AuthUIByUIID(UIID, pageAuthInfo),
        dsl
      });
    case 'embed':
      return SpecificParser();
    default:
      return <div></div>;
  }
};

const PageContainer = (props: PageContainerProps) => {
  const {
    dsl, pageAuthInfo, // type, pageID
  } = props;
  const { name, id, type } = dsl || {};
<<<<<<< HEAD
  // TODO: 数据的可用性统一管理  (状态校验: loading、路由鉴权)。尝试一下，需要讨论
  return (<ValidRender
    pageAuthInfo={pageAuthInfo}
    dsl={dsl}
    Wrapper={<PageContainerWrapper></PageContainerWrapper>}
  >{
      parserLoader(type, {
        dsl,
        pageAuthInfo
      })
    }</ValidRender>);
};

const ValidRender = ({
  pageAuthInfo, dsl, Wrapper, children
}) => {
  if (!dsl) {
    return (<div>Loading</div>);
  }
  if (pageAuthInfo(dsl.id)) {
    return Wrapper ? (<Wrapper>{children}</Wrapper>) : children;
  }
  return (<div>Not Permitted</div>);
=======
  // TODO: 数据的可用性统一管理
  return dsl ? (
    <div className="page-container">
      <h1>{id}</h1>
      <h2>{name}</h2>
      {
        parserLoader(type, {
          dsl,
          pageAuthInfo
        })
      }
    </div>
  ) : (
    <div>Loading</div>
  );
>>>>>>> 31574bb159b71381c18dd4a2e93a166666bb87fc
};

const PageContainerWrapper = (props) => (
  <div className="page-container">
    <h1>{props.id}</h1>
    <h2>{props.name}</h2>
    {props.children}
  </div>
);

export default PageContainer;
