const WebTorrent = require('webtorrent');
const path = require('path');
const fs = require('fs-extra');
const { pool } = require('../config/database');
const { convertToMp4 } = require('./ffmpegService');

const client = new WebTorrent();
const activeDownloads = new Map();

const STORAGE_PATH = process.env.STORAGE_PATH || '/app/storage/videos';

// Assurer que le répertoire de stockage existe
fs.ensureDirSync(STORAGE_PATH);

const startTorrentDownload = (movieId, magnetLink) => {
  try {
    console.log(`🔄 Démarrage du téléchargement pour le film ${movieId}`);

    // Si un téléchargement est déjà en cours pour ce film
    if (activeDownloads.has(movieId)) {
      console.log(`⚠️ Téléchargement déjà en cours pour le film ${movieId}`);
      return;
    }

    const torrent = client.add(magnetLink, {
      path: STORAGE_PATH
    });

    activeDownloads.set(movieId, {
      torrent,
      progress: 0,
      downloadSpeed: 0,
      status: 'downloading'
    });

    torrent.on('ready', () => {
      console.log(`✅ Torrent prêt pour le film ${movieId}`);
      console.log(`📁 Nom: ${torrent.name}`);
      console.log(`📊 Taille: ${(torrent.length / 1024 / 1024).toFixed(2)} MB`);
      console.log(`📋 Fichiers: ${torrent.files.length}`);

      // Trouver le fichier vidéo principal (le plus gros fichier vidéo)
      const videoFile = torrent.files
        .filter(file => {
          const ext = path.extname(file.name).toLowerCase();
          return ['.mp4', '.mkv', '.avi', '.mov', '.wmv', '.flv'].includes(ext);
        })
        .reduce((largest, file) => {
          return file.length > (largest?.length || 0) ? file : largest;
        }, null);

      if (!videoFile) {
        console.error(`❌ Aucun fichier vidéo trouvé dans le torrent pour le film ${movieId}`);
        updateMovieStatus(movieId, 'error');
        return;
      }

      console.log(`🎬 Fichier vidéo sélectionné: ${videoFile.name}`);
    });

    torrent.on('download', (bytes) => {
      const download = activeDownloads.get(movieId);
      if (download) {
        download.progress = Math.round((torrent.progress * 100) * 100) / 100;
        download.downloadSpeed = torrent.downloadSpeed;
        
        // Log toutes les 10%
        if (download.progress % 10 < 0.1) {
          console.log(`📥 Film ${movieId}: ${download.progress}% (${(torrent.downloadSpeed / 1024 / 1024).toFixed(2)} MB/s)`);
        }
      }
    });

    torrent.on('done', async () => {
      console.log(`✅ Téléchargement terminé pour le film ${movieId}`);
      
      try {
        // Trouver le fichier vidéo principal
        const videoFile = torrent.files
          .filter(file => {
            const ext = path.extname(file.name).toLowerCase();
            return ['.mp4', '.mkv', '.avi', '.mov', '.wmv', '.flv'].includes(ext);
          })
          .reduce((largest, file) => {
            return file.length > (largest?.length || 0) ? file : largest;
          }, null);

        if (!videoFile) {
          throw new Error('Aucun fichier vidéo trouvé');
        }

        const sourcePath = path.join(STORAGE_PATH, videoFile.path);
        const outputPath = path.join(STORAGE_PATH, `movie_${movieId}.mp4`);

        // Convertir en MP4 si nécessaire
        if (path.extname(videoFile.name).toLowerCase() !== '.mp4') {
          console.log(`🔄 Conversion en MP4 pour le film ${movieId}...`);
          await convertToMp4(sourcePath, outputPath);
        } else {
          // Simplement copier le fichier s'il est déjà en MP4
          await fs.copy(sourcePath, outputPath);
        }

        // Mettre à jour la base de données
        await pool.query(
          'UPDATE movies SET status = $1, video_path = $2 WHERE id = $3',
          ['ready', outputPath, movieId]
        );

        console.log(`🎉 Film ${movieId} prêt pour le streaming!`);

        // Nettoyer le téléchargement actif
        activeDownloads.delete(movieId);
        
        // Détruire le torrent pour libérer l'espace (optionnel)
        // client.remove(torrent);

      } catch (error) {
        console.error(`❌ Erreur lors du traitement du film ${movieId}:`, error);
        await updateMovieStatus(movieId, 'error');
      }
    });

    torrent.on('error', async (error) => {
      console.error(`❌ Erreur de torrent pour le film ${movieId}:`, error);
      await updateMovieStatus(movieId, 'error');
      activeDownloads.delete(movieId);
    });

  } catch (error) {
    console.error(`❌ Erreur lors du démarrage du téléchargement pour le film ${movieId}:`, error);
    updateMovieStatus(movieId, 'error');
  }
};

const updateMovieStatus = async (movieId, status) => {
  try {
    await pool.query(
      'UPDATE movies SET status = $1 WHERE id = $2',
      [status, movieId]
    );
  } catch (error) {
    console.error('Erreur lors de la mise à jour du statut:', error);
  }
};

const getDownloadProgress = (movieId) => {
  const download = activeDownloads.get(movieId);
  if (!download) {
    return null;
  }

  return {
    progress: download.progress,
    downloadSpeed: download.downloadSpeed,
    status: download.status
  };
};

const stopDownload = (movieId) => {
  const download = activeDownloads.get(movieId);
  if (download) {
    client.remove(download.torrent);
    activeDownloads.delete(movieId);
    console.log(`🛑 Téléchargement arrêté pour le film ${movieId}`);
    return true;
  }
  return false;
};

// Nettoyage lors de l'arrêt du processus
process.on('SIGINT', () => {
  console.log('🧹 Nettoyage des téléchargements en cours...');
  client.destroy(() => {
    process.exit(0);
  });
});

module.exports = {
  startTorrentDownload,
  getDownloadProgress,
  stopDownload,
  activeDownloads
}; 