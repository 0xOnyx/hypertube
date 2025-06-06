# 🎬 Hypertube - Streaming Platform

Hypertube est une plateforme de streaming de films construite avec Angular et Spring Boot, permettant aux utilisateurs de regarder des films via des torrents avec un système de streaming intelligent.

## 🏗️ Architecture

### Backend (Microservices Spring Boot)
- **API Gateway** - Spring Cloud Gateway (Port 8080)
- **Auth Service** - Service d'authentification Spring Boot (Port 8081)
- **Video Service** - Service de gestion vidéo Node.js avec WebTorrent (Port 3002)

### Frontend
- **Angular 18** - Interface utilisateur moderne avec Tailwind CSS (Port 4200)

### Base de données
- **PostgreSQL** - Base de données principale (Port 5432)
- **Redis** - Cache et sessions (Port 6379)

## 🚀 Technologies utilisées

### Backend
- **Spring Boot 3.x** - Framework Java
- **Spring Cloud Gateway** - API Gateway et routage
- **Spring Data JPA** - ORM pour PostgreSQL
- **Spring Security** - Authentification et autorisation
- **JWT** - Gestion des tokens
- **Node.js** - Service vidéo spécialisé
- **WebTorrent** - Streaming de torrents
- **FFmpeg** - Traitement vidéo

### Frontend
- **Angular 18** - Framework frontend
- **Tailwind CSS** - Framework CSS utilitaire
- **TypeScript** - Langage de programmation
- **RxJS** - Programmation réactive

### Infrastructure
- **Docker** - Conteneurisation
- **Kubernetes** - Orchestration (nouveau!)
- **PostgreSQL** - Base de données relationnelle
- **Redis** - Cache en mémoire
- **Nginx** - Serveur web (frontend en production)

## 🧹 Structure nettoyée

**✅ NOUVEAU :** Le projet a été réorganisé pour une meilleure séparation des responsabilités :
- `backend/` - Tous les services backend (Spring Boot + Node.js)
- `frontend/` - Applications frontend (Angular)
- `kubernetes/` - Configuration Kubernetes complète

## 📁 Structure du projet

```
hypertube/
├── 📁 backend/                     # Services backend
│   ├── 📁 api-gateway/             # Spring Cloud Gateway
│   │   ├── src/main/java/
│   │   ├── Dockerfile
│   │   └── pom.xml
│   ├── 📁 auth-service/            # Service d'authentification Spring Boot
│   │   ├── src/main/java/
│   │   ├── Dockerfile
│   │   └── pom.xml
│   ├── 📁 video-service/           # Service vidéo Node.js
│   │   ├── src/
│   │   ├── Dockerfile
│   │   └── package.json
│   └── 📁 database/                # Scripts de base de données
│       └── init.sql
├── 📁 frontend/                    # Applications frontend
│   └── 📁 hypertube-app/           # Application Angular
│       ├── src/
│       ├── Dockerfile
│       ├── nginx.conf
│       └── package.json
├── 📁 kubernetes/                  # Configurations Kubernetes
│   ├── namespace.yaml
│   ├── configmap.yaml
│   ├── postgres.yaml
│   ├── redis.yaml
│   ├── auth-service.yaml
│   ├── video-service.yaml
│   ├── api-gateway.yaml
│   └── frontend.yaml
├── docker-compose.yml              # Configuration Docker Compose
└── README.md
```

## 🛠️ Installation et démarrage

### Option 1 : Docker Compose (Développement)

1. **Cloner le repository**
```bash
git clone <repository-url>
cd hypertube
```

2. **Construire et démarrer tous les services**
```bash
docker-compose up --build
```

3. **Accéder à l'application**
- Frontend : http://localhost:4200
- API Gateway : http://localhost:8080
- Service Auth : http://localhost:8081
- Service Vidéo : http://localhost:3002

### Option 2 : Kubernetes (Production)

1. **Prérequis**
- Cluster Kubernetes fonctionnel
- kubectl installé et configuré

2. **Déploiement rapide**
```bash
cd kubernetes
# Windows
.\deploy.ps1

# Linux/macOS
chmod +x deploy.sh
./deploy.sh
```

3. **Accès via port-forward**
```bash
kubectl port-forward svc/api-gateway 8080:8080 -n hypertube
kubectl port-forward svc/frontend 4200:80 -n hypertube
```

### Option 3 : Développement local

#### Backend
```bash
# Service d'authentification
cd backend/auth-service
./mvnw spring-boot:run

# API Gateway
cd backend/api-gateway
./mvnw spring-boot:run

# Service vidéo
cd backend/video-service
npm install
npm start
```

#### Frontend
```bash
cd frontend/hypertube-app
npm install
ng serve
```

## 🔧 Configuration

### Variables d'environnement

#### Services Spring Boot
```properties
# Base de données
SPRING_DATASOURCE_URL=jdbc:postgresql://localhost:5432/hypertube
SPRING_DATASOURCE_USERNAME=hypertube_user
SPRING_DATASOURCE_PASSWORD=hypertube_password

# Redis
SPRING_REDIS_HOST=localhost
SPRING_REDIS_PORT=6379

# JWT
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRATION=86400000

# URLs des services
AUTH_SERVICE_URL=http://localhost:8081
VIDEO_SERVICE_URL=http://localhost:3002
```

#### Service Vidéo (Node.js)
```env
NODE_ENV=development
POSTGRES_URL=postgresql://hypertube_user:hypertube_password@localhost:5432/hypertube
REDIS_URL=redis://localhost:6379
STORAGE_PATH=./storage
```

## 🔑 Authentification

### Comptes de test
```
Email : demo@animax.com
Mot de passe : password
```

### API Endpoints

#### Authentification
- `POST /api/auth/login` - Connexion
- `POST /api/auth/register` - Inscription
- `POST /api/auth/refresh` - Rafraîchir le token

#### Films
- `GET /api/movies` - Liste des films
- `GET /api/movies/search` - Recherche de films
- `GET /api/movies/{id}` - Détails d'un film
- `POST /api/movies/{id}/stream` - Démarrer le streaming

#### Profil utilisateur
- `GET /api/user/profile` - Profil utilisateur
- `PUT /api/user/profile` - Mettre à jour le profil
- `GET /api/user/watchlist` - Liste de favoris
- `POST /api/user/watchlist/{movieId}` - Ajouter aux favoris

## 🎨 Interface utilisateur

L'interface suit le design "Animax" avec :
- **Thème sombre** (#181111, #382929, #b89d9f)
- **Navigation fluide** entre les pages
- **Recherche avancée** avec filtres
- **Profil utilisateur** complet
- **Historique de visionnage**
- **Liste de favoris**

### Pages principales
- **Accueil** - Films populaires et nouveautés
- **Recherche** - Recherche avec filtres avancés
- **Profil** - Gestion du compte utilisateur
- **Connexion** - Authentification

## 🐳 Docker

### Images Docker
- `hypertube/api-gateway:latest`
- `hypertube/auth-service:latest`
- `hypertube/video-service:latest`
- `hypertube/frontend:latest`

### Construire les images
```bash
# API Gateway
cd backend/api-gateway && docker build -t hypertube/api-gateway .

# Auth Service
cd backend/auth-service && docker build -t hypertube/auth-service .

# Video Service
cd backend/video-service && docker build -t hypertube/video-service .

# Frontend
cd frontend/hypertube-app && docker build -t hypertube/frontend .
```

## ☸️ Kubernetes

Voir le [README Kubernetes](kubernetes/README.md) pour :
- Configuration détaillée
- Scaling des services
- Monitoring et logs
- Dépannage
- Production deployment

## 🔍 Monitoring et Logs

### Docker Compose
```bash
# Voir les logs d'un service
docker-compose logs -f auth-service

# État des conteneurs
docker-compose ps
```

### Kubernetes
```bash
# Pods status
kubectl get pods -n hypertube

# Logs d'un service
kubectl logs -f deployment/auth-service -n hypertube

# Describe pod
kubectl describe pod <pod-name> -n hypertube
```

## 📊 Base de données

### Structure principale
- **users** - Utilisateurs et profils
- **movies** - Catalogue de films
- **watch_history** - Historique de visionnage
- **subtitles** - Sous-titres
- **comments** - Commentaires utilisateurs

### Migration
Les migrations sont automatiquement appliquées au démarrage via Spring Boot JPA.

## 🔒 Sécurité

- **JWT Authentication** avec refresh tokens
- **CORS** configuré pour le frontend
- **Password hashing** avec BCrypt
- **Rate limiting** sur l'API Gateway
- **Input validation** sur tous les endpoints

## 🚀 Fonctionnalités

### Terminées ✅
- Interface utilisateur complète (Angular + Tailwind)
- Architecture microservices Spring Boot
- Authentification JWT
- Base de données PostgreSQL
- Cache Redis
- Configuration Docker Compose
- Configuration Kubernetes complète
- Documentation complète

### En développement 🚧
- Streaming vidéo WebTorrent
- Sous-titres automatiques
- Système de recommandations
- Monitoring avancé

## 📚 Documentation

- [Guide Kubernetes](kubernetes/README.md)
- [API Documentation](docs/api.md) *(à venir)*
- [Frontend Guide](hypertube-frontend/README.md)

## 🤝 Contribution

1. Fork le projet
2. Créer une branche (`git checkout -b feature/amazing-feature`)
3. Commit les changements (`git commit -m 'Add amazing feature'`)
4. Push la branche (`git push origin feature/amazing-feature`)
5. Ouvrir une Pull Request

## 📄 License

Ce projet est sous licence MIT. Voir le fichier [LICENSE](LICENSE) pour plus de détails.

## 👨‍💻 Auteur

**Votre Nom** - [GitHub](https://github.com/votre-username)

---

**Note** : Ce projet est à des fins éducatives. Assurez-vous de respecter les lois sur le droit d'auteur dans votre juridiction.
