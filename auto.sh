#! /bin/bash
declare -A map

map["seller"]="seller-admin-panel"
map["admin"]="super-admin-panel"

sudo git init
sudo git add .
sudo git commit -m "Commited Now"

for i in "${!map[@]}"
do
        sudo git remote add $i https://github.com/cloudmagician2-2-2022/seller-admin-panel.git
        sudo git push -u $i main
done
