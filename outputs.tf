output "vm_ip" {
  description = "Adresse IP publique de la VM"
  value       = azurerm_public_ip.publicip.ip_address
}

output "ssh_command" {
  description = "Commande pour se connecter en SSH"
  value       = "ssh ${var.admin_username}@${azurerm_public_ip.publicip.ip_address}"
}

output "storage_account_name" {
  description = "Nom du compte de stockage"
  value       = azurerm_storage_account.storage.name
}

output "storage_account_key" {
  description = "Clé d'accès au compte de stockage"
  value       = azurerm_storage_account.storage.primary_access_key
  sensitive   = true
}
