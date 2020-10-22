/** TODO: 是否需要改成set结构或更简单的Map结构 */

interface IUBDSLPageCtx {
  asyncRuntimeScheduler: any;
  runtimeScheduler: any;
}

type PageCtx = IUBDSLPageCtx
interface PageCtxInfo<T extends PageCtx = IUBDSLPageCtx> {
  pageId: string;
  pageMark: string;
  context: T
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
/** 校验是否为页面唯一标示 */
const isPageMark = (text: string) => text.includes(SPLIT_MARK) && getSuffixFromMark(text) !== undefined;
/** 获取唯一标示的后缀 */
const getSuffixFromMark = (text: string) => {
  const idx = text.lastIndexOf(SPLIT_MARK);
  if (idx !== -1) {
    const splitIdx = idx + SPLIT_MARK.length;
    return parseInt(text.slice(splitIdx), 10);
  }
  return undefined;
};
/** 获取唯一标示的后缀 「用pageId获取」 */
const getSuffixFromPageId = (pageMark: string, pageId: string) => {
  const pageMarkSuffix = pageMark.replace(pageId + SPLIT_MARK, '');
  return parseInt(pageMarkSuffix, 10) || 0;
};
/** 生成唯一标示的后缀 */
const genSuffix = (pageId: string) => pageMarks.reduce((res, pageMark) => {
  if (pageMark.indexOf(pageId) === 0) {
    return Math.max(getSuffixFromPageId(pageMark, pageId), res);
  }
  return res;
}, 0);
/** 生成唯一的页面标示 */
const genPageMarks = (pageId: string) => {
  const pageUseCount = genSuffix(pageId);
  return pageId + SPLIT_MARK + pageUseCount;
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

  const addPageCtx = ({ pageId, context, pageMark }: PageCtxInfo) => {
    if (!pageId || !context) {
      throw Error('传入格式错误, pageId和context 必填');
    }

    if (!pageMark) {
      pageMark = genPageMarks(pageId);
    }

    const pageCtxInfo = {
      pageMark,
      pageId,
      context
    };

    pageMarks.push(pageMark);
    pageCtxCollection.push(pageCtxInfo);

    return () => {
      removePageCtx(pageMark);
    };
  };

  /**
   *
   * @param param pageId | pageMark | pageCtxInfo
   * 不实用对象了
   */
  const removePageCtx = (pageIdOrMark: string) => {
    let idx = -1;
    let pageCtxInfo: PageCtxInfo[] = [];

    if (typeof param === 'object') {
      idx = pageCtxCollection.indexOf(param);
    } else if (typeof param === 'string') {
      if (isPageMark(param)) {
        idx = pageMarks.indexOf(param);
      } else {
        return removePageCtxFromPageId(param);
      }
    }
    if (idx > -1) {
      pageCtxInfo = removePageCtxFromIdx(idx);
    }
    return pageCtxInfo;
  };

  const removePageCtxFromIdx = (idx: number) => {
    pageMarks.splice(idx, 1);
    return pageCtxCollection.splice(idx, 1);
  };

  const removePageCtxFromPageId = (pageId: string) => {
    const removeRes: PageCtxInfo[] = [];
    const removeFn = () => {
      const idx = pageMarks.findIndex((mark) => mark.indexOf(pageId) === 0);
      if (idx > -1) {
        removeRes.push(...removePageCtxFromIdx(idx));
        /** 有删除, 递归 */
        removeFn();
      }
    };
    /** 删除 */
    removeFn();
    return removeRes;
  };

  /**  */
  const getPageCtx = (pageIdOrMark: string): PageCtx[] => {
    const result: any[] = [];
    const pickCtx = ({ context }: PageCtxInfo) => {
      if (!context) {
        console.error(`’${pageIdOrMark}‘的页面上下文信息不存在`);
        return false;
      }
      return context;
    };
    if (isPageMark(pageIdOrMark)) {
      const idx = pageMarks.indexOf(pageIdOrMark);
      result.push(pickCtx(pageCtxCollection[idx]));
    } else {
      pageMarks.forEach((mark, i) => {
        if (mark.indexOf(pageIdOrMark) === 0) {
          result.push(pickCtx(pageCtxCollection[i]));
        }
      });
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
