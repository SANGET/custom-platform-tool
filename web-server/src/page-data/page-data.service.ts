import { Injectable } from '@nestjs/common';
import axios from 'axios';
import produce from 'immer';
import { PreviewAppService } from 'src/preview-app/preview-app.service';

const mockToken = 'Bearer 1295915065878388737';

const flatLayoutNode = (layoutNode, parentID?) => {
  console.log(parentID);
  const componentsCollection = {};
  const layoutContentBody = [];
  layoutNode.forEach((nodeItem) => {
    // const nodeItemI = produce(nodeItem, draft => draft);
    const { id, body } = nodeItem;
    Object.assign(nodeItem, {
      type: 'componentRef',
      component: {
        ...nodeItem.component,
        ...nodeItem.propState
      }
    });
    // 删除内部字段
    delete nodeItem._classID;
    delete nodeItem._state;
    delete nodeItem.propState;
    componentsCollection[id] = Object.assign({}, nodeItem,
      parentID && {
        parentID
      });
    nodeItem.componentID = id;
    nodeItem.refID = id;
    layoutContentBody.push(nodeItem);
    
    if(body) {
      flatLayoutNode(body, id);
    }
  });
  return { componentsCollection, layoutContentBody };
};

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
      pageID: '',
      name: '',
      type: '',
    };
    try {
      contentData = JSON.parse(iubDsl);
      const pageContent = contentData.content;
      const { componentsCollection, layoutContentBody } = flatLayoutNode(pageContent);
      IUBDSLData.layoutContent = {
        type: 'general',
        content: layoutContentBody
      };
      IUBDSLData.pageID = contentData.id;
      IUBDSLData.name = contentData.name;
      IUBDSLData.type = 'config';
      IUBDSLData.componentsCollection = componentsCollection;
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