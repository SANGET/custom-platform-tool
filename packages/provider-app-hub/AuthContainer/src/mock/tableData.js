const tableData = (() => {
  const originData = [];
  const random = (num) => (Math.floor(Math.random() * num) % num);
  for (let i = 0; i < 100; i++) {
    originData.push({
      key: i.toString(),
      authName: ['基础模块', '基础数据', '人员管理', '人员信息管理', '资产管理', '认证管理'][random(6)],
      authCode: `FC_A_${['A', 'B', 'C', 'D', 'E', 'F'][random(6)]}`,
      parentId: ['', '0-0', '0-0-0'][random(3)],
      displayType: ['0', '1'][random(2)],
      createType: ['快速创建', '自定义'][random(2)],
      lastModified: (() => {
        const timeStr = new Date().toJSON().replace('T', ' ');
        return timeStr.slice(0, timeStr.indexOf('.'));
      })(),
    });
  }
  return originData;
})();

export {
  tableData
};
