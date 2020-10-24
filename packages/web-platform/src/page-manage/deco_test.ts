function helloWord(isTest: boolean) {
  return function (target: any) {
    // 添加静态变量
    // target.isTestable = isTest;
  };
}

function classDecorator(constructor) {
  return function (C) {
    const A = new C();
    return A;
  };
  // return class extends constructor {
  //   newProperty = "new property";

  //   hello = "override";
  // };
}

@classDecorator('a')
@helloWord(false)
class Greeter {
  property = "property";

  hello: string;

  constructor(m: string) {
    this.hello = m;
  }
}

console.log(new Greeter("world"));
