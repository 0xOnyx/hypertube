# Hypertube Video Service

Service de gestion des vidéos pour Hypertube construit avec **NestJS** et **TypeORM**.

## 🚀 Fonctionnalités

- **API REST** complète pour la gestion des films
- **Base de données PostgreSQL** avec TypeORM
- **Cache Redis** pour les performances
- **Queue system** avec Bull pour le traitement asynchrone
- **Documentation Swagger** automatique
- **Validation** des données avec class-validator
- **Rate limiting** et throttling
- **Health checks** intégrés
- **Support Docker** avec multi-stage build

## 📋 Prérequis

- Node.js 20+
- PostgreSQL 15+
- Redis 7+
- FFmpeg (pour le traitement vidéo)

## 🛠️ Installation

```bash
# Installer les dépendances
npm install

# Copier le fichier d'environnement
cp .env.example .env

# Configurer les variables d'environnement
nano .env
```

## 🔧 Configuration

### Variables d'environnement

```env
# Base de données
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_USER=hypertube_user
POSTGRES_PASSWORD=hypertube_password
POSTGRES_DB=hypertube

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=

# Application
NODE_ENV=development
PORT=3002
```

## 🏃‍♂️ Démarrage

### Développement
```bash
npm run start:dev
```

### Production
```bash
npm run build
npm run start:prod
```

### Docker
```bash
docker build -t hypertube-video-service .
docker run -p 3002:3002 hypertube-video-service
```

## 📚 API Documentation

Une fois l'application démarrée, la documentation Swagger est disponible sur :
- **Local** : http://localhost:3002/api-docs
- **Docker** : http://localhost:3002/api-docs

## 🏗️ Architecture

### Structure des dossiers

```
src/
├── config/                 # Configuration (DB, Redis)
├── common/
│   ├── entities/           # Entités TypeORM
│   ├── dto/               # Data Transfer Objects
│   ├── decorators/        # Décorateurs personnalisés
│   ├── filters/           # Filtres d'exception
│   ├── guards/            # Guards d'authentification
│   └── pipes/             # Pipes de validation
├── modules/
│   ├── movies/            # Module des films
│   ├── torrents/          # Module des torrents
│   ├── streaming/         # Module de streaming
│   └── health/            # Module de santé
├── app.module.ts          # Module principal
└── main.ts               # Point d'entrée
```

### Entités principales

#### Movie
- Informations complètes sur les films
- Relations avec torrents, commentaires, historique
- Support des métadonnées IMDB

#### Torrent
- Gestion des fichiers torrent
- Suivi du statut de téléchargement
- Qualité et seeders/leechers

#### WatchHistory
- Historique de visionnage par utilisateur
- Position de lecture et progression
- Statut de visionnage

#### Comment
- Système de commentaires
- Notes et modération
- Visibilité contrôlée

## 🔌 Endpoints principaux

### Films
- `GET /api/v1/movies` - Liste paginée des films
- `GET /api/v1/movies/search` - Recherche avancée
- `GET /api/v1/movies/popular` - Films populaires
- `GET /api/v1/movies/:id` - Détails d'un film
- `POST /api/v1/movies` - Créer un film
- `PUT /api/v1/movies/:id` - Mettre à jour un film
- `DELETE /api/v1/movies/:id` - Supprimer un film

### Commentaires
- `GET /api/v1/movies/:id/comments` - Commentaires d'un film
- `POST /api/v1/movies/:id/comments` - Ajouter un commentaire

### Historique
- `GET /api/v1/movies/:id/watch-history/:userId` - Historique utilisateur
- `POST /api/v1/movies/:id/watch-history` - Mettre à jour l'historique

### Streaming
- `GET /api/v1/streaming/movies/:id/stream` - URL de streaming

### Torrents
- `GET /api/v1/torrents/:movieId` - Torrents d'un film
- `POST /api/v1/torrents/:id/download` - Démarrer téléchargement

### Santé
- `GET /api/v1/health` - Status du service

## 🧪 Tests

```bash
# Tests unitaires
npm run test

# Tests e2e
npm run test:e2e

# Coverage
npm run test:cov
```

## 📊 Monitoring

### Health Check
```bash
curl http://localhost:3002/api/v1/health
```

### Métriques
- Logs structurés avec Winston
- Health checks automatiques
- Monitoring des performances

## 🔒 Sécurité

- **Validation** stricte des entrées
- **Rate limiting** par IP
- **CORS** configuré
- **Helmet** pour les headers de sécurité
- **JWT** pour l'authentification

## 🚀 Déploiement

### Docker Compose
```yaml
version: '3.8'
services:
  video-service:
    build: .
    ports:
      - "3002:3002"
    environment:
      - NODE_ENV=production
      - POSTGRES_HOST=postgres
      - REDIS_HOST=redis
    depends_on:
      - postgres
      - redis
```

### Production
1. Build de l'image Docker
2. Configuration des variables d'environnement
3. Déploiement avec orchestrateur (K8s, Docker Swarm)
4. Configuration du load balancer
5. Monitoring et logs centralisés

## 🛠️ Développement

### Scripts disponibles
- `npm run start:dev` - Mode développement avec hot reload
- `npm run start:debug` - Mode debug
- `npm run build` - Build de production
- `npm run lint` - Linting du code
- `npm run format` - Formatage avec Prettier

### Migrations
```bash
# Générer une migration
npm run migration:generate -- -n CreateMovieTable

# Exécuter les migrations
npm run migration:run

# Annuler la dernière migration
npm run migration:revert
```

## 📝 Contribution

1. Fork du projet
2. Créer une branche feature
3. Commits avec messages conventionnels
4. Tests et linting
5. Pull request avec description détaillée

## 📄 Licence

MIT License - voir le fichier LICENSE pour plus de détails.

## 🤝 Support

- **Issues** : GitHub Issues
- **Documentation** : Swagger UI
- **Chat** : Discord/Slack de l'équipe
