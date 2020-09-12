
// const pageContext = {
//   flowContext: {
//     group1: {
//       method: 'insert',
//       tableName: 'dataSourceId1',
//       params: {
//         componentBindField_UUID_1: '',
//       }
//     }
//   }
// };
const pageContext = {
  flowContext: {
    group1: {
      a: ''
    }
  }
};

const tempFlowContext = clone(pageContext.flowContext);
tempFlowContext.group1.a = '1';
tempFlowContext.temp2 = '1';
tempFlowContext.done();

const store = {}

// 错误方向
const f1 = (flowContext, pageContext) => {
  const resData = pageContextfetch(flowContext, a?, b?, c?, d?, e?);
  flowContext.v1 = resData;
  flowContext['gourp1'] = resData;
};
const f2 = () => {};
const f3 = () => {};
const f4 = () => {};

/** XJ */
const pageContext = {
  dataSourceRef: {},
  flowStore: {
    group1: {}
  },
}

const fetch = () => {
  apbdslT({
    method: 'insert',
    tableName: 'user',
    params: {

    }
  }
}

async function expressionParser () {
  const v1 = await f1(pageContext.flowStore);
  if(fe1.expression()) {
    await f2(pageContext.flowStore);
  }
}

// 错误方向
function fetch(gourp2, a, b, c, d, e) {
  if (!a) a = {}
  apbdslT({
    method: 'insert',
    tableName: 'user',
    params: {
      b: b,
      c: c,
      d: d,
      e: e,
      ...gourp2,
      ...a,
    }
  })
}

function f1(flowContext, pageContext) {
  let a = @fetch(@group1); // {}
  let b = @fetch(@group1); // string
  let c = @fetch(@group1); // int
  #group2.a = a
  #group2.b = b
  #group2.c = c
  #group3 = @fetch(#group2); // []
  #group4 = @fetch(@group1); // int
  @fetch(@group4)
}

/** GC */
if (1) {
  @(f1(@store['temp1', 'group1', '...'])));
  @mark(f2(@store['temp1', 'group1', '...'])));
  
} else {
  @async(@mark(f3(@store['temp1', 'group1', '...']))));
  @update()
}
@mark(f4(@store['temp1', 'group1', '...'])));

.... otherFlow

@update()

