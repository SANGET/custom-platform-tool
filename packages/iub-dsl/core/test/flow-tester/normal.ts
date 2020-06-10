const relativeship = {
  broadcast: {
    bc1: {
      broadcaster: {
        A: {
          // targetId: {
          //   target: ['B', 'C', 'D'],
          //   height: 0,
          //   when: 'onChange',
          //   how: {
          //     type: '',
          //     actionID: 'a1'
          //   }
          // },
          target: {
            tb: {
              field: 'B',
              when: ['onUserChange', 'onMount', 'onChange'],
              how: {
                type: '',
                actionID: 'a1'
              }
            },
            tc: {
              field: 'C',
              when: ['onApiChange'],
              how: {
                actionID: 'a2'
              }
            },
            td: {
              field: 'D',
              when: ['onChange'],
              how: {
                actionID: 'a3'
              }
            },
          }
        },
        B: {
          // targetId2: {
          //   target: ['D', 'E'],
          //   height: 99,
          //   when: 'onChange',
          //   how: {
          //     type: '',
          //     actionID: 'b1'
          //   }
          // },
          target: {
            td: {
              field: 'D',
              when: 'onChange',
              how: {
                actionID: 'b1'
              }
            }
          }
        }
      },
      targetFlowChain: {
        type: '',
        chain: [`#A.tb`, `#B.td`, `#A.tc`, `#A.td`]
      }
    }
  }
};

const actionsCollection = {
  a1: {
    flow: {
      f1: {
        variable: 'a-1',
        expression: `@handle(@A)`
      }
    }
  },
  a2: {
    flow: {
      f1: {
        variable: 'a-1',
        expression: `@handle(@A)`
      }
    }
  },
  a3: {
    flow: {
      f1: {
        variable: 'a-1',
        expression: `@handle(@A)`
      }
    }
  },
  b1: {
    flow: {
      f1: {
        variable: 'a-1',
        expression: `@handle(@B)`
      }
    }
  },

  // /////
  'b-3': {
    flow: {
      f1: {
        variable: '#a',
        expression: `@handle(@xxx)`
      },
      f2: {
        variable: '#b',
        expression: `@handle(#a)`
      },
      f3: {
        variable: '#c',
        expression: `@handle(#b)`
      },
      f4: {
        variable: '#temp4',
        expression: `@handle(#c)`
      },
    },
    flowExpression: {
      fe1: {
        variable: 'var1',
        expression: `#a > 10`,
      },
      fe2: {
        variable: 'var2',
        expression: `#{v1} < 10`,
      },
    },
    /**
     * 中等复杂场景
     */
    flowControl_normal: `
      #f1;
      if(#var1) {
        #f2
      } else {
        #f4;
        #f3;
      }
    `,
  },
};
