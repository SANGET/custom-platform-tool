const fse = require('fs-extra');
const path = require('path');

const packageData = fse.readFileSync(path.resolve(__dirname, '../package.json'), 'utf8');
const { version } = JSON.parse(packageData);

const scriptsRef = ['start', 'build', 'test'];

module.exports = {
  version,
  scriptsRef,
}