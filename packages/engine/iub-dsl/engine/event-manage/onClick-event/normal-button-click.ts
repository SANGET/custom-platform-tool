export const normalButtonClick = (
  // 留坑: 第一次渲染传入的参数「配置」
) => (
  // 事件起点
  e: React.MouseEventHandler<HTMLElement>
) => ({
  type: 'normalButtonClick',
  compMark: '',
  // 一些组件配置的必要的信息
});
