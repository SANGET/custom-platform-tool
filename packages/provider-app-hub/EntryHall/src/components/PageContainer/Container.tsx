/**
 * TODO: 引用 redux
 */

import React from 'react';
import { ProviderAppContext } from '../../types';

export interface ProviderPageContext extends ProviderAppContext {
  pagePath
  pageAuthInfo
  location
}

interface PageContainerProps
  extends React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  pagePath?: string
  pageAuthInfo?: any
  location
  appContext: ProviderAppContext
  ChildComp: HY.SubApp | HY.SubAppHOC
}

const loadChild = (
  Child: HY.SubApp | HY.SubAppHOC,
  props: HY.SubAppSpec
) => {
  /** 处理找不到页面 */
  if (!Child) {
    console.error(`没找到对应的页面 ${props.pagePath}`);
    return (
      <div>404</div>
    );
  }
  let C;
  if (typeof Child === 'function') {
    C = Child(props);
    if (React.isValidElement(C)) {
      return C;
    }
  }
  return <C {...props} />;
};

/**
 * 页面运行容器
 */
export const PageContainer = (props: PageContainerProps) => {
  const {
    pagePath, pageAuthInfo, appContext, id,
    className, ChildComp, location,
    ...otherProps
  } = props;
  const pageChildProps = {
    pageAuthInfo,
    pagePath,
    location,
    ...appContext
  };

  return (
    <div
      {...otherProps}
    >
      {
        loadChild(ChildComp, pageChildProps)
      }
    </div>
  );
};
