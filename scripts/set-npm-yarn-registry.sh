# 安装 npm 和 yarn 的源管理工具
# 如果没有 nrm 命令，则进入安装过程
if command -v nrm >/dev/null 2>&1; then
  echo 'exsits nrm, setting registry.'
else 
  npm i nrm yrm -g
fi

# 设置 npm 的源为 cnpm
yrm use cnpm

# 设置 yarn 的源为 cnpm
nrm use cnpm