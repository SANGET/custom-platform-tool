import React from 'react';

const defaultAppUrl = 'http://localhost:3000';

const defaultWebServerUrl = 'http://localhost:3000';

const appUrl = process.env.REACT_APP_PREVIEW_APP_URL || defaultAppUrl;

export const ToApp = () => {
  return (
    <div
      onClick={(e) => {
        $R_P.post(`${defaultWebServerUrl}/preview-app`, {
          lessee: $R_P.urlManager.currLessee,
          app: $R_P.urlManager.currApp,
        });
      }}
    >
      <a
        // href={appUrl}
        // target="_blank"
        style={{ color: "white" }}
      >
        进入应用系统
      </a>
    </div>
  );
};
