import { Request, Response } from 'express';

export default {

  'POST /api/login/account': (req: Request, res: Response) => {
    res.send({
      status: null,
      success: true,
      code: 0,
      message: "成功",
      dataId: null,
      result: null,
    });
  }

};
