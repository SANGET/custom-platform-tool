/**
 * 权限控制 控制访问者身份
 * @param initialState
 */
export default function access(initialState: { currentUser }) {
  return {
    canAdmin: true,
  };
}
