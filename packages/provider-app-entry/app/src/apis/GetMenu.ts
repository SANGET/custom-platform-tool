import { ProviderAppMenuData } from "@provider-app/config/menu-data";

const GetMenu = () => {
  return new Promise<typeof ProviderAppMenuData>((resolve, reject) => {
    resolve(ProviderAppMenuData);
  });
};

export {
  GetMenu
};
