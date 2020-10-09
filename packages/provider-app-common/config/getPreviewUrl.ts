const baseUrl = 'http://localhost:8000';
// const baseUrl = 'http://10.11.6.193:8000';

export const getPreviewUrl = (appLocation?, appName = '测试应用') => {
  if (!appLocation) return `${baseUrl}`;
  const { pageID, lessee = 'hy', app } = appLocation;
  return `${baseUrl}/page?menuid=/preview&mode=preview&pageId=${pageID}&lessee=${lessee}&app=${app}&appName=${appName}`;
};
