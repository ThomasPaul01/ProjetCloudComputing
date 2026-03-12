$VM_IP = terraform output -raw vm_ip
$STORAGE = terraform output -raw storage_account_name
$KEY = terraform output -raw storage_account_key

Write-Host "Deploiement vers $VM_IP..."
scp app.js package.json index.html node-app.service adminuser@${VM_IP}:~/node-app/

Write-Host "Configuration de l'application..."
ssh adminuser@$VM_IP "cd ~/node-app && echo AZURE_STORAGE_ACCOUNT=$STORAGE > .env"
ssh adminuser@$VM_IP "cd ~/node-app && echo AZURE_STORAGE_KEY=$KEY >> .env"
ssh adminuser@$VM_IP "cd ~/node-app && npm install"

Write-Host "Demarrage du service..."
ssh adminuser@$VM_IP "sudo cp ~/node-app/node-app.service /etc/systemd/system/"
ssh adminuser@$VM_IP "sudo systemctl daemon-reload"
ssh adminuser@$VM_IP "sudo systemctl enable node-app"
ssh adminuser@$VM_IP "sudo systemctl restart node-app"

Write-Host "Termine ! App disponible sur http://${VM_IP}:3000"
