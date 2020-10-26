# 工作目录
work_dir=/var/custom-platform-fe

# 部署的路径
deploy_dir=$work_dir/app_env_config

# 部署全部应用
. ./provider_app_cd.sh
. ./consumer_app_cd.sh
. ./node_web_server_cd.sh
