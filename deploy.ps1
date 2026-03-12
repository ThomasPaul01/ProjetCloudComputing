$VM_IP = terraform output -raw vm_ip
$STORAGE = terraform output -raw storage_account_name
$KEY = terraform output -raw storage_account_key

Write-Host "Deploiement vers $VM_IP..."
scp -o StrictHostKeyChecking=no app.js package.json index.html node-app.service adminuser@${VM_IP}:~/node-app/

Write-Host "Configuration et demarrage..."
ssh -o StrictHostKeyChecking=no adminuser@$VM_IP "cd ~/node-app && echo AZURE_STORAGE_ACCOUNT=$STORAGE > .env && echo AZURE_STORAGE_KEY=$KEY >> .env && npm install && sudo cp node-app.service /etc/systemd/system/ && sudo systemctl daemon-reload && sudo systemctl enable node-app && sudo systemctl restart node-app"

Write-Host "Termine ! App disponible sur http://${VM_IP}:3000"
