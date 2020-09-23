import { Controller, Get, Param, Query } from '@nestjs/common';
import { ResHelperService } from 'src/res-helper/res-helper.service';
import { PageDataService } from './page-data.service';

@Controller('page-data')
export class PageDataController {
  constructor(
    private readonly pageDataService: PageDataService,
    private readonly resHelperService: ResHelperService,
  ) {}

  validGetPageParam(queryString) {
    const { id, mode, lessee, app } = queryString;
    const necessaryParams = { id, mode, lessee, app };
    for (const key in necessaryParams) {
      if (Object.prototype.hasOwnProperty.call(necessaryParams, key)) {
        const item = necessaryParams[key];
        if(!item) return {
          isPass: false,
          msg: `需要参数 ${key}`
        };
      }
    }
    return {
      isPass: true,
      msg: ``
    };
  }

  @Get(`:lessee/:app/page/:id`)
  async getPageRest(@Param() params, @Query() queryString) {
    console.log(params, queryString);
    const { id, lessee, app } = params;
    const { mode } = queryString;
    const pageData = await this.pageDataService.getPageDataFromRemote({ lessee, app, id });
    const resData = this.resHelperService.wrapResStruct({ data: pageData });
    return resData;
  }

  @Get()
  async getPage(@Query() queryString) {
    // console.log(queryString)
    const { isPass, msg } = this.validGetPageParam(queryString);
    if(!isPass) return msg; 
    const { id, mode, lessee, app } = queryString;
    // if (mode === 'preview') {
    // }
    const pageData = await this.pageDataService.getPageDataFromRemote({ lessee, app, id });
    // console.log(pageData);
    const resData = this.resHelperService.wrapResStruct({ data: pageData });
    return resData;
  }
}
