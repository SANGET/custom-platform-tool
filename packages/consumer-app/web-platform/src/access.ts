/**
 * 权限控制 控制访问者身份
 * @param initialState
 */
import { ICurrentUser } from '@/services/user';

export default function access(initialState: { currentUser?: ICurrentUser | undefined }) {
  const { currentUser } = initialState || {};
  return {
    canAdmin: currentUser && currentUser.access === 'admin',
  };
}
