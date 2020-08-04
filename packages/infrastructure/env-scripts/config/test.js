/*
 * @Author: your name
 * @Date: 2020-08-04 11:15:05
 * @LastEditTime: 2020-08-04 15:22:36
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \custom-platform-v3-frontend\packages\infrastructure\env-scripts\config\test.js
 */
/* eslint-disable @typescript-eslint/no-var-requires */

const path = require('path');

const pathResolve = (dir) => path.resolve(__dirname, '../../../provider-app-hub/', dir);
console.log("\n\n\n\n\n", pathResolve('DataDesigner'));
