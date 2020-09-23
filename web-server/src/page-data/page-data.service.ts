import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { PreviewAppService } from 'src/preview-app/preview-app.service';

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
    console.log(pageData);
    const { iubDsl } = pageData;
    return iubDsl;
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
    const resData = await axios
      .get(reqUrl, {
        headers: {
          Authorization: token
        }
      });
    return this.pageData2IUBDSL(resData?.data?.result);
  }
}
// `http://192.168.14.140:6090/paas/hy/app/page/v1/pages/1308242886768336896`