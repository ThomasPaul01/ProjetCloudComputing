# Projet Cloud Computing - Application Node.js sur Azure

## Description
Application Node.js déployée sur Azure avec Terraform. Permet de gérer des fichiers sur Azure Blob Storage (upload, download, delete).

## Prérequis
- Terraform
- Azure CLI
- Clé SSH (par défaut: `~/.ssh/id_ed25519.pub`)

## Installation

1. Se connecter à Azure :
```bash
az login
```

2. Créer le fichier `terraform.tfvars` avec la clé de stockage :
```hcl
storage_key = "votre_cle_storage"
```

3. Si besoin, modifier le chemin de la clé SSH dans `variables.tf` :
```hcl
ssh_key_path = "chemin/vers/votre/cle.pub"
```

4. Déployer l'infrastructure :
```bash
terraform init
terraform apply
```

4. Déployer l'application :
```bash
.\deploy.ps1
```

## Utilisation

Accéder à l'application : `http://<VM_IP>:3000`

Fonctionnalités :
- Upload de fichiers dans 3 containers (images, logs, files)
- Liste des fichiers
- Téléchargement
- Suppression

## Nettoyage

```bash
terraform destroy
```
