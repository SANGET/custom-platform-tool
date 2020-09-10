const actionsCollection = {
  "b-3": {
    flow: {
      f1: {
        // frc => flow runtime context
        variable: "#group1.a",
        expression: `@insert(@group1)`, // int [] {}
      },
      f2: {
        variable: "#temp1",
        expression: `@fetch(#group1.a)`,
      },
      f3: {
        variable: "#temp3",
        expression: `@fetch(#temp1)`,
      },
      f4: {
        variable: "#temp4",
        expression: `@fetch(#temp3)`,
      },
    },
    flowExpression: {
      fe1: {
        variable: "var1",
        expression: `#{group1.a} > 10`,
      },
      fe2: {
        variable: "var2",
        expression: `#{v1} < 10`,
      },
    },
    /** 简单场景：按钮 -> 发送查询条件的表单数据 -> 获取表格数据 */
    flowControl_simple: `
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
