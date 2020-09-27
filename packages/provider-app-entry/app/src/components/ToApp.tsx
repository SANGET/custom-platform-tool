import React from 'react';

const defaultAppUrl = 'http://localhost:8000/preview?path=/preview&mode=preview&pageId=xxxxxx';

const defaultWebServerUrl = 'http://localhost:3000';

const getPreviewUrl = (location) => {
  const { pageID, lessee = 'hy', app } = location;
  return `http://localhost:8000/page?path=/preview&mode=preview&pageId=${pageID}&lessee=${lessee}&app=${app}`;
};

export const ToApp = ({
  location
}) => {
  return (
    <div
      onClick={(e) => {
        // const preWindow = window.open(appUrl);
        // $R_P.post(`${defaultWebServerUrl}/preview-app`, {
        //   lessee: $R_P.urlManager.currLessee,
        //   app: $R_P.urlManager.currApp,
        // });
      }}
    >
      <a
        href={getPreviewUrl(location)}
        target="_blank"
        style={{ color: "white" }}
      >
        进入应用系统
      </a>
    </div>
  );
};
