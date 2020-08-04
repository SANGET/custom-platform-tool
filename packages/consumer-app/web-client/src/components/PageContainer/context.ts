interface PageContext {

  [str: string]: unknown;
  pageStore: {
    [str: string]: unknown
  };
  flowStore: {
    [str: string]: unknown
  }
}

export const initPageContext: (appContext, iub: any) => PageContext = () => {
  return {
    pageStore: {},
    flowStore: {}
  };
};
