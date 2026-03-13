$VM_IP = terraform output -raw vm_ip
$STORAGE = terraform output -raw storage_account_name
$KEY = terraform output -raw storage_account_key

Write-Host "Deploiement vers $VM_IP..." -ForegroundColor Cyan
scp -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null -o LogLevel=ERROR app.js package.json index.html node-app.service adminuser@${VM_IP}:~/node-app/

Write-Host "Configuration et demarrage..." -ForegroundColor Cyan
$remoteCommand = @(
  "cd ~/node-app"
  "echo AZURE_STORAGE_ACCOUNT=$STORAGE > .env"
  "echo AZURE_STORAGE_KEY=$KEY >> .env"
  "npm install --no-fund --no-audit --loglevel=error"
  "sudo cp node-app.service /etc/systemd/system/"
  "sudo systemctl daemon-reload"
  "sudo systemctl enable node-app"
  "sudo systemctl restart node-app"
) -join " && "

ssh -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null -o LogLevel=ERROR adminuser@$VM_IP $remoteCommand

Write-Host "`nTermine ! App disponible sur http://${VM_IP}:3000" -ForegroundColor Green
