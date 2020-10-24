/**
 * TODO: 引用 redux
 */

import React, { Suspense } from 'react';
import { LoadingTip } from '@provider-ui/loading-tip';
import { AppLocationType } from '../../app';
import { ProviderAppContext } from '../../types';

export interface ProviderPageContext extends ProviderAppContext {
  pagePath
  pageAuthInfo
  appLocation
}

interface PageContainerProps
  extends React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  pagePath?: string
  pageAuthInfo?: any
  appLocation: AppLocationType
  appContext: ProviderAppContext
  ChildComp: HY.SubApp | HY.SubAppHOC
}

const loadChild = (
  Child: HY.SubApp | HY.SubAppHOC,
  props: HY.ProviderSubAppProps
) => {
  /** 处理找不到页面 */
  if (!Child) {
    console.warn(`没找到对应的页面 ${props.pagePath}`);
    return (
      <div>404</div>
    );
  }
  let C;
  const isClassComp = !!Child.prototype.render;
  if (isClassComp) {
    return <Child {...props} />;
  }
  if (typeof Child === 'function') {
    C = Child(props);
    if (React.isValidElement(C)) {
      return C;
    }
  }
  return (
    <C {...props} />
  );
};

/**
 * 页面运行容器
 */
export const PageContainer = (props: PageContainerProps) => {
  const {
    pagePath, pageAuthInfo, appContext,
    ChildComp, appLocation,
    ...otherProps
  } = props;
  const pageChildProps = {
    pageAuthInfo,
    pagePath,
    appLocation,
    ...appContext
  };

  return (
    <div
      {...otherProps}
    >

      {/* <Suspense fallback={(<LoadingTip />)}>
        <ChildComp pageChildProps={pageChildProps} />
      </Suspense> */}
      {
        loadChild(ChildComp, pageChildProps)
      }
    </div>
  );
};
