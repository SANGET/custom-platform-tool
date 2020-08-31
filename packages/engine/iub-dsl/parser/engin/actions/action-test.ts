const MockLocationType = [
  {
    value: '0', label: '建筑物分组'
  },
  {
    value: '1', label: '建筑物'
  },
  {
    value: '2', label: '楼层'
  },
  {
    value: '3', label: '区域'
  }
];

const MockLocationData = [
  {
    id: 0,
    locationName: '天安科技园',
    locationType: '0',
    pid: null,
  },
  {
    id: 1,
    locationName: '浩云科技',
    locationType: '1',
    pid: 0,
  },
  {
    id: 2,
    locationName: '1楼',
    locationType: '2',
    pid: 1,
  },
  {
    id: 3,
    locationName: '培训室',
    locationType: '3',
    pid: 2,
  },
  {
    id: 4,
    locationName: '饭堂',
    locationType: '3',
    pid: 2,
  },
  {
    id: 5,
    locationName: '南村万博',
    locationType: '0',
    pid: null,
  },
  {
    id: 6,
    locationName: '万达广场',
    locationType: '1',
    pid: 5,
  },

];

export const getLocationType = () => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(MockLocationType);
    }, 1000);
  });
};
