#/bin/bash

echo -e "\033[34m deploying app: $app_name:$release_tag \033[0m"
echo -e "\033[34m config path: $app_config_path \033[0m"
echo -e "\033[34m app source config path: $app_target_env_config_path \033[0m"
echo -e "\033[34m docker starting cmd: docker run -d -p $app_port:$app_source_port -v $app_config_path:$app_target_env_config_path $app_name:$release_tag \033[0m"

docker stop $app_name
docker pull $app_name:$release_tag
docker run -d -p $app_port:$app_source_port -v $app_config_path:$app_target_env_config_path $app_name:$release_tag