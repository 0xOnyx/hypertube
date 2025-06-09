# 🌐 API Gateway Hypertube - Architecture Moderne

## 📋 Vue d'ensemble

L'API Gateway Hypertube est le point d'entrée unique pour toutes les requêtes de l'application de streaming. Elle fournit une architecture moderne basée sur Spring Cloud Gateway avec des fonctionnalités avancées de sécurité, résilience et observabilité.

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │────│  API Gateway    │────│  Auth Service   │
│   (React)       │    │   (Port 8080)   │    │   (Port 8081)   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                                │
                                ├─────────────────┐
                                │  Video Service  │
                                │   (Port 3002)   │
                                └─────────────────┘
```

## ✨ Fonctionnalités Principales

### 🔐 Sécurité
- **Authentification JWT** moderne avec validation stricte
- **CORS** configuré de manière sécurisée
- **Rate Limiting** par endpoint et utilisateur
- **Headers de sécurité** automatiques

### 🔄 Résilience
- **Circuit Breakers** avec fallbacks intelligents
- **Retry** automatique avec backoff exponentiel
- **Timeouts** configurables par service
- **Health Checks** continus

### 📊 Observabilité
- **Logging** structuré avec trace IDs
- **Métriques** Prometheus intégrées
- **Tracing** distribué
- **Monitoring** des performances

### 🚦 Routage Intelligent
- **Load Balancing** automatique
- **Service Discovery** avec Eureka
- **Filtres personnalisés** pour l'enrichissement des requêtes

## 📁 Structure du Projet

```
api-gateway/
├── src/main/java/com/hypertube/gateway/
│   ├── config/
│   │   ├── GatewayConfig.java          # Configuration des routes
│   │   └── GatewayProperties.java      # Propriétés typées
│   ├── controller/
│   │   └── FallbackController.java     # Contrôleurs de fallback
│   ├── filter/
│   │   ├── JwtAuthenticationGatewayFilterFactory.java  # Filtre JWT
│   │   ├── LoggingGatewayFilterFactory.java           # Filtre de logging
│   │   └── RequestHeaderGatewayFilterFactory.java     # Enrichissement des headers
│   ├── service/
│   │   └── JwtService.java             # Service JWT sécurisé
│   └── ApiGatewayApplication.java      # Application principale
└── src/main/resources/
    └── application.yml                 # Configuration multi-profils
```

## 🔧 Configuration

### Variables d'environnement

| Variable | Description | Valeur par défaut |
|----------|-------------|-------------------|
| `SERVER_PORT` | Port du serveur | `8080` |
| `SPRING_PROFILES_ACTIVE` | Profil actif | `local` |
| `JWT_SECRET` | Clé secrète JWT | `hypertubeSecretKeyForDevelopmentOnly` |
| `AUTH_SERVICE_URL` | URL du service auth | `http://auth-service:8081` |
| `VIDEO_SERVICE_URL` | URL du service vidéo | `http://video-service:3002` |
| `REDIS_HOST` | Host Redis | `redis` |
| `LOG_LEVEL` | Niveau de log | `INFO` |

### Profils disponibles

- **`local`** : Développement local
- **`docker`** : Conteneurisation Docker
- **`kubernetes`** : Déploiement Kubernetes
- **`production`** : Environnement de production

## 🚀 Démarrage

### Prérequis
- Java 17+
- Maven 3.8+
- Redis (pour le rate limiting)
- Services backend (auth-service, video-service)

### Démarrage local
```bash
# Avec Maven
mvn spring-boot:run -Dspring-boot.run.profiles=local

# Avec JAR
java -jar target/api-gateway-0.0.1-SNAPSHOT.jar --spring.profiles.active=local
```

### Démarrage avec Docker
```bash
docker build -t hypertube-api-gateway .
docker run -p 8080:8080 -e SPRING_PROFILES_ACTIVE=docker hypertube-api-gateway
```

## 📡 Endpoints

### Routes de l'API

| Endpoint | Service de destination | Protection | Description |
|----------|----------------------|------------|-------------|
| `/api/auth/**` | auth-service | Public (signin, signup) | Authentification |
| `/api/users/**` | auth-service | JWT | Gestion des utilisateurs |
| `/api/movies` | video-service | Public (GET) | Liste des films |
| `/api/movies/**` | video-service | JWT | Opérations sur les films |
| `/api/stream/**` | video-service | JWT | Streaming vidéo |
| `/api/comments/**` | video-service | JWT | Commentaires |
| `/oauth2/**` | auth-service | Public | OAuth2 |

### Endpoints de monitoring

| Endpoint | Description |
|----------|-------------|
| `/actuator/health` | État de santé |
| `/actuator/info` | Informations sur l'application |
| `/actuator/metrics` | Métriques applicatives |
| `/actuator/prometheus` | Métriques Prometheus |
| `/actuator/gateway/routes` | Routes configurées |
| `/fallback/**` | Endpoints de fallback |

## 🔒 Sécurité

### Authentification JWT

Le filtre JWT valide automatiquement les tokens et enrichit les requêtes avec :
- `X-User-Id` : ID de l'utilisateur
- `X-Username` : Nom d'utilisateur
- `X-User-Email` : Email de l'utilisateur
- `X-User-Roles` : Rôles de l'utilisateur

### Rate Limiting

Configuration par défaut :
- **Général** : 100 requêtes/minute (burst: 200)
- **Authentification** : 10 requêtes/minute (burst: 20)

### CORS

Origines autorisées :
- `http://localhost:3000` (développement React)
- `https://*.hypertube.com` (production)

## 📊 Monitoring et Observabilité

### Logs

Format structuré avec :
- **Trace ID** : Identifiant unique de requête
- **Route** : Route utilisée
- **Duration** : Temps de traitement
- **Status** : Code de statut HTTP
- **User Info** : Informations utilisateur (si authentifié)

Exemple :
```
2024-01-15 10:30:15.123 [http-nio-8080-exec-1] INFO  [abc12345,def67890] c.h.g.f.LoggingGatewayFilterFactory - 🌐 [abc12345] [MOVIES-SEARCH] GET /api/movies/search - User-Agent: Mozilla/5.0 - IP: 192.168.1.100
```

### Métriques

Métriques exposées pour Prometheus :
- Nombre de requêtes par route
- Temps de réponse par percentile
- Taux d'erreur par service
- État des circuit breakers
- Utilisation du rate limiting

### Circuit Breakers

Configuration par défaut :
- **Seuil d'échec** : 50%
- **Fenêtre glissante** : 100 requêtes
- **Temps d'ouverture** : 50 secondes
- **Appels en demi-ouverture** : 30

## 🚨 Fallbacks et Résilience

### Stratégies de fallback

1. **Service d'authentification** : Utilisation du token existant
2. **Service vidéo** : Réponse avec liste vide et message informatif
3. **Streaming** : Message d'attente avec suggestion
4. **Commentaires** : Liste vide avec indication de rechargement

### Retry automatique

- **Tentatives** : 3 maximum
- **Backoff** : Exponentiel (50ms → 500ms)
- **Conditions** : `BAD_GATEWAY`, `SERVICE_UNAVAILABLE`

## 🔧 Développement

### Tests

```bash
# Tests unitaires
mvn test

# Tests d'intégration
mvn integration-test

# Tests avec TestContainers
mvn verify -Pintegration-tests
```

### Ajout d'une nouvelle route

1. Modifier `GatewayConfig.java`
2. Ajouter la configuration dans `application.yml`
3. Créer un fallback dans `FallbackController.java`
4. Ajouter les tests appropriés

### Configuration d'un nouveau service

```yaml
hypertube:
  gateway:
    services:
      nouveau-service:
        name: nouveau-service
        url: http://nouveau-service:8083
        health-path: /actuator/health
        timeout: 10s
        retry-attempts: 3
```

## 📋 Checklist de production

- [ ] Secrets JWT sécurisés (minimum 32 caractères)
- [ ] Configuration CORS restrictive
- [ ] Rate limiting adapté à la charge
- [ ] Monitoring et alertes configurés
- [ ] Logs centralisés
- [ ] Certificats SSL/TLS valides
- [ ] Health checks configurés
- [ ] Sauvegarde de configuration

## 🐛 Dépannage

### Problèmes courants

1. **JWT invalide** : Vérifier la clé secrète et l'émetteur
2. **CORS bloqué** : Vérifier la configuration des origines
3. **Rate limiting** : Augmenter les limites ou vérifier Redis
4. **Circuit breaker ouvert** : Vérifier la santé des services

### Debug

```bash
# Logs détaillés
export LOG_LEVEL=DEBUG

# Vérification des routes
curl http://localhost:8080/actuator/gateway/routes

# Test de santé
curl http://localhost:8080/actuator/health
```

## 🤝 Contribution

1. Fork le projet
2. Créer une branche feature (`git checkout -b feature/AmazingFeature`)
3. Commit les changements (`git commit -m 'Add: Amazing Feature'`)
4. Push la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails. 