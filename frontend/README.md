# Frontend Hypertube - Angular 20

Application frontend moderne pour Hypertube, construite avec Angular 20 et les dernières bonnes pratiques.

## 🚀 Fonctionnalités

- **Architecture moderne** : Standalone components, Signals, Control Flow
- **Authentification** : JWT avec interceptors automatiques
- **Interface utilisateur** : Angular Material avec design responsive
- **Routing** : Lazy loading et guards d'authentification
- **Services** : Injection de dépendances moderne avec `inject()`
- **Formulaires** : Reactive Forms avec validation
- **HTTP** : Client HTTP avec interceptors

## 📋 Prérequis

- Node.js 20+ (recommandé)
- npm 8+
- Angular CLI 20+

## 🛠️ Installation

### Développement local

```bash
# Installer les dépendances
npm install

# Démarrer le serveur de développement
npm start

# L'application sera disponible sur http://localhost:4200
```

### Avec Docker

```bash
# Construire l'image Docker
docker build -t hypertube-frontend .

# Lancer le conteneur
docker run -p 4200:80 hypertube-frontend
```

### Avec Docker Compose (recommandé)

```bash
# Depuis la racine du projet
docker compose up -d frontend
```

## 🏗️ Architecture

```
src/
├── app/
│   ├── core/                 # Services, guards, interceptors
│   │   ├── guards/          # Guards d'authentification
│   │   ├── interceptors/    # Interceptors HTTP
│   │   ├── models/          # Interfaces TypeScript
│   │   └── services/        # Services métier
│   ├── features/            # Modules fonctionnels
│   │   ├── auth/           # Authentification
│   │   ├── dashboard/      # Tableau de bord
│   │   └── movies/         # Gestion des films
│   ├── shared/             # Composants partagés
│   ├── app.config.ts       # Configuration Angular
│   ├── app.routes.ts       # Routes principales
│   └── app.ts             # Composant racine
└── main.ts                 # Point d'entrée
```

## 🔧 Configuration

### Variables d'environnement

L'application utilise les URLs suivantes par défaut :

- **API Backend** : `http://localhost:8080/api`
- **Frontend** : `http://localhost:4200`

### Modification des URLs

Pour changer l'URL de l'API, modifiez les services dans `src/app/core/services/`.

## 📱 Fonctionnalités principales

### Authentification
- Connexion avec username/password
- Inscription avec validation
- Gestion automatique du token JWT
- Déconnexion sécurisée

### Films
- Liste des films populaires
- Recherche en temps réel
- Détails des films avec player vidéo
- Système de commentaires
- Pagination

### Interface utilisateur
- Design responsive (mobile-first)
- Thème Material Design
- Animations fluides
- Feedback utilisateur (snackbars, spinners)

## 🧪 Tests

```bash
# Tests unitaires
npm test

# Tests e2e
npm run e2e

# Coverage
npm run test:coverage
```

## 📦 Build

```bash
# Build de production
npm run build

# Build avec analyse des bundles
npm run build:analyze
```

## 🔒 Sécurité

- **CSP** : Content Security Policy configurée
- **HTTPS** : Support HTTPS en production
- **JWT** : Tokens sécurisés avec expiration
- **Validation** : Validation côté client et serveur

## 🌐 Déploiement

### Production avec Nginx

L'application est configurée pour être servie par Nginx avec :
- Gestion du routing Angular
- Compression Gzip
- Cache des assets statiques
- Headers de sécurité

### Variables d'environnement de production

```bash
# URL de l'API en production
API_URL=https://api.hypertube.com

# Autres configurations...
```

## 🤝 Contribution

1. Fork le projet
2. Créer une branche feature (`git checkout -b feature/AmazingFeature`)
3. Commit les changements (`git commit -m 'Add some AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

## 📄 Scripts disponibles

- `npm start` : Serveur de développement
- `npm run build` : Build de production
- `npm test` : Tests unitaires
- `npm run lint` : Linting du code
- `npm run e2e` : Tests end-to-end

## 🐛 Dépannage

### Problèmes courants

1. **Erreur de CORS** : Vérifiez que le backend autorise les requêtes depuis `http://localhost:4200`
2. **Token expiré** : L'application gère automatiquement la déconnexion
3. **Build failed** : Vérifiez la version de Node.js (20+ recommandé)

### Logs

```bash
# Logs du conteneur Docker
docker logs hypertube-frontend

# Logs de développement
# Ouvrir les DevTools du navigateur (F12)
```

## 📚 Technologies utilisées

- **Angular 20** : Framework principal
- **Angular Material** : Composants UI
- **RxJS** : Programmation réactive
- **TypeScript** : Langage de programmation
- **SCSS** : Préprocesseur CSS
- **Nginx** : Serveur web (production)

## 📞 Support

Pour toute question ou problème :
1. Vérifiez la documentation
2. Consultez les issues GitHub
3. Créez une nouvelle issue si nécessaire
