import React, { useState, useEffect } from "react";
import { Link } from "multiple-page-routing";
import { Button } from "antd";
import { ShowModal } from "@infra/ui";
import { getPageListServices, createPageServices } from "./services/apis";
import { CreatePage } from "./pages/CreatePage";

// import PageDesigner from '@provider-app/page-designer';

const App: HY.SubApp = (props) => {
  const [pageList, setPageList] = useState([]);
  useEffect(() => {
    getPageListServices().then((pageListRes) => {
      console.log(pageListRes);
      setPageList(pageListRes?.result?.data);
    });
    // return () => {
    //   cleanup;
    // };
  }, []);
  return (
    <div>
      <h2>页面管理器</h2>
      <Button
        onClick={(e) => {
          // console.log('asd');
          ShowModal({
            title: '创建页面',
            width: 700,
            children: () => {
              return (
                <div className="p20">
                  <CreatePage />
                </div>
              );
            }
          });
        }}
      >
        创建页面
      </Button>
      {/* <Link
        to="/page-designer?create"
        params={{
          title: '新建页面',
          pageID: 'create'
        }}
      >
        创建页面
      </Link> */}
      <ul>
        <li>
          <Link
            to="/page-designer?page1"
            params={{
              title: '页面1',
              /** 必须要的页面 id */
              pageID: 'pageID1'
            }}
          >
            页面1，点击管理
          </Link>
        </li>
        <li>
          <Link
            to="/page-designer?page1"
            params={{
              title: '页面1',
              /** 必须要的页面 id */
              condition: {
                sa: '123'
              }
            }}
          >
            页面1，点击管理
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default App;
