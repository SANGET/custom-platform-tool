import { mockMenuData } from "../config/menu.mock";

const GetMenu = () => {
  return new Promise((resolve, reject) => {
    resolve(mockMenuData);
  });
};

export {
  GetMenu
};
