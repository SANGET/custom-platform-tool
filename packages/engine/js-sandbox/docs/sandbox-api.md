---
title: 沙箱API
order: 2
group:
  path: /
nav:
  title: API
  order: 1
  path: /api
---


# 配置项

## context

- Type: `object`
- Default: `{}`

沙箱需要用到的参数

如果在window上面则可以不传,默认包含单前上下文环境的window


## options

- Type: `object`
- Default: `{blackList: []}`

黑名单列表，如果出现则沙箱内取不到单前属性,例如 `blackList: ['alert']` 则容器中调用alert("")失败。
