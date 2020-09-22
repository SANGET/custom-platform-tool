# 搭建独立应用

在 `packages/` 中对应的目录（根据需要开发的子应用决定，以下以 CustomSubApp 为例）。

> 可以参考[子应用模版](./.template/CustomSubApp/package.json)。

1. 新建文件夹 `CustomSubApp`
2. 在 `CustomSubApp/` 添加 `package.json`
3. 添加 `public/`，可以从模版中 copy
4. 在 `package.json` 的 `scripts` 中添加 `"start": "cross-env PORT=9988 minictl start"`，端口可以自定义
5. 添加 `.mini-scripts.json` 工程化配置文件
6. 添加 `src/app.tsx` 和 `src/index.tsx`，内容参考子应用模版
7. 在最外层的 `package.json` 中添加启动 script: `"start:custom-sub-app": "cd ./package/CustomSubApp && npm start"`
8. 打开命令后输入 `yarn && yarn start:custom-sub-app`，等待片刻即可

## 1. 搭建自定义模块

### 1.1. 定义

更多时候需要搭建一些共用的模块，用于提高团队合作效率，以下是搭建过程：

> 可以参考[模块模版](./.template/CustomModule/package.json)。

1. 新建文件夹 `CustomModule`
2. 在 `CustomModule/` 添加 `package.json`

package.json 的必要字段：

```json
{
  "name": "@scope-name/module-name",
  "version": "0.0.1",
  "private": true,
  "author": "SANGET",
  "license": "MIT"
}
```

`name` 的规则是 `npm` 的 `scope` 标准。

完成上述步骤后，需要在项目根目录通过 `yarn` 将模块连接起来（link），link 工作由 yarn 和 lerna 完成。

### 1.2. 使用

通过上述操作后，其他模块可以引用 `@scope-name/module-name` 中的模块：

```ts
import { moduleName } from '@scope-name/module-name';

moduleName();
```
