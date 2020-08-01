/*
 * @Author: your name
 * @Date: 2020-08-01 17:12:07
 * @LastEditTime: 2020-08-01 17:12:08
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \custom-platform-v3-frontend\sonar-project.js
 */
const sonarqubeScanner = require('sonarqube-scanner');

const parameters = {
  serverUrl: 'http://localhost:9000',
  token: 'XXX',
  options: {
    'sonar.projectVersion': '1.1',
    'sonar.projectName': 'create-server',
    'sonar.projectKey': 'create-server',
    'sonar.sourceEncoding': 'UTF-8',
    'sonar.scm.provider': 'git',
    'sonar.language': 'typescript',
    'sonar.sources': 'src',
    'sonar.inclusions': 'src/**',
    'sonar.exclusions': '**/node_modules/**,**/coverage/**',
    'sonar.tests': 'test',
    'sonar.ts.tslint.configPath': 'tslint.json',
    'sonar.test.inclusions': 'src/**/*.spec.ts,test/**/*.e2e-spec.ts',
    'sonar.testExecutionReportPaths': 'coverage/test-reporter.xml',
    'sonar.javascript.lcov.reportPaths': 'coverage/lcov.info',
  }
};
sonarqubeScanner(parameters, () => process.exit());
