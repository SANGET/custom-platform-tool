/**
 * TODO: 引用 redux
 */

import React from 'react';
import { ProviderAppContext } from '../../types';

export interface ProviderPageContext extends ProviderAppContext {
  pagePath
  pageAuthInfo
}

interface PageContainerProps extends React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  pagePath?: string;
  pageAuthInfo?: any;
  location
  appContext: ProviderAppContext
  children: (pageContext: ProviderPageContext) => JSX.Element
  ChildComp: React.ElementType
}

const loadChild = (Child, props) => {
  let C;
  if (typeof Child === 'function') {
    C = Child(props);
    if (React.isValidElement(C)) {
      return C;
    }
  }
  return <C {...props} />;
};

export const PageContainer = (props: PageContainerProps) => {
  const {
    pagePath, pageAuthInfo, appContext, id,
    children, className, ChildComp, location,
    ...otherProps
  } = props;
  const pageContext = {
    pagePath,
    pageAuthInfo,
    location,
    ...appContext
  };

  return (
    <div
      {...otherProps}
    >
      {
        loadChild(ChildComp, pageContext)
      }
    </div>
  );
};
