import { mockMenuData } from "../config/menu.mock";

const GetMenu = () => {
  return new Promise<typeof mockMenuData>((resolve, reject) => {
    resolve(mockMenuData);
  });
};

export {
  GetMenu
};
