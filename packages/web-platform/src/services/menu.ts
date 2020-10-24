import { originGenUrl } from "@/utils/gen-url";
import { getPageQuery } from '@/utils/utils';
/**
 * 获取用户菜单
 * @param params
 */
export async function queryMenuList(params: API.IMeunParams) {
  const { app, lessee } = getPageQuery();
  return $A_R(originGenUrl(lessee, app, "queryPerson"), {
    method: 'POST',
    data: {
      steps: [
        {
          function: {
            code: "ALL_ACTIVE_MENU",
            params: {
            }
          }
        }
      ]
    },
  });
}
