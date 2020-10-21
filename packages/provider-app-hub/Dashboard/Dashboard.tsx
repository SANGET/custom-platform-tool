import React, { useState, useEffect } from "react";
import {
  BankOutlined, PieChartOutlined, GithubOutlined, PlusOutlined
} from "@ant-design/icons";
import { Link } from "multiple-page-routing";
import { GetApplication } from "@provider-app/services";

const defaultToRoute = '/page-manager';

const iconGroupTemp = [
  <GithubOutlined />,
  <BankOutlined />,
  <PieChartOutlined />,
];

interface AppTileProps {
  icon
  title
  onClick?
  params?
  to?
}

const AppTile = ({
  icon,
  title,
  onClick,
  params,
  to
}: AppTileProps) => {
  return (
    <div
      className="m-4"
    >
      <Link
        to={to}
        onClick={onClick}
        params={params}
        className="text-gray-700 text-center block px-24 py-6 bg-white shadow-md cursor-pointer"
      >
        <div className="app-icon text-6xl">
          {icon}
        </div>
        <div className="app-title py-2">
          {title}
        </div>
      </Link>
    </div>
  );
};

const mockData = {
  id: '123',
  appCode: '31',
  appShortNameEn: '测试应用'
};

export interface DashboardProps {
  onSelectApp: (appInfo: {
    app: string
    appName: string
  }) => void
  didMount?: () => void
}

/**
 * 入口大厅
 *
 * 导航时需要注意：
 *
 * 1. 设置默认的路由为 app
 */
export const Dashboard: React.FC<DashboardProps> = (props) => {
  const { didMount, onSelectApp } = props;
  const [appData, setAppData] = useState([]);

  useEffect(() => {
    didMount && didMount();
    GetApplication().then((appResData) => {
      setAppData(appResData.result);
    });
  }, []);

  return (
    <div className="container mx-auto mt20">
      <div className="text-3xl px-2 py-10 font-bold">我的应用</div>
      <div className="flex flex-row">
        {
          appData && appData.map(((data, idx) => {
            const {
              appShortNameEn, id, appCode, accessName
            } = data;
            return (
              <AppTile
                key={id}
                icon={iconGroupTemp[idx]}
                title={appShortNameEn}
                onClick={(e) => {
                  onSelectApp && onSelectApp({
                    app: accessName,
                    appName: appShortNameEn
                  });
                }}
                to={defaultToRoute}
                params={{
                  app: accessName
                }}
              />
            );
          }))
        }
        <AppTile
          // to="/page-manager"
          icon={<PlusOutlined />}
          title="添加应用"
        />
      </div>
    </div>
  );
};
