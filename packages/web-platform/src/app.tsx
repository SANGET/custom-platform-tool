// eslint-disable-next-line @typescript-eslint/no-var-requires
import request from "umi-request";

const getHostEnv = async () => {
  const json = await request(`/config.json?${new Date().getTime()}`);
  console.dir(json);
  window.HOST = json;
};
getHostEnv();
// const HOST = require(`../public/config.json`);
// request();
// window.HOST = HOST;
