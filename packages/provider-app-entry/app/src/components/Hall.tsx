import React, { useState, useEffect } from "react";
import { Link, setDefaultParams } from "multiple-page-routing";
import { GetApplication } from "../apis";

const defaultToRoute = '/page-manager';

/**
 * 入口大厅
 *
 * 导航时需要注意：
 *
 * 1. 设置默认的路由为 app
 */
export const Hall: HY.SubApp = (props) => {
  const [appData, setAppData] = useState([]);
  console.log(appData);
  useEffect(() => {
    /** 设置 app 为空，因为还未选择 app */
    $R_P.urlManager.setApp('');
    GetApplication().then((appResData) => {
      setAppData(appResData.result);
    });
  }, []);
  console.log('asd');
  return (
    <div>
      <h3>工作台</h3>
      <ul>
        {
          appData && appData.map(((data) => {
            const { appShortNameEn, id, appCode } = data;
            return (
              <li
                key={id}
              >
                <Link
                  to={defaultToRoute}
                  onClick={(e) => {
                    setDefaultParams({
                      app: appCode
                    });
                  }}
                  params={{
                    app: appCode
                  }}
                >
                  {appShortNameEn}
                </Link>
              </li>
            );
          }))
        }
      </ul>
    </div>
  );
};
