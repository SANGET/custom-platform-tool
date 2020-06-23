/**
 * TODO: 引用 redux
 */

import React from 'react';

import { TypeOfIUBDSL } from "@iub-dsl/core/types";
import IUBDSLParser from '@iub-dsl/parser/engin';
import { AuthUIByUIID } from '../services/auth';

const SpecificParser = () => {
  return (
    <div></div>
  );
};

interface PageContainerProps {
  type: 'iub-dsl' | 'specific';
  dsl: TypeOfIUBDSL;
  pageID?: string;
  pageAuthInfo?: {};
}

const parserLoader = (type, { dsl, pageAuthInfo }) => {
  switch (type) {
    case 'iub-dsl':
      return IUBDSLParser({
        // 接口反射，UI 验证
        authUI: (UIID) => AuthUIByUIID(UIID, pageAuthInfo),
        dsl
      });
    case 'specific':
      return SpecificParser();
    default:
      return <div></div>;
  }
};

const PageContainer = (props: PageContainerProps) => {
  const {
    type, dsl, pageID, pageAuthInfo
  } = props;
  const { name } = dsl || {};
  return dsl ? (
    <div className="page-container">
      <h1>{pageID}</h1>
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
};

export default PageContainer;
