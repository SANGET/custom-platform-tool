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

  useEffect(() => {
    /** 设置 app 为空，因为还未选择 app */
    $R_P.urlManager.setApp('');
    GetApplication().then((appResData) => {
      setAppData(appResData.result);
    });
  }, []);

  return (
    <div className="container mx-auto">
      <h3>我的工作台</h3>
      <div className="flex flex-row bg-gray-200">
        {
          appData && appData.map(((data) => {
            const { appShortNameEn, id, appCode } = data;
            return (
              <div
                key={id}
                className="text-gray-700 text-center bg-gray-400 px-4 py-2 m-2"
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
              </div>
            );
          }))
        }
      </div>
    </div>
  );
};
