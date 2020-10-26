# 应用的名称
app_name=reg.hydevops.com/custom-platform-v3-frontend/web-platform

# 发布的分支
release_tag=release-main-flow

app_config_path=$deploy_dir/consumer-app-config.json
app_target_env_config_path=/usr/share/nginx/html/config.json

app_port=8080
app_source_port=80

. ./cd.sh
