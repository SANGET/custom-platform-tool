import React, { useCallback } from 'react';
import {
  Link
} from 'multiple-page-routing';

export const TabNav = ({
  routers, routerSnapshot, activeRoute, getRouteName,
  onClose
}) => {
  return (
    <div
      className="tabs-for-multiple-router bg-gray-200"
    >
      {
        routers.map((route, idx) => {
          const { params: routeInfoParams } = routerSnapshot[route];
          const { title, key, closable } = routeInfoParams;
          const _title = title || getRouteName(route) || `${route}_未设置 title`;
          return (
            <div
              key={route}
              className={`tab-item${activeRoute === route ? ' active bg-gray-100' : ''}`}
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
