const baseUrl = 'http://10.11.6.193:8000';

export const getPreviewUrl = (location?, appName = '测试应用') => {
  if (!location) return `${baseUrl}`;
  const { pageID, lessee = 'hy', app } = location;
  return `${baseUrl}/page?menuid=/preview&mode=preview&pageId=${pageID}&lessee=${lessee}&app=${app}&appName=${appName}`;
};
