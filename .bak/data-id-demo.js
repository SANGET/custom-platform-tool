const DataStore = {
  DataID1: '',
  DataID2: '',
  DataID3: '',
  DataID4: '',
};
const DataID2Field = {
  DataID1: 'username',
  DataID2: 'age',
  DataID3: 'department',
  DataID4: '',
};

const pageA = [
  {
    type: 'Input',
    id: '1',
    properties: {
      value: {
        bind: 'DataID1'
      },
      showValue: {
        bind: 'DataID2'
      }
    }
  },
  {
    type: 'Input',
    id: '2',
    properties: {
      value: {
        bind: 'DataID3'
      },
      showValue: {
        bind: 'DataID4'
      }
    }
  },
  {
    type: 'Input',
    id: '3',
    properties: {
      value: {
        bind: 'DataID3'
      },
      showValue: {
        bind: 'DataID4'
      }
    }
  },
];

const pageB = [
  {
    type: 'Input',
    properties: {
      value: {
        ref: 'pageA.DataID1'
      }
    }
  }
];

const linkage = {
  DataID1: {
    target: 'DataID2',
    how: `add(1, 2)`
  }
};
