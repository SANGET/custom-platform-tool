import React from 'react';

const defaultAppUrl = 'http://localhost:3000';

const appUrl = process.env.REACT_APP_APP_URL || defaultAppUrl;

export const ToApp = () => {
  return (
    <a href={appUrl} target="_blank" style={{ color: "white" }}>进入应用系统</a>
  );
};
