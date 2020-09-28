// eslint-disable-next-line @typescript-eslint/no-var-requires
import request from "umi-request";
import HOSTENV from '@/utils/env';

const getHostEnv = async () => {
  const json = await request(`/config.json?${new Date().getTime()}`);
  HOSTENV.set(json);
};
getHostEnv();
