# 清除工作区
rm -rf ./dist/web-server

# 创建文件夹
mkdir -p ./dist/web-server

# 保存当前的路径
pwd=$PWD

# 构建所有项目
cd "$pwd/packages/web-server" && yarn build