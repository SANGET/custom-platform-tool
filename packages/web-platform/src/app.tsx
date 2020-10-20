// eslint-disable-next-line @typescript-eslint/no-var-requires
import HOSTENV from '@/utils/env';
import { initRequest } from './utils/request';

const getHostEnv = async () => {
  const envConfig = await fetch(`/config.json?${new Date().getTime()}`).then((res) => res.json());
  initRequest(envConfig.API);
  HOSTENV.set(envConfig);
};
export const dva = {
  config: {
    onError(err) {
      err.preventDefault();
    },
  },
};

export async function render(oldRender) {
  await getHostEnv();
  oldRender();
}
