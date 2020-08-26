'use strict';

module.exports = {

  types: [
    {value: 'feat',     name: 'feat:     增加新功能'},
    {value: 'fix',      name: 'fix:      修复bug'},
    {value: 'docs',     name: 'docs:     修改文档'},
    {value: 'style',    name: 'style:    格式化、美化代码，不改变代码逻辑'},
    {value: 'refactor', name: 'refactor: 重构代码，不改变功能'},
    {value: 'format',   name: 'format:   格式化代码'},
    {value: 'perf',     name: 'perf:     优化代码，性能调优'},
    {value: 'test',     name: 'test:     增加、修改测试用例'},
    {value: 'chore',    name: 'chore:    改变构建流程、或者增加依赖库、工具等'},
    {value: 'revert',   name: 'revert:   回退版本'},
    {value: 'build',    name: 'build:    修改构建工具配置'},
    {value: 'update',   name: 'update:   更新文件'},
    {value: 'ci',       name: 'ci:       修改ci配置'},
    {value: 'husky',    name: 'husky:    修改husky配置'}
  ],
  messages: {
    type: '选择此次提交的类型:\n',
    scope: '此次提交影响范围（非必须）:\n',
    customScope: '此次提交影响范围（非必须）:',
    subject: '* 请简要描述提交(必填):\n',
    body: '详细说明此次提交，使用"|"可换行(非必须):\n',
    breaking: '重大变更，与上一版本不兼容时可填写 (非必须):\n',
    footer: '可关闭的issue或bug，如#123(非必须):\n',
    confirmCommit: '是否确认以上提交信息?'
  },

  allowCustomScopes: true,
  allowBreakingChanges: ['feat', 'fix'],
  subjectLimit: 100
};
