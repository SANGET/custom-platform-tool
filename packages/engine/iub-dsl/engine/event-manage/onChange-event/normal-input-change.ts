export const normalInputChange = (
  // 留坑: 第一次渲染传入的参数「配置」
) => (
  // 事件起点
  e: React.ChangeEvent<HTMLInputElement>
) => ({
  type: 'normalInputChange',
  payload: e.target.value,
  compMark: '',
  // 一些组件配置的必要的信息
});
