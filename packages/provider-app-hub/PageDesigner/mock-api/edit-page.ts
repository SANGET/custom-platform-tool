export const ApiSavePage = (pageData) => {
  const pageID = pageData.id;
  return new Promise((resolve) => {
    localStorage.setItem(pageID, JSON.stringify(pageData));
    resolve();
  });
};
export const ApiGetPageData = (pageID: string) => {
  return new Promise((resolve) => {
    const pageDataStr = localStorage.getItem(pageID);
    let pageData;
    if (pageDataStr) {
      try {
        pageData = JSON.parse(pageDataStr);
      } catch (e) {
        console.log(e);
      }
    }
    resolve(pageData);
  });
};
