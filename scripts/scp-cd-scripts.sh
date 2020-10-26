pwd=$PWD

scp -r $pwd/cd/* ssh hydev@192.168.14.181:/var/custom-platform-fe/
scp -r $pwd/cd/* ssh hydev@192.168.14.166:/var/custom-platform-fe/