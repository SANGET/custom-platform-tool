/**
 * 获取用户菜单
 * @param params
 */
export async function queryMenuList(params: API.IMeunParams) {
  return $A_R('/haoyun/erp/business/34562', {
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
