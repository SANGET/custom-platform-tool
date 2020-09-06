import React from "react";
import { Link } from "multiple-page-routing";

const defaultToRoute = '/page-manager';

export const Hall: HY.SubApp = (props) => {
  return (
    <div>
      <h3>工作台</h3>
      <ul>
        <li>
          <Link
            to={defaultToRoute}
            params={{
              app: 'smart_building'
            }}
          >第四代物联网智慧管理平台系统</Link></li>
        <li>
          <Link
            to={defaultToRoute}
            params={{
              app: 'smart_building'
            }}
          >智慧浩云系统</Link></li>
        <li>
          <Link
            to={defaultToRoute}
            params={{
              app: 'smart_building'
            }}
          >智慧天网考核系统</Link></li>
      </ul>
    </div>
  );
};
