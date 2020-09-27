import React, { useEffect, useState } from 'react';
import { history } from 'umi';
import { queryPageData } from "@/services/page";
import { IUBDSLRenderer } from '@iub-dsl/platform/react';

interface IContainerProps {

}

const Container: React.FC<IContainerProps> = (props) => {
  const [data, setData] = useState({});
  useEffect(() => {
    getPageData();
  }, []);
  const getPageData = async () => {
    const { query } = history.location;
    const {
      pageId, mode, lessee, app
    } = query;
    if (pageId) {
      const res = await queryPageData({
        id: pageId,
        mode,
        lessee,
        app
      });
      setData(res?.result || {});
    }
  };
  return (
    <>
      <IUBDSLRenderer dsl={data} />
    </>
  );
};

export default React.memo(Container);
