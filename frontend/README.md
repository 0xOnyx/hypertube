# Frontend - Hypertube

Ce dossier contient toutes les applications frontend de Hypertube.

## 🏗️ Applications

- **hypertube-app/** - Application principale Angular avec Tailwind CSS

## 🚀 Démarrage rapide

### Prérequis
- Node.js 18+
- npm ou yarn
- Angular CLI 18+

### Installation et démarrage

```bash
cd hypertube-app
npm install
ng serve
```

L'application sera accessible sur http://localhost:4200

## 🎨 Technologies

- **Angular 18** - Framework frontend
- **Tailwind CSS** - Framework CSS utilitaire
- **TypeScript** - Langage de programmation
- **RxJS** - Programmation réactive

## 🎭 Design System

L'interface suit le design "Animax" avec :
- **Palette de couleurs** : #181111, #382929, #b89d9f
- **Police principale** : Spline Sans
- **Police secondaire** : Noto Sans
- **Thème sombre** par défaut

## 📱 Pages et fonctionnalités

- **Accueil** - Hero section, films populaires et nouveautés
- **Recherche** - Recherche avancée avec filtres (genre, année, note...)
- **Profil** - Gestion du compte, watchlist, historique
- **Connexion** - Authentification utilisateur

## 🔧 Configuration

### Variables d'environnement

Créer un fichier `src/environments/environment.ts` :

```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8080/api'
};
```

### Proxy de développement

Pour éviter les problèmes CORS en développement, créer `proxy.conf.json` :

```json
{
  "/api/*": {
    "target": "http://localhost:8080",
    "secure": true,
    "changeOrigin": true
  }
}
```

Puis démarrer avec :
```bash
ng serve --proxy-config proxy.conf.json
```

## 🏗️ Build et déploiement

### Build de production
```bash
ng build --configuration production
```

### Docker
```bash
docker build -t hypertube/frontend .
docker run -p 4200:80 hypertube/frontend
```

### Tests
```bash
# Tests unitaires
ng test

# Tests e2e
ng e2e
```

## 📚 Structure

```
hypertube-app/
├── src/
│   ├── app/
│   │   ├── components/          # Composants réutilisables
│   │   │   └── header/
│   │   ├── pages/               # Pages principales
│   │   │   ├── home/
│   │   │   ├── search/
│   │   │   ├── profile/
│   │   │   └── login/
│   │   ├── services/            # Services Angular
│   │   ├── models/              # Interfaces TypeScript
│   │   └── guards/              # Guards de route
│   ├── assets/                  # Images, icônes, etc.
│   └── styles/                  # Styles globaux
├── Dockerfile
├── nginx.conf
└── package.json
```

## 🔗 Intégration API

L'application communique avec le backend via l'API Gateway :

- **Auth** : `/api/auth/login`, `/api/auth/register`
- **Movies** : `/api/movies`, `/api/movies/search`
- **User** : `/api/user/profile`, `/api/user/watchlist`

## 📊 Performance

- **Lazy loading** des modules
- **OnPush** change detection strategy
- **TrackBy** functions pour les listes
- **Image optimization** avec Angular
- **Bundle splitting** automatique

## 🐛 Debugging

```bash
# Mode debug
ng serve --source-map

# Analyse du bundle
ng build --stats-json
npx webpack-bundle-analyzer dist/hypertube-app/stats.json
``` 