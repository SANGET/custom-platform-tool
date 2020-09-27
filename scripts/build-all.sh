# 清除工作区
rm -rf ./dist

# 创建文件夹
mkdir -p ./dist/provider-app
mkdir -p ./dist/consumer-app
mkdir -p ./dist/web-server

# 保存当前的路径
pwd=$PWD

# 构建所有项目
cd "$pwd/web-server" && yarn build && mv ./dist/* "$pwd/dist/web-server"
cd "$pwd/packages/provider-app-entry/app" && yarn build && mv ./dist/* "$pwd/dist/provider-app"
cd "$pwd/packages/web-platform" && yarn build && mv ./dist/* "$pwd/dist/consumer-app"