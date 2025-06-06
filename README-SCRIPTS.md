# Scripts de Démarrage Hypertube

Ce dossier contient des scripts pour démarrer et arrêter facilement tous les services Hypertube.

## 📁 Scripts disponibles

### Windows (PowerShell)
- `start-all.ps1` - Démarre tous les services
- `stop-all.ps1` - Arrête tous les services  
- `test-connection.ps1` - Teste la connectivité des services

### Linux/WSL (Bash)
- `start-all.sh` - Démarre tous les services
- `stop-all.sh` - Arrête tous les services
- `test-connection.sh` - Teste la connectivité des services

## 🚀 Utilisation

### Sur Windows
```powershell
# Démarrer tous les services
.\start-all.ps1

# Tester la connectivité
.\test-connection.ps1

# Arrêter tous les services
.\stop-all.ps1
```

### Sur Linux/WSL
```bash
# Rendre les scripts exécutables (première fois seulement)
chmod +x *.sh

# Démarrer tous les services
./start-all.sh

# Tester la connectivité
./test-connection.sh

# Arrêter tous les services
./stop-all.sh
```

## 🔧 Prérequis

### Communs
- Docker et Docker Compose
- Maven (pour les services Spring Boot)
- Node.js et Angular CLI (pour le frontend)

### Linux/WSL supplémentaires
- `curl` - pour les tests de connectivité
- `nc` (netcat) - pour tester les ports
- `lsof` - pour gérer les processus par port
- `psql` (optionnel) - pour tester PostgreSQL directement

Installation des outils manquants sur Ubuntu/Debian :
```bash
sudo apt update
sudo apt install curl netcat-openbsd lsof postgresql-client
```

## 📊 Services démarrés

| Service | Port | URL | Logs |
|---------|------|-----|------|
| Frontend Angular | 4200 | http://localhost:4200 | `logs/frontend.log` |
| API Gateway | 8080 | http://localhost:8080 | `logs/api-gateway.log` |
| Auth Service | 8081 | http://localhost:8081 | `logs/auth-service.log` |
| Video Service | 8082 | http://localhost:8082 | `logs/video-service.log` |
| PostgreSQL | 5432 | - | Docker logs |
| Redis | 6379 | - | Docker logs |

## 🗂️ Gestion des logs

### Linux/WSL
Les services créent des logs dans le dossier `logs/` :

```bash
# Voir les logs en temps réel
tail -f logs/auth-service.log
tail -f logs/api-gateway.log
tail -f logs/video-service.log
tail -f logs/frontend.log

# Voir tous les logs
tail -f logs/*.log
```

### Windows
Les services s'exécutent dans des fenêtres PowerShell séparées.

## 🔍 Dépannage

### Vérifier les processus en cours
```bash
# Linux/WSL
pgrep -f spring-boot    # Services Java
pgrep -f "ng serve"     # Angular
docker ps               # Conteneurs Docker

# Ports utilisés
netstat -tlnp | grep -E ':(4200|8080|8081|8082|5432|6379)'
```

```powershell
# Windows
Get-Process -Name "java" | Where-Object CommandLine -like "*spring-boot*"
Get-Process -Name "node" | Where-Object CommandLine -like "*ng serve*"
docker ps
netstat -an | findstr ":4200 :8080 :8081 :8082 :5432 :6379"
```

### Problèmes courants

**Port déjà utilisé :**
```bash
# Linux/WSL - Tuer le processus sur le port 8080
lsof -ti :8080 | xargs kill -9

# Windows
# Utiliser le script stop-all.ps1 ou redémarrer
```

**Services ne démarrent pas :**
1. Vérifier que Docker est démarré
2. Vérifier que les ports ne sont pas utilisés
3. Regarder les logs pour les erreurs
4. S'assurer que Maven peut télécharger les dépendances

**Base de données non accessible :**
```bash
# Vérifier les conteneurs Docker
docker ps
docker logs hypertube-postgres

# Redémarrer les conteneurs
docker-compose restart postgres redis
```

## ⚙️ Configuration

### Variables d'environnement supportées
- `SPRING_PROFILES_ACTIVE` - Profil Spring (défaut: dev)
- `POSTGRES_PASSWORD` - Mot de passe PostgreSQL
- `JWT_SECRET` - Clé secrète JWT

### Profils disponibles
- `dev` - Développement avec H2 en mémoire
- `docker` - Production avec PostgreSQL
- `kubernetes` - Déploiement Kubernetes

## 🎯 Scripts personnalisés

Vous pouvez créer vos propres scripts basés sur ces exemples :

```bash
# Démarrer seulement le backend
./start-all.sh --backend-only

# Démarrer avec un profil spécifique
SPRING_PROFILES_ACTIVE=production ./start-all.sh

# Démarrer en mode debug
DEBUG=true ./start-all.sh
```

## 📋 Checklist de démarrage

- [ ] Docker est démarré
- [ ] Ports 4200, 8080, 8081, 8082, 5432, 6379 sont libres
- [ ] Maven est installé et configuré
- [ ] Node.js et Angular CLI sont installés
- [ ] Scripts sont exécutables (`chmod +x *.sh` sur Linux)
- [ ] Variables d'environnement configurées si nécessaire

## 🆘 Support

En cas de problème :
1. Exécuter `./test-connection.sh` ou `.\test-connection.ps1`
2. Vérifier les logs dans `logs/`
3. Vérifier que tous les prérequis sont installés
4. Redémarrer avec `./stop-all.sh && ./start-all.sh` 