const errorHandler = (err, req, res, next) => {
  console.error('Erreur Video Service:', err);

  // Erreur de base de données PostgreSQL
  if (err.code) {
    switch (err.code) {
      case '23505': // Violation de contrainte unique
        return res.status(409).json({
          error: 'Données en conflit',
          message: 'Cette ressource existe déjà'
        });
      case '23503': // Violation de contrainte de clé étrangère
        return res.status(400).json({
          error: 'Référence invalide',
          message: 'La ressource référencée n\'existe pas'
        });
      case '23502': // Violation de contrainte NOT NULL
        return res.status(400).json({
          error: 'Données manquantes',
          message: 'Certains champs obligatoires sont manquants'
        });
      default:
        console.error('Erreur de base de données:', err);
        return res.status(500).json({
          error: 'Erreur de base de données'
        });
    }
  }

  // Erreurs de fichiers
  if (err.code === 'ENOENT') {
    return res.status(404).json({
      error: 'Fichier non trouvé',
      message: 'Le fichier demandé n\'existe pas'
    });
  }

  if (err.code === 'EACCES') {
    return res.status(403).json({
      error: 'Accès refusé',
      message: 'Permissions insuffisantes pour accéder au fichier'
    });
  }

  if (err.code === 'ENOSPC') {
    return res.status(507).json({
      error: 'Espace insuffisant',
      message: 'Espace disque insuffisant'
    });
  }

  // Erreurs de streaming
  if (err.message && err.message.includes('Range')) {
    return res.status(416).json({
      error: 'Range non supporté',
      message: 'La plage demandée n\'est pas valide'
    });
  }

  // Erreurs FFmpeg
  if (err.message && err.message.includes('ffmpeg')) {
    return res.status(500).json({
      error: 'Erreur de traitement vidéo',
      message: 'Impossible de traiter le fichier vidéo'
    });
  }

  // Erreurs de torrent
  if (err.message && err.message.includes('torrent')) {
    return res.status(500).json({
      error: 'Erreur de téléchargement',
      message: 'Problème avec le téléchargement du torrent'
    });
  }

  // Erreur par défaut
  res.status(err.status || 500).json({
    error: err.message || 'Erreur interne du serveur',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};

module.exports = errorHandler; 