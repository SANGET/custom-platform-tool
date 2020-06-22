const relationship = {
  broadcast: {
    bc1: {
      broadcaster: {
        A: {
          target: {
            tb: {
              field: "B",
              when: ["onUserChange", "onMount", "onChange"],
              how: {
                type: "",
                actionID: "a1",
              },
            },
            tc: {
              field: "C",
              when: ["onApiChange"],
              how: {
                actionID: "a2",
              },
            },
          },
        },
        B: {
          target: {
            td: {
              field: "D",
              when: "onChange",
              how: {
                actionID: "b1",
              },
            },
          },
        },
        C: {
          target: {
            tb: {
              field: "B",
              when: "onChange",
              how: {
                actionID: "c1",
              },
            },
            td: {
              field: "D",
              when: "onChange",
              how: {
                actionID: "c1",
              },
            },
            te: {
              field: "E",
              when: "onChange",
              how: {
                actionID: "c1",
              },
            },
          },
        },
        D: {
          target: {
            te: {
              field: "E",
              when: "onChange",
              how: {
                actionID: "d1",
              },
            },
          },
        },
      },
    },
  },
  // subscribe: {
  //   subscriber: {
  //     E: {
  //       target: {
  //         'tc&d': {
  //           field: ['C', 'D'],
  //           type: '&',
  //           when: ['onChange'],
  //           how: {
  //             type: '',
  //             actionID: 'e1'
  //           }
  //         },
  //         'tc|d': {
  //           field: ['C', 'D'],
  //           type: '|',
  //           when: ['onChange'],
  //           how: {
  //             type: '',
  //             actionID: 'e2'
  //           }
  //         },
  //       }
  //     }
  //   }
  // },
  targetFlowChain: {
    type: "",
    // chain1: `
    //   #a1;
    //   var b_1 = exp_B(#a2, #c1);
    //   exp_E(
    //     exp_D(#b1, #c2),
    //     #c3
    //   );
    // `,
    // chain2: `
    //   #a1;
    //   exp_E(
    //     exp_D(
    //       exp_B(#a2, #c1),
    //       #c2
    //     ),
    //     #c3
    //   );
    // `,
    chain3: `
      #a1;
      pipe(
        exp_B(#a2, #c1),
        exp_D(
          $0,
          #c2
        ),
        exp_E(
          $1,
          #c3
        )
      ), 
    `,
    chain: `#a1 => c; (#a2); #B.td; exp_&(#C.te, #D.te)`,
    "exp_&": {
      type: "lowCode",
      // 1、触发条件。 2、同一个handle 3、不同的handle
      triggerCondition: "后更改的值触发 ｜ 同时触发 ｜ 低代码判断",
      // 默认嵌套什么内容，由生成器决定
      handler: (C, D) => {
        // `@handle(#C, #D)`
        return C + D;
      },
    },
    exp_B: {},
    exp_E: {},
    // chain: `a->b; b->d; a->c; (c->e & d->e)`
    // chain: `e->d & (e->c & (d->c | d->b)) & b->c & b->a & c->a`
  },
  // targetFlowChain: {
  //   type: '',
  //   chain: `#A.tb; #A.tc; #B.td; exp_&(#C.te, #D.te)`,
  //   'exp_&': {
  //     type: 'lowCode',
  //     handler: (C, D) => {
  //       // `@handle(#C, #D)`
  //       return C + D;
  //     }
  //   }
  //   // chain: `a->b; b->d; a->c; (c->e & d->e)`
  //   // chain: `e->d & (e->c & (d->c | d->b)) & b->c & b->a & c->a`
  // }
};

const dataCahnge = {
  broadcast: {
    data_UUID1: {
      data_UUID2: {
        when: ['onChange'],
        how: {
          type: '',
          actionID: 'a2'
        }
      }
    }
  },
  targetFlowChain: {
    data_UUID1 : {
      type: '',
      chain: `
      pipe(
        #a1,
        #a2,
        pipe(
          #a3;
        )
      )
      `,
      // useActions: ['actionUUID']
    }
  }
}

const rule = {
  userFrom: {
    type: 'onFource/onSubmit',
    data_UUID1: [
      {reqire: true, msg: 'fa'}
    ]
  }
}

const actionsCollection = {
  a1: {
    flow: {
      f1: {
        variable: "a-1",
        expression: `@handle(@A)`,
      },
    },
  },
  a2: {
    flow: {
      f1: {
        variable: "a-1",
        expression: `@handle(@A)`,
      },
    },
  },
  a3: {
    flow: {
      f1: {
        variable: "a-1",
        expression: `@handle(@A)`,
      },
    },
  },
  b1: {
    flow: {
      f1: {
        variable: "a-1",
        expression: `@handle(@B)`,
      },
    },
  },
  c1: {
    flow: {
      f1: {
        variable: "c-1",
        expression: `@handle(@C)`,
      },
    },
  },
  d1: {
    flow: {
      f1: {
        variable: "d-1",
        expression: `@handle(@D)`,
      },
    },
  },
};
