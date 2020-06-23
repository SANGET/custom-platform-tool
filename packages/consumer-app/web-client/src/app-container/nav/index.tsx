import React from 'react';
import { Link } from 'multiple-page-routing';

const Nav = ({
  navConfig
}) => {
  return (
    <div className="nav-bar">
      {
        navConfig.map((item, idx) => {
          // console.log(item);
          const { id, text, path } = item;
          return (
            <div key={id}>
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

export default Nav;
