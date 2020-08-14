import { sleep, Enhancer } from "../utils";

export const complexStructParserMiddleware = [
  // async (ctx, next) => {
  //   console.log(1);
  //   console.log(ctx);
  //   const newCtx = await next();
  //   console.log(6);
  //   return newCtx;
  // },
  // (ctx, next) => {
  //   console.log(2);
  //   // console.log(ctx);
  //   next();
  //   console.log(4);
  //   return ctx;
  // },
  // async (ctx, next) => {
  //   console.log(3);
  //   // console.log(ctx);
  //   await next();
  //   console.log(5);
  //   // return ctx;
  // },
];

export const foundationParserMiddleware = [
  {
    handle: async (ctx, next) => {
      await next();
    },
    resolveHandle: (c, param) => {
      const { schemaItem } = c;
      return schemaItem.type;
    }
  },
];

export const testEnhancer = () => {
  const mm = [
    {
      handle: async (ctx, next) => {
        console.log(1, ctx);
        await sleep(2);
        const prevRes = await next();
        console.log('1 resolve');
        await sleep(3);
        console.log(prevRes);
        return '1ctx';
      },
      resolveHandle: (c, param) => {
        console.log(c, param);
        param.handleResult.then((a) => {
          console.log('ee');
        });
        return { c: 9, b: 3 };
      }
    },
    {
      handle: async (ctx, next) => {
        console.log(2, ctx);
        const prevRes = await next();
        console.log('2 resolve');
        await sleep(2);
        console.log(prevRes);
        return '2ctx';
      },
    },
    {
      handle: async (ctx, next) => {
        console.log(3, ctx);
        const prevRes = next();
        console.log('3 resolve');
        sleep(5).then((r) => {
          console.log('不受控');
        });
        console.log(prevRes);
        return '3ctx';
      },
      resolveHandle: (c, param) => {
        console.log(c, param);
        param.handleResult.then((a) => {
          console.log('e');
        });
        return { c: 93, b: 3 };
      }
    },
    {
      handle: async (ctx, next) => {
        console.log(4, ctx);
        ctx.b = 3;
        // await sleep(5);
        const prevRes = await next();
        console.log('4 resolve');
        await sleep(2);
        console.log(prevRes);
        return '4ctx';
      },
    },
  ];

  const ctx = {
    a: 1, b: 2, c: 3
  };

  const { generateHandle, addEchancerList, subscribe } = Enhancer(mm, {
    lastHandle: (res) => {
      console.log(res);
    }
  });
  subscribe((data) => {
    console.log(140);
    console.log(data);
  });
  const { context, runingHandle, firstResponse } = generateHandle(ctx, {});

  console.log('66666666了哈');
  console.log(runingHandle, firstResponse);
  subscribe((data) => {
    console.log(150);
    console.log(data);
  });
  runingHandle().then((e) => {
    console.log(`${e}ennd`);
  });
  // 还是有点不稳定, 后面再调试
  subscribe((data) => {
    console.log(160);
    console.log(data);
  });
};
