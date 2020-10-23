/** TODO: 是否需要改成set结构或更简单的Map结构 */

interface IUBDSLPageCtx {
  asyncRuntimeScheduler: any;
  runtimeScheduler: any;
}

type PageCtx = IUBDSLPageCtx
export interface PageCtxInfo<T = any> {
  // interface PageCtxInfo<T extends PageCtx = IUBDSLPageCtx> {
  pageId: string;
  pageMark: string;
  pageType?: string;
  context: T
}

export interface AddPageCtx {
  (param: Pick<PageCtxInfo, 'pageId' | 'context' | 'pageType'>): {
    pageMark: string;
    removeFn: () => void;
  }
}

/**
 * 名词:
 * 唯一标示: 指存储的页面上下文的唯一标示, 「因一个页面可以被同时多次使用, 故需要维护一套唯一标示」
 */

/**
 * 内部静态方法/属性
 * 或内部工具方法
 */
const SPLIT_MARK = '_$_';
// const isPageMark = (text: string) => text.includes(SPLIT_MARK) && getSuffixFromMark(text) !== undefined;
/** 获取唯一标示的后缀 */
// const getSuffixFromMark = (text: string) => {
//   const idx = text.lastIndexOf(SPLIT_MARK);
//   if (idx !== -1) {
//     const splitIdx = idx + SPLIT_MARK.length;
//     return parseInt(text.slice(splitIdx), 10);
//   }
//   return undefined;
// };
/** 获取唯一标示的后缀 「用pageId获取」 */
const getSuffixFromPageId = (pageMark: string, pageId: string) => {
  const pageMarkSuffix = pageMark.replace(pageId + SPLIT_MARK, '');
  return parseInt(pageMarkSuffix, 10) || 0;
};

/** ----END----- */

/**
 * 初始化页面上下文管理
 * @description 仅提供给页面管理使用
 */
export const initPageCtxManage = () => {
  // const pageCtxCollection: {
  //   [pageMark: string]: PageCtxInfo
  // } = {};
  const pageCtxCollection: PageCtxInfo[] = [];

  const pageMarks: string[] = [];

  /** 私有工具方法 */

  /** 生成唯一标示的后缀 */
  /** 校验是否为页面唯一标示 */
  const isPageMark = (text: string) => pageMarks.includes(text);
  const isPageMarkOfPageId = (mark: string, pageId: string) => mark.indexOf(pageId + SPLIT_MARK) === 0;
  /** 生成后缀 */
  const genSuffix = (pageId: string) => pageMarks.reduce((res, pageMark) => {
    if (pageMark.indexOf(pageId) === 0) {
      return Math.max(getSuffixFromPageId(pageMark, pageId) + 1, res);
    }
    return res;
  }, 0);
  /** 生成唯一的页面标示 */
  const genPageMarks = (pageId: string) => {
    const pageUseCount = genSuffix(pageId);
    return pageId + SPLIT_MARK + pageUseCount;
  };

  /** 删除某个下表的上下文 */
  const removePageCtxFromIdx = (idx: number) => {
    pageMarks.splice(idx, 1);
    return pageCtxCollection.splice(idx, 1);
  };
  /** 提取某个下标的上下文 */
  const pickCtxFromIdx = (idx: number) => {
    return pageCtxCollection[idx] || false;
  };

  /**
   * 根据页面ID获取页面所有页面上下文
   * @param pageId 页面Id
   * @param isMove 是否获取并移除页面上下文
   */
  const getPageCtxFromPageId = (pageId: string, isMove = false) => {
    const result: PageCtxInfo[] = [];
    /** 内部真实的获取上下文的方法 */
    if (isMove) {
      const recursionFn = () => {
        const idx = pageMarks.findIndex((mark) => isPageMarkOfPageId(mark, pageId));
        /** 添加上下文和递归 */
        if (idx > -1) {
          result.push(...removePageCtxFromIdx(idx));
          recursionFn();
        }
      };
      recursionFn();
    } else {
      pageMarks.forEach((mark, i) => {
        if (isPageMarkOfPageId(mark, pageId)) {
          result.push(pickCtxFromIdx(i));
        }
      });
    }
    return result;
  };
  /** 私有工具方法 - end */

  /**
   * 添加新的页面上下文
   * @param param0 添加参数
   */
  const addPageCtx: AddPageCtx = ({ pageId, context }) => {
    if (!pageId || !context) {
      throw Error('传入格式错误, pageId和context 必填');
    }

    /** 必要的数据 */
    const pageMark = genPageMarks(pageId);
    const pageCtxInfo = {
      pageMark,
      pageId,
      context
    };

    pageMarks.push(pageMark);
    pageCtxCollection.push(pageCtxInfo);

    return {
      pageMark,
      removeFn: () => {
        removePageCtx(pageMark);
      }
    };
  };

  /**
   * 删除页面上下文
   * @param param 删除参数 pageId | pageMark | pageCtxInfo[暂时不适用]
   * @returns 返回删除的结果
   */
  const removePageCtx = (pageIdOrMark: string) => {
    let idx = -1;
    let pageCtxInfo: PageCtxInfo[] = [];
    if (isPageMark(pageIdOrMark)) {
      idx = pageMarks.indexOf(pageIdOrMark);
      if (idx > -1) {
        pageCtxInfo = removePageCtxFromIdx(idx);
      }
      return pageCtxInfo;
    }
    return getPageCtxFromPageId(pageIdOrMark, true);
  };

  /**
   * 获取页面上下文
   * @param pageIdOrMark 页面Id或mark
   * @returns 获取的结果
   */
  const getPageCtx = (pageIdOrMark: string): PageCtxInfo[] => {
    if (pageIdOrMark === '' || pageIdOrMark === undefined) {
      return pageCtxCollection;
    }
    const result: any[] = [];
    // console.error(`’${pageIdOrMark}‘的页面上下文信息不存在`);

    if (isPageMark(pageIdOrMark)) {
      const idx = pageMarks.indexOf(pageIdOrMark);
      result.push(pickCtxFromIdx(idx));
    } else {
      result.push(...getPageCtxFromPageId(pageIdOrMark));
    }

    /** 过滤false并返回结果 */
    return result.filter((v) => v);
  };

  return {
    addPageCtx,
    getPageCtx,
    removePageCtx
  };
};
