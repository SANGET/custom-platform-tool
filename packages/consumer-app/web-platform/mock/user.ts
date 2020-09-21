import { Request, Response } from 'express';

// 代码中会兼容本地 service mock 以及部署站点的静态数据
export default {
  // 支持值为 Object 和 Array
  'GET /api/currentUser': (req: Request, res: Response) => {
    res.send({
      status: null,
      success: true,
      code: 0,
      message: "成功",
      dataId: null,
      result: {
        name: 'Serati Ma',
        avatar: 'https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png',
        userid: '00000001',
        email: '122344@qq.com',
        signature: '海纳百川，有容乃大',
        title: '交互专家',
        group: 'UED',
        notifyCount: 12,
        unreadCount: 11,
        country: 'China',
        geographic: {
          province: {
            label: '广东省',
            key: '330000',
          },
          city: {
            label: '广州市',
            key: '330100',
          },
        },
        address: '番禺区',
        phone: '020-123456',
      }
    });
  },

};
