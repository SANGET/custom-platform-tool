/**
 * TODO: 引用 redux
 */

import React from 'react';
import { ProviderAppContext } from '../../types';

export interface ProviderPageContext extends ProviderAppContext {
  pageID
  pageAuthInfo
}

interface PageContainerProps extends React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  pageID?: string;
  pageAuthInfo?: any;
  appContext: ProviderAppContext
  children: (pageContext: ProviderPageContext) => JSX.Element
  ChildComp: React.ElementType
}

export const PageContainer = (props: PageContainerProps) => {
  const {
    pageID, pageAuthInfo, appContext,
    children, className, ChildComp,
    ...otherProps
  } = props;
  React.useEffect(() => {
    return () => {
      console.log('unmountPageContainer');
    };
  }, []);

  return (
    <div
      {...otherProps}
    >
      <ChildComp
        pageID={pageID}
        pageAuthInfo={pageAuthInfo}
        {
          ...appContext
        }
      />
    </div>
  );
};
