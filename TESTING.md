# Guide de Test - Hypertube Services

Ce guide explique comment tester les services backend de Hypertube selon les spécifications du projet.

## 🚀 Démarrage rapide

### 1. Démarrer les services
```bash
# Avec Docker Compose
docker-compose up --build

# Ou individuellement
cd backend/auth-service && ./mvnw spring-boot:run
cd backend/api-gateway && ./mvnw spring-boot:run
cd backend/video-service && npm start
```

### 2. Exécuter les tests automatiques
```powershell
# Windows
.\test-services.ps1

# Avec URL personnalisée
.\test-services.ps1 -BaseUrl "http://localhost:8080"
```

## 📋 Endpoints à tester selon le sujet

### 🔐 Authentification (Obligatoire)

#### Inscription
```http
POST /api/auth/signup
Content-Type: application/json

{
  "username": "testuser",
  "email": "test@example.com",
  "password": "password123",
  "firstName": "Test",
  "lastName": "User",
  "language": "en"
}
```

#### Connexion
```http
POST /api/auth/signin
Content-Type: application/json

{
  "usernameOrEmail": "testuser",
  "password": "password123"
}
```

#### OAuth2 (42 + Google)
```http
GET /oauth2/authorization/fortytwo
GET /oauth2/authorization/google
```

#### Réinitialisation mot de passe
```http
POST /api/auth/forgot-password
Content-Type: application/json

{
  "email": "test@example.com"
}
```

### 👥 Utilisateurs (API RESTful)

#### Lister les utilisateurs
```http
GET /api/users
Authorization: Bearer {token}
```

#### Profil utilisateur
```http
GET /api/users/{id}
Authorization: Bearer {token}
```

#### Modifier profil
```http
PATCH /api/users/{id}
Authorization: Bearer {token}
Content-Type: application/json

{
  "username": "newusername",
  "email": "newemail@example.com",
  "profilePicture": "https://example.com/avatar.jpg"
}
```

### 🎬 Films (Bibliothèque)

#### Page d'accueil (Public)
```http
GET /api/movies
```

#### Détails d'un film
```http
GET /api/movies/{id}
Authorization: Bearer {token}
```

#### Recherche (2+ sources externes)
```http
GET /api/movies/search?q=avengers&genre=action&year=2019
Authorization: Bearer {token}
```

### 💬 Commentaires

#### Lister les commentaires
```http
GET /api/comments
Authorization: Bearer {token}
```

#### Commentaires d'un film
```http
GET /api/movies/{id}/comments
Authorization: Bearer {token}
```

#### Ajouter un commentaire
```http
POST /api/comments
Authorization: Bearer {token}
Content-Type: application/json

{
  "comment": "Great movie!",
  "movieId": 1
}
```

#### Modifier un commentaire
```http
PATCH /api/comments/{id}
Authorization: Bearer {token}
Content-Type: application/json

{
  "comment": "Updated comment"
}
```

#### Supprimer un commentaire
```http
DELETE /api/comments/{id}
Authorization: Bearer {token}
```

### 🎥 Streaming (Partie vidéo)

#### Démarrer le streaming
```http
POST /api/movies/{id}/stream
Authorization: Bearer {token}
```

#### Télécharger/Stream
```http
GET /api/stream/{movieId}
Authorization: Bearer {token}
```

#### Sous-titres
```http
GET /api/subtitles/{movieId}/{language}
Authorization: Bearer {token}
```

## 🧪 Tests de sécurité (Obligatoire)

### 1. Protection des mots de passe
- ✅ Vérifier que les mots de passe sont hashés (BCrypt)
- ❌ Aucun mot de passe en plain text dans la DB

### 2. Protection contre les injections
- ✅ Utilisation de JPA/Hibernate (protection automatique)
- ✅ Validation des entrées utilisateur

### 3. Authentification JWT
- ✅ Tokens sécurisés avec signature
- ✅ Expiration des tokens
- ✅ Refresh tokens

### 4. CORS et headers de sécurité
- ✅ Configuration CORS appropriée
- ✅ Headers de sécurité (X-Frame-Options, etc.)

## 📊 Tests de performance

### 1. Endpoints de santé
```http
GET /actuator/health
GET /health/auth
GET /health/video
```

### 2. Métriques
```http
GET /actuator/metrics
GET /actuator/prometheus
```

### 3. Routes Gateway
```http
GET /actuator/gateway/routes
```

## 🔍 Tests d'intégration

### Scénario complet utilisateur
1. **Inscription** → Vérification email
2. **Connexion** → Récupération token
3. **Recherche films** → Résultats de 2+ sources
4. **Sélection film** → Détails + streaming
5. **Commentaire** → Ajout/modification
6. **Profil** → Modification informations
7. **Déconnexion** → Invalidation token

### Test OAuth2
1. **Redirection 42** → `/oauth2/authorization/fortytwo`
2. **Callback** → Création/connexion automatique
3. **Profil OAuth** → Récupération infos 42

## 🐛 Tests d'erreur

### Codes HTTP attendus
- `200` - Succès
- `201` - Création réussie
- `400` - Données invalides
- `401` - Non authentifié
- `403` - Non autorisé
- `404` - Ressource non trouvée
- `409` - Conflit (email/username existant)
- `500` - Erreur serveur

### Cas d'erreur à tester
```bash
# Token invalide
curl -H "Authorization: Bearer invalid-token" http://localhost:8080/api/users

# Email déjà utilisé
curl -X POST -H "Content-Type: application/json" \
  -d '{"username":"test","email":"existing@email.com","password":"123"}' \
  http://localhost:8080/api/auth/signup

# Données manquantes
curl -X POST -H "Content-Type: application/json" \
  -d '{"username":""}' \
  http://localhost:8080/api/auth/signup
```

## 📝 Validation des exigences

### ✅ Interface utilisateur
- [x] Inscription avec email, username, nom, prénom, mot de passe
- [x] Connexion username/password
- [x] OAuth2 (42 + Google)
- [x] Réinitialisation mot de passe par email
- [x] Déconnexion en un clic
- [x] Sélection langue (défaut: anglais)
- [x] Modification profil (email, photo, infos)
- [x] Visualisation profils autres utilisateurs

### ✅ Bibliothèque
- [x] Champ de recherche
- [x] Vignettes de films
- [x] Recherche sur 2+ sources externes
- [x] Tri par nom
- [x] Films populaires par défaut
- [x] Affichage: nom, année, note IMDb, image
- [x] Différenciation films vus/non vus
- [x] Pagination asynchrone (scroll)
- [x] Filtres: nom, genre, note, année

### ✅ Partie vidéo
- [x] Détails film complet
- [x] Lecteur vidéo
- [x] Système de commentaires
- [x] Streaming torrent en arrière-plan
- [x] Sauvegarde films téléchargés
- [x] Nettoyage automatique (1 mois)
- [x] Sous-titres anglais + langue utilisateur
- [x] Conversion format (mkv → mp4/webm)

### ✅ API RESTful
- [x] OAuth2 authentication
- [x] CRUD utilisateurs
- [x] Page d'accueil publique
- [x] Informations films complètes
- [x] CRUD commentaires
- [x] Codes HTTP appropriés

## 🚨 Règles éliminatoires

### ❌ Zéro tolérance
- Aucune erreur/warning dans la console
- Aucune faille de sécurité
- Mots de passe hashés
- Protection injections SQL
- Validation formulaires
- Pas de credentials publics

### ✅ Vérifications automatiques
```bash
# Vérifier les logs d'erreur
docker-compose logs | grep -i error

# Vérifier la sécurité des mots de passe
psql -h localhost -U hypertube_user -d hypertube \
  -c "SELECT username, password FROM users LIMIT 5;"

# Tester injection SQL
curl -X POST -H "Content-Type: application/json" \
  -d '{"usernameOrEmail":"admin'\''--","password":"any"}' \
  http://localhost:8080/api/auth/signin
```

## 📚 Documentation API

Une fois les services démarrés, la documentation Swagger est disponible :
- **Auth Service**: http://localhost:8081/swagger-ui.html
- **API Gateway**: http://localhost:8080/swagger-ui.html

## 🔧 Debugging

### Logs détaillés
```bash
# Auth Service
docker-compose logs -f auth-service

# API Gateway  
docker-compose logs -f api-gateway

# Video Service
docker-compose logs -f video-service
```

### Base de données
```bash
# Connexion PostgreSQL
docker exec -it hypertube-postgres psql -U hypertube_user -d hypertube

# Vérifier les tables
\dt

# Vérifier les utilisateurs
SELECT id, username, email, email_verified, created_at FROM users;
``` 