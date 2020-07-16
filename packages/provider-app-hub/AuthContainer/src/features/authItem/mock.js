const treeData = [
  {
    title: '基础模块',
    key: 'basicModule',
    children: [
      {
        title: '基础数据',
        key: 'basicData',
        children: [
          { title: '人员管理', key: 'staffMangager' },
          { title: '人员信息查询', key: 'staffInfo' },
          { title: '岗位信息', key: 'jobInfo' }
        ]
      },
      {
        title: '0-0-1',
        key: '0-0-1',
        children: [
          { title: '0-0-1-0', key: '0-0-1-0' },
          { title: '0-0-1-1', key: '0-0-1-1' },
          { title: '0-0-1-2', key: '0-0-1-2' }
        ]
      },
      {
        title: '0-0-2',
        key: '0-0-2'
      }
    ]
  },
  {
    title: '0-1',
    key: '0-1',
    children: [
      { title: '0-1-0-0', key: '0-1-0-0' },
      { title: '0-1-0-1', key: '0-1-0-1' },
      { title: '0-1-0-2', key: '0-1-0-2' }
    ]
  },
  {
    title: '0-2',
    key: '0-2'
  }
];

export {
  treeData
};
