import request from '@/utils/request';

export interface ICurrentUser {
  avatar?: string;
  name?: string;
  title?: string;
  group?: string;
  signature?: string;
  userid?: string;
  access?: 'user' | 'guest' | 'admin';
  unreadCount?: number;
}
export interface APICurrentUser {
  success: boolean;
  code: number;
  message: string;
  dataId: null;
  result: ICurrentUser;
}

/**
 * 获取单前用户信息
 */
export async function queryCurrent() {
  return request<APICurrentUser>('/api/currentUser');
}
