/**
 * 获取当前用户信息
 */
export async function queryUserInfo() {
  return {
    status: null,
    success: true,
    code: 0,
    message: "成功",
    dataId: null,
    result: {
      account: {
        create_userid: "3cd8a151c4f944fb898bc6e392dafd8b",
        PswLastChangeTime: "2019-08-06 15:57:02",
        create_time: 1564609094000,
        loginname: "admin",
        MemberId: "3b1ff0fcc60740689aff9da29bbc522c",
        last_update_time: 1565078222000,
        password: "/fOMjRWQGQ2mGvPcfFNWdA==",
        last_update_userid: "3cd8a151c4f944fb898bc6e392dafd8b",
        yonghunichen: "admin",
        bczt: 0,
        _state: "",
        qiyonghuojinyongzhuangtai: "1",
        id: "b77f482dcd80402e9adff614bb2645b0",
        username: "admin"
      },
      organization: {
        create_userid: "4be6ef3a5d914cd19c388313583e2b5d",
        create_time: 1556319695000,
        bczt: 0,
        name: "12212",
        id: "008276d8163d4e489fb302c341a40aa6",
        Code: "12"
      },
      roles: [
        {
          IsRoot: "1",
          last_update_time: 1547155260000,
          create_time: 1547155260000,
          bczt: 1,
          jiaosebieming: "系统管理员",
          name: "系统管理员",
          id: "48c4bf3a55894e1ca0f542c233948036",
          Remark: ""
        }
      ],
      member: {
        create_userid: "3cd8a151c4f944fb898bc6e392dafd8b",
        Email: "wenlingmin@haoyuntech.com",
        create_time: 1564609062000,
        Sex: "男",
        MobilePhone: "1233211234567",
        Weight: "90",
        Name: "管理员",
        OrgId: "008276d8163d4e489fb302c341a40aa6",
        last_update_time: 1564609062000,
        last_update_userid: "3cd8a151c4f944fb898bc6e392dafd8b",
        bczt: 0,
        WorkNumber: "100001",
        Height: "1",
        id: "3b1ff0fcc60740689aff9da29bbc522c",
        PostStatus: "1"

      }
    }
  };
  // return $A_R.post('http://localhost:8000/auth/user/info/cur');
}
