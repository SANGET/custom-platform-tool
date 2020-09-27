import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { RolesGuard } from 'src/auth-guard/roles.guard';
import { ResHelperService } from 'src/res-helper/res-helper.service';
import { Roles } from 'src/roles/roles.decorator';
import { PageDataService } from './page-data.service';

@Controller('page-data')
@UseGuards(RolesGuard)
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

  async getPageData(options) {
    try {
      const pageData = await this.pageDataService.getPageDataFromRemote(options);
      return {
        data: pageData
      };
    } catch(e) {
      return {
        err: e
      };
    }
  }

  @Get(`:lessee/:app/page/:id`)
  @Roles('admin')
  async getPageRest(@Param() params, @Query() queryString) {
    const { id, lessee, app } = params;
    const { mode } = queryString;
    const { err, data } = await this.getPageData({ id, lessee, app });
    const resData = this.resHelperService.wrapResStruct({ 
      data,
      code: err ? this.resHelperService.BusinessCodes.Error : this.resHelperService.BusinessCodes.Success,
      msg: err || undefined
    });
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
// if(!request.headers) return { code: '500', msg: '未授权' };