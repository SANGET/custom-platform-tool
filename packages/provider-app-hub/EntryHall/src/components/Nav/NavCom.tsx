import React from 'react';
import { Link } from 'multiple-page-routing';

export const Nav = ({
  navConfig
}) => {
  return (
    <div className="nav-bar layout">
      {
        navConfig.map((item, idx) => {
          // console.log(item);
          const { id, text, path } = item;
          return (
            <div key={id} className="p10">
              <Link to={path}>
                {text}
              </Link>
            </div>
          );
        })
      }
    </div>
  );
};
