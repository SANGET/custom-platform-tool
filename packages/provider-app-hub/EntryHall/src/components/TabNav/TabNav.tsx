import React, { useCallback } from 'react';
import {
  Link
} from 'multiple-page-routing';

export const TabNav = ({
  routers, routerInfo, activeRoute, onClose
}) => {
  return (
    <div
      className="tabs-for-multiple-router"
    >
      {
        routers.map((route, idx) => {
          const { params: routeInfoParams } = routerInfo[route];
          const { title, key, closable } = routeInfoParams;
          const _title = title || `${route}_未设置 title`;
          return (
            <div
              key={route}
              className="tab-item"
            >

              <Link
                to={route}
                className="tab-item-btn"
                params={routeInfoParams}
              >
                {_title}
              </Link>
              <div
                className="close-btn" onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  onClose(idx);
                }}
              >
                x
              </div>
            </div>
          );
        })
      }
    </div>
  );
};
