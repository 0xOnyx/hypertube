# Backend - Hypertube

Ce dossier contient tous les services backend de l'application Hypertube.

## 🏗️ Architecture des microservices

- **api-gateway/** - Spring Cloud Gateway (Port 8080)
- **auth-service/** - Service d'authentification Spring Boot (Port 8081)
- **video-service/** - Service de gestion vidéo Node.js (Port 3002)
- **database/** - Scripts SQL d'initialisation

## 🚀 Démarrage rapide

### Prérequis
- Java 17+ pour les services Spring Boot
- Node.js 18+ pour le service vidéo
- Maven 3.8+
- PostgreSQL et Redis (via Docker ou installés localement)

### Démarrage des services

1. **Base de données (avec Docker)**
```bash
# Depuis la racine du projet
docker-compose up postgres redis -d
```

2. **Service d'authentification**
```bash
cd auth-service
./mvnw spring-boot:run
```

3. **Service vidéo**
```bash
cd video-service
npm install
npm start
```

4. **API Gateway**
```bash
cd api-gateway
./mvnw spring-boot:run
```

## 🔧 Configuration

### Variables d'environnement communes
```bash
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
```

## 📊 Monitoring

### Health checks
- Auth Service: http://localhost:8081/actuator/health
- API Gateway: http://localhost:8080/actuator/health
- Video Service: http://localhost:3002/health

### Logs
```bash
# Spring Boot services
./mvnw spring-boot:run --debug

# Video service
npm run dev
```

## 🐳 Docker

Chaque service a son propre Dockerfile. Pour construire tous les services :

```bash
docker-compose build
```

## 📚 Documentation

- [Auth Service](auth-service/README.md)
- [API Gateway](api-gateway/README.md)
- [Video Service](video-service/README.md) 