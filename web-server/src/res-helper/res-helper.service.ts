import { Injectable } from '@nestjs/common';
import BusinessCodes from './business-res-code';

export interface WrapResStructOptions {
  data: any
  code?: typeof BusinessCodes[keyof typeof BusinessCodes]
  msg?: string
}

@Injectable()
export class ResHelperService {

  BusinessCodes = BusinessCodes

  /**
   * 包装统一的返回格式
   */
  wrapResStruct(options: WrapResStructOptions) {
    const { data, code = BusinessCodes.Success, msg = 'Success' } = options;
    return {
      data,
      code,
      msg
    };
  }
}
