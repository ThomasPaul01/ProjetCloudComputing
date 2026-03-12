variable "location" {
  description = "Région Azure pour le déploiement"
  type        = string
  default     = "France Central"
}

variable "admin_username" {
  description = "Nom d'utilisateur pour la VM"
  type        = string
  default     = "adminuser"
}

variable "storage_key" {
  description = "Clé d'accès au compte de stockage"
  type        = string
  sensitive   = true
}

variable "ssh_key_path" {
  description = "Chemin vers la clé SSH publique"
  type        = string
  default     = "~/.ssh/id_ed25519.pub"
}
