import React, { useEffect, useState } from 'react';
import { queryPageData } from "@/services/page"
interface IContainerProps {

};

const Container: React.FC<IContainerProps> = (props) => {
  const [data, setData] = useState({});
  useEffect(() => {
    getPageData()
  }, [])
  const getPageData = async () => {
    const res = await queryPageData({
      id: "1308242886768336896",
      mode: "preview",
      lessee: "hy",
      app: "app"
    });
    if (res.code === '0') {
      const result = JSON.parse(res.result);
      setData(result)
    }

  }
  return (
    <div></div>
  )
};

export default React.memo(Container);
