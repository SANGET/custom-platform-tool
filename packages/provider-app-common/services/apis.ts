import { getAppConfig } from "@provider-app/config/config-manager";

/**
 * 预览
 * @param appID
 */
export async function previewAppService(appID: string) {
  const lessee = $R_P.urlManager.currLessee;
  const appUrl = getAppConfig('apiUrl');
  return await $R_P.get({
    url: `${appUrl}/paas/${lessee}/manage/v1/applications/preview/${appID}`,
  });
}
