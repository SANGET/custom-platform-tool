import React, { useEffect, useState } from 'react';
import { history } from 'umi';
import { Skeleton, Result } from 'antd';
import { queryPageData } from "@/services/page";
import { IUBDSLRenderer } from '@iub-dsl/platform/react';
import './index.less';

interface IContainerProps {

}

const Container: React.FC<IContainerProps> = (props) => {
  const [data, setData] = useState({});
  const { query } = history.location;
  const {
    pageId, mode, lessee, app
  } = query;
  useEffect(() => {
    getPageData();
  }, [query]);
  const getPageData = async () => {
    if (pageId) {
      // TODO 模式，租户，app 参数来源
      const res = await queryPageData({
        id: pageId,
        mode: mode || "prod",
        lessee: lessee || "hy",
        app: app || "iot"
      });
      setData(res.data?.result || {});
    }
  };
  if (!pageId) {
    return (
      <Result
        status="500"
        title="500"
        subTitle="页面解析出错"
        extra={null}
      />
    );
  } if (data?.pageID) {
    return (
      <IUBDSLRenderer dsl={data} />
    );
  }
  return <Skeleton active />;
};

export default React.memo(Container);
