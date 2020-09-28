const baseUrl = 'http://localhost:8000';

export const getPreviewUrl = (location?) => {
  if (!location) return `${baseUrl}`;
  const { pageID, lessee = 'hy', app } = location;
  return `${baseUrl}/page?path=/preview&mode=preview&pageId=${pageID}&lessee=${lessee}&app=${app}`;
};
