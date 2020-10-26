app_name=reg.hydevops.com/custom-platform-v3-frontend/provider-app-entry
release_tag=release-main-flow
config_path=/root/custome-platform-frend-end/provider-app-config.json
target_env_config_path=/usr/share/nginx/html/config.json

docker stop $app_name
docker pull $app_name:$release_tag
docker run -d -p 7070:80 -v $config_path:$target_env_config_path $app_name:$release_tag