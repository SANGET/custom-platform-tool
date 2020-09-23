import { Helmet, HelmetProvider } from 'react-helmet-async';
import React from 'react';
import styles from './UserLayout.less';

export interface IUserLayoutProps {
  children: React.ReactNode;
}

const UserLayout: React.FC<IUserLayoutProps> = (props) => {
  const {
    children,
  } = props;
  return (
    <HelmetProvider>
      <Helmet>
        <title>登录</title>
        <meta name="description" content="登录" />
      </Helmet>

      <div className={styles.container}>
        <div className={styles.content}>
          {children}
        </div>
      </div>
    </HelmetProvider>
  );
};

export default React.memo(UserLayout);
