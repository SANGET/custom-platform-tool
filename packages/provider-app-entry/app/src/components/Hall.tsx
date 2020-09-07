import React, { useState, useEffect } from "react";
import { Link } from "multiple-page-routing";
import { GetApplication } from "../apis";

const defaultToRoute = '/page-manager';

export const Hall: HY.SubApp = (props) => {
  const [appData, setAppData] = useState([]);
  useEffect(() => {
    GetApplication().then((appResData) => {
      setAppData(appResData.result);
    });
  }, []);
  return (
    <div>
      <h3>工作台</h3>
      <ul>
        {
          appData.map(((data) => {
            const { appShortNameEn, id, appCode } = data;
            return (
              <li
                key={id}
              >
                <Link
                  to={defaultToRoute}
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
