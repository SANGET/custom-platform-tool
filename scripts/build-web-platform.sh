# 清除工作区
rm -rf ./dist/web-platform

# 创建文件夹
mkdir -p ./dist/web-platform

# 保存当前的路径
pwd=$PWD

# 构建所有项目
cd "$pwd/packages/web-platform" && yarn build
#  && mv ./dist/* "$pwd/dist/web-platform"