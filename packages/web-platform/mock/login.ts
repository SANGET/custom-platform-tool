import { Request, Response } from 'express';

export default {

  'POST /auth/token': (req: Request, res: Response) => {
    res.send({
      status: null,
      success: true,
      code: 0,
      message: "成功",
      access_token: "c2886b8c-b42d-4470-a742-73c9ec479c5c",
      token_type: "bearer",
      refresh_token: "9bd29ea0-60c7-46f0-90fc-2cc89dd507e0",
      expires_in: 3328,
      scope: "all"

    });
  },
  'GET /api/login/outLogin': (req: Request, res: Response) => {
    res.send({ result: {}, code: 0 });
  },
};
