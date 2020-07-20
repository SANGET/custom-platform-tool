const treeData = [
  {
    title: '基础模块',
    key: '0-0',
    children: [
      {
        title: '基础数据',
        key: '0-0-0',
        children: [
          { title: '人员管理', key: '0-0-0-0' },
          { title: '人员信息查询', key: '0-0-0-1' },
          { title: '岗位信息', key: '0-0-0-2' }
        ]
      },
    ]
  },
  {
    title: '资产管理',
    key: '0-1',
    children: [
      { title: '设备品牌与型号', key: '0-1-0' },
      { title: '资产编码信息', key: '0-1-2' },
      { title: '区域/点位管理', key: '0-1-3' }
    ]
  },
  {
    title: '认证管理',
    key: '0-2',
    children: [
      {
        title: '打卡数据管理',
        key: '0-2-0',
        children: [
          {
            title: '打卡数据',
            key: '0-2-0-0',
            children: [
              { title: '导出', key: '0-2-0-0-0' },
              { title: '定时/手动同步', key: '0-2-0-0-1' },
            ]
          },
          {
            title: '打卡设备',
            key: '0-2-0-1',
            children: [
              { title: '导出', key: '0-2-0-1-0' },
              { title: '新建/删除/导入', key: '0-2-0-1-1' },
            ]
          },
          { title: '打卡数据同步记录', key: '0-2-0-2' }
        ]
      },
      { title: '认证数据管理', key: '0-2-1' },
      { title: '认证人员管理', key: '0-2-2' }
    ]
  }
];

export { treeData };
