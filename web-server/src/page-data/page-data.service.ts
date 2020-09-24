import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { PreviewAppService } from 'src/preview-app/preview-app.service';

const mockToken = 'Bearer 1295915065878388737';

@Injectable()
export class PageDataService {
  constructor(
    private readonly previewAppService: PreviewAppService
  ) {}

  /**
   * 页面数据转 IUB-DSL 数据
   * @param pageData 
   */
  pageData2IUBDSL(pageData) {
    const { iubDsl } = pageData;
    let contentData;
    const IUBDSLData = {
      sysRtCxtInterface: {},
      schemas: {},
      metadataCollection: {},
      relationshipsCollection: {},
      componentsCollection: {},
      actionsCollection: {},
      layoutContent: {},
    };
    try {
      contentData = JSON.parse(iubDsl);
      IUBDSLData.layoutContent = {
        type: 'general',
        content: contentData.content
      };
    } catch(e) {
      console.log(e);
      contentData = iubDsl;
    }
    return IUBDSLData;
  }
  
  /**
   * 从远端获取页面数据
   */
  async getPageDataFromRemote({
    lessee,
    app,
    id
  }): Promise<any> {
    const token = this.previewAppService.getToken(lessee);
    const reqUrl = `http://192.168.14.140:6090/paas/${lessee}/${app}/page/v1/pages/${id}`;
    try {
      const resData = await axios
        .get(reqUrl, {
          headers: {
            Authorization: mockToken
          }
        });
      return this.pageData2IUBDSL(resData?.data?.result);
    } catch(e) {
      return e;
    }
  }
}
// `http://192.168.14.140:6090/paas/hy/app/page/v1/pages/1308242886768336896`