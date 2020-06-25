/**
 * TODO: 引用 redux
 */

import React from 'react';

interface PageContainerProps {
  pageID?: string;
  pageAuthInfo?: {};
}

const PageContainer = (props: PageContainerProps) => {
  const {
    pageID, pageAuthInfo, children
  } = props;
  // TODO: 数据的可用性统一管理
  return (
    <div className="page-container">
      <h1>{pageID}</h1>
      {children}
    </div>
  );
};

export default PageContainer;
