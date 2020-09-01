import React from "react";
import { Link } from "multiple-page-routing";

// import PageDesigner from '@provider-app/page-designer';

const App: HY.SubApp = (props) => {
  return (
    <div>
      <h2>页面管理器</h2>
      <Link
        to="/page-designer?create"
        params={{
          title: '新建页面',
          /** 必须要的页面 id */
          pageID: 'create'
        }}
      >
        创建页面
      </Link>
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
