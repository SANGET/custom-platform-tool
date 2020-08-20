const appRuntimeState = {
  appName: "xx系统",
  // 用于确定页面 tab 顺序
  pageTabList: ["pageId1"],
  pageEntities: {
    pageId: {
      data: {},
    },
  },
  /** 页面运行时数据状态 */
  getSystemContext: () => ({}),
  getDataFromApi: () => {},
};

const pageRuntimeState = {
  pageName: "pageName",
  pageId: "pageId",
};
