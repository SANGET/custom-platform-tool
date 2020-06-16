import { CreateUserPage } from "@iub-dsl/core/test/create-user-page";
import componentParser from "./component-parser";

const parser = (pageDSL) => {
  const res = pageDSL.body.map(({ component }) => {
    return componentParser(component);
  });
  return res;
};

parser(CreateUserPage);

// 行为与表现分离
