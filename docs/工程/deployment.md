# 前端部署说明

## 项目地址

- https://10.0.4.55/custom-platform-v3-frontend-group/custom-platform-v3-frontend

---

## 环境准备

- node > v14
- yarn > v1.22
- npm > v6.13
- pm2 > 4.4

---

## npm 源

选其中之一

```bash
npm -------- https://registry.npmjs.org/
yarn ------- https://registry.yarnpkg.com/
cnpm ------- http://r.cnpmjs.org/
taobao ----- https://registry.npm.taobao.org/
nj --------- https://registry.nodejitsu.com/
npmMirror -- https://skimdb.npmjs.com/registry/
edunpm ----- http://registry.enpmjs.org/
```

---

## 安装 yarn

```bash
npm install -g yarn
```

---

## 构建开始

### 准备工作

```bash
git clone https://10.0.4.55/custom-platform-v3-frontend-group/custom-platform-v3-frontend {项目名}
cd /{项目名}
yarn
```

### 构建配置平台前端

通过环境变量`REACT_APP_API_URL`更改后端 api 地址

```bash
REACT_APP_API_URL=http://192.168.14.140:6090 yarn build:provider-app
```

构建后文件输出到：`/项目目录/packages/provider-app-entry/app/build`，启动 web 服务即可。

---

### 构建应用平台前端

TODO 胡东亮

---

### web 资源服务

#### 构建

```bash
cd ./web-server
npm run build
```

将构建后的文件输出到目录 `{目录}web-server/dist` 之中，然后使用 `pm2` 进程守卫来启动程序：

```bash
pm2 start {目录}web-server/dist/main.js
```

---

## nginx部署

复制构建完成后的内容到nginx服务目录下：

```bash
cp –rf /项目目录/packages/provider-app-entry/app/build/* /usr/share/nginx/prodiver-app/
```
