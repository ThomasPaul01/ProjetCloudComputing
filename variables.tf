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
