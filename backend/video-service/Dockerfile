FROM node:18-alpine

# Installer FFmpeg et autres dépendances système
RUN apk add --no-cache \
    ffmpeg \
    python3 \
    make \
    g++ \
    git

WORKDIR /app

# Copier les fichiers de dépendances
COPY package*.json ./

# Installer les dépendances
RUN npm install --only=production

# Copier le code source
COPY src ./src

# Créer les répertoires nécessaires
RUN mkdir -p /app/storage/videos /app/storage/subtitles /app/torrents

# Créer un utilisateur non-root
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001

# Changer le propriétaire des fichiers
RUN chown -R nextjs:nodejs /app
USER nextjs

# Exposer le port
EXPOSE 3002

# Commande de démarrage
CMD ["npm", "start"] 