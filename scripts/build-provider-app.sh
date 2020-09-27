# 清除工作区
rm -rf ./dist/provider-app

# 创建文件夹
mkdir -p ./dist/provider-app

# 保存当前的路径
pwd=$PWD

# 构建所有项目
cd "$pwd/packages/provider-app-entry/app" && yarn build
#  && mv ./dist/* "$pwd/dist/provider-app"