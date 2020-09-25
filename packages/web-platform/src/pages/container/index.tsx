import React, { useEffect, useState } from 'react';
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
    const res = await queryPageData({
      id: "1308242886768336896",
      mode: "preview",
      lessee: "hy",
      app: "app"
    });
    if (res.code === "00000") {
      const { result } = res;
      setData(result);
    }
  };
  // console.dir(IUBDSLRenderer);
  return (
    <>
      <IUBDSLRenderer dsl={data} />
    </>
  );
};

export default React.memo(Container);
