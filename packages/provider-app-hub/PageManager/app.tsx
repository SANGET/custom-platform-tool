import React from "react";
import { Link } from "multiple-page-routing";

// import PageDesigner from '@provider-app/page-designer';

const App = () => {
  return (
    <div>
      <h2>页面管理器</h2>
      <Link
        to="/page-designer"
        params={{
          id: '123',
          object: {
            id: '123124',
            fad: 123124
          }
        }}
      >
        创建页面
      </Link>
      <ul>
        <li>页面1，点击管理</li>
      </ul>
    </div>
  );
};

export default App;
