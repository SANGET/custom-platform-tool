# 前端部署说明

## 1. 项目地址

- https://10.0.4.55/custom-platform-v3-frontend-group/custom-platform-v3-frontend

---

## 2. 环境准备

- node > v14
- yarn > v1.22
- npm > v6.13
- pm2 > 4.4

---

## 3. npm 源

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

## 4. 安装 yarn

```bash
npm install -g yarn
```

---

## 5. 构建开始

### 5.1. 准备工作

```bash
git clone https://10.0.4.55/custom-platform-v3-frontend-group/custom-platform-v3-frontend {项目名}
cd /{项目名}
yarn
```

### 5.2. 前端静态资源

环境配置文件是 `{部署目录}/config.json` ，由 docker 启动时动态指定。

#### 5.2.1. 构建配置平台前端

```bash
yarn build:provider-app-entry
```

构建后文件输出到：`/项目目录/packages/provider-app-entry/app/dist`

#### 5.2.2. 构建应用平台前端

```bash
yarn build:web-platform
```

构建后文件输出到：`/项目目录/packages/web-platform/dist`

---

### 5.3. web 资源服务

#### 5.3.1. 构建

```bash
yarn build:web-server
```

将构建后的文件输出到目录 `/项目目录/packages/web-server/dist` 之中，然后使用 `pm2` 进程守卫来启动程序：

```bash
pm2 start {目录}web-server/dist/main.js
```

---

## 6. nginx部署

复制构建完成后的内容到nginx服务目录下：

```bash
cp –rf /项目目录/packages/provider-app-entry/app/build/* /usr/share/nginx/prodiver-app/
```
