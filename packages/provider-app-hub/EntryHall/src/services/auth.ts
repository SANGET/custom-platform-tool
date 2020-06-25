interface UIAuthConfig {
  [UIID: string]: boolean;
}

interface PageAuthConfig {
  pageID: string;
  isPageActive: boolean;
  uiAuthConfig?: UIAuthConfig;
}

const GetPageAuthConfig = (pageID: string): Promise<PageAuthConfig> => {
  return new Promise((resolve, reject) => {
    resolve({
      pageID,
      isPageActive: true,
      uiAuthConfig: {
        comID1: true
      }
    });
  });
};

const AuthUIByUIID = (UIID: string, uiAuthConfig: UIAuthConfig) => {
  return !!uiAuthConfig[UIID];
};

export {
  GetPageAuthConfig,
  AuthUIByUIID
};
