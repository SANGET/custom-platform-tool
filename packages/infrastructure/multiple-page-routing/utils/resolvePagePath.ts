let defaultSeperator = '~';

/**
 * 给 #/pathname 带上分隔符，例如  #/hashPath~xxx
 */
export const wrapPathWithSeperator = (paths: string[] = [], seperator = defaultSeperator) => {
  defaultSeperator = seperator;
  return paths.join(seperator);
};

/**
 * 分析 #/hashPath~xxx?query=string，获取 hashPath
 * @param hashPath
 */
export const resolvePagePath = (hashPath: string) => {
  return hashPath.split('?')[0].replace('#', '');
};

export const resolvePagePathWithSeperator = (pathname: string) => {
  const hashPath = resolvePagePath(pathname);
  return hashPath.split(defaultSeperator)[0].replace('#', '');
};

/**
 * 获取 pathname
 */
export const getPathname = () => resolvePagePath(window.location.hash);
