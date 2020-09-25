const AppConfig = {
  apiUrl: ''
};

export const getAppConfig = (configKey = '') => {
  return configKey ? AppConfig[configKey] : AppConfig;
};

export const setAppConfig = (nextConfig) => {
  // return configKey ? AppConfig[configKey] : AppConfig;
  Object.assign(AppConfig, nextConfig);
  window.$AppConfig = nextConfig;
};
