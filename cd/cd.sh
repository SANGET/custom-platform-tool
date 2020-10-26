#/bin/bash

echo -e "\033[34m stoping app: $app_alias \033[0m"

docker stop $app_alias

echo -e "\033[34m pulling app: $app_name:$release_tag \033[0m"
echo -e "\033[34m deploying app: $app_name:$release_tag \033[0m"

docker pull $app_name:$release_tag

echo -e "\033[34m config path: $app_config_path \033[0m"
echo -e "\033[34m app source config path: $app_target_env_config_path \033[0m"
echo -e "\033[34m docker starting cmd: docker run -d -p $app_port:$app_source_port -v $app_config_path:$app_target_env_config_path $app_name:$release_tag \033[0m"

docker run -d -p $app_port:$app_source_port -v $app_config_path:$app_target_env_config_path $app_name:$release_tag