import { useModel } from 'umi';

export default async () => {
  const { fetchMenuList } = useModel("menu");
  return await fetchMenuList();
};
