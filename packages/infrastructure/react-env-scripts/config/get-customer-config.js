const path = require('path');
const { configFileName } = require('./config');

const envMapper = {
  development: 'dev',
  production: 'prod'
};

const env = process.env.NODE_ENV;

const customerConfig = (function() {
  const configPath = path.join(process.cwd(), configFileName);
  try {
    const config = require(configPath);
    return config;
  } catch(e) {
    // console.log(e)
    return {};
  }
})();

module.exports = customerConfig;
