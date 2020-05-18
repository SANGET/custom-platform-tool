const path = require('path');
const { customWebpackConfig } = require('./config');

const envMapper = {
  development: 'dev',
  production: 'prod'
};

const env = process.env.NODE_ENV;

const customerConfig = (function() {
  const configPath = path.join(process.cwd(), customWebpackConfig);
  try {
    const config = require(configPath);
    return config;
  } catch(e) {
    // console.log(e)
    return {};
  }
})();

module.exports = customerConfig;
