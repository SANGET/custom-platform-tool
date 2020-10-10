export const normalInputChange = (
  // 动作流程
  actionHandle, context
) => (
  // 事件起点
  e: React.ChangeEvent<HTMLInputElement>
) => {
  // 标准化输入
  const inputChangeAction = {
    type: 'normalInputChange',
    changeValue: e.target.value,
    compMark: '',
    // 一些组件配置的必要的信息
  };
  actionHandle(inputChangeAction, context);
};
