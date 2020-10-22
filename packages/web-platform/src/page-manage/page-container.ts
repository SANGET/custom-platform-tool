/**
 * @description 页面运行容器职责
 * 1. 管理页面的运行时上下文「IUBDSL/定制」「基础功能」
 * 2. 跨页面上下文调用
 * 3. 跨页面数据通讯
 * 3. 跨页面执行任务
 * 4. 跨页面数据观察
 * 5. 「有关跨页面所有内容」
 * @instance 实现方式
 * 1. 类单例 + 修饰符扩展「有点难」
 * 2. 函数方法的单例 + 混入
 */

interface PageManage{
  g: string
}

let pageManageInstance: PageManage;

export const pageManage = () => {
  if (pageManageInstance !== null) return pageManageInstance;
  const instance = {
    g: ''
  };

  return (pageManageInstance = instance);
};
