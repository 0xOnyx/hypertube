const fs = require('fs-extra');
const path = require('path');
const { pool } = require('../config/database');

const cleanupOldVideos = async () => {
  try {
    console.log('🧹 Démarrage du nettoyage des anciens fichiers...');

    const daysOld = parseInt(process.env.CLEANUP_DAYS) || 30;
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysOld);

    console.log(`📅 Suppression des fichiers non accédés depuis: ${cutoffDate.toISOString()}`);

    // Récupérer les films anciens
    const result = await pool.query(
      'SELECT id, title, video_path, last_accessed FROM movies WHERE last_accessed < $1 AND status = $2',
      [cutoffDate, 'ready']
    );

    console.log(`📊 ${result.rows.length} films à nettoyer`);

    let deletedCount = 0;
    let freedSpace = 0;

    for (const movie of result.rows) {
      try {
        if (movie.video_path && fs.existsSync(movie.video_path)) {
          const stats = fs.statSync(movie.video_path);
          const sizeInMB = (stats.size / 1024 / 1024).toFixed(2);
          
          console.log(`🗑️ Suppression: ${movie.title} (${sizeInMB} MB)`);
          
          // Supprimer le fichier vidéo
          await fs.remove(movie.video_path);
          freedSpace += stats.size;
          deletedCount++;

          // Mettre à jour le statut en base
          await pool.query(
            'UPDATE movies SET status = $1, video_path = NULL WHERE id = $2',
            ['pending', movie.id]
          );

          // Supprimer aussi les sous-titres associés
          await cleanupMovieSubtitles(movie.id);

        }
      } catch (error) {
        console.error(`❌ Erreur lors de la suppression du film ${movie.id}:`, error);
      }
    }

    // Nettoyer les répertoires vides
    await cleanupEmptyDirectories();

    // Nettoyer les fichiers temporaires
    await cleanupTempFiles();

    const freedSpaceMB = (freedSpace / 1024 / 1024).toFixed(2);
    const freedSpaceGB = (freedSpace / 1024 / 1024 / 1024).toFixed(2);

    console.log(`✅ Nettoyage terminé:`);
    console.log(`   📁 ${deletedCount} fichiers supprimés`);
    console.log(`   💾 ${freedSpaceMB} MB (${freedSpaceGB} GB) libérés`);

    // Enregistrer les statistiques de nettoyage
    await recordCleanupStats(deletedCount, freedSpace);

  } catch (error) {
    console.error('❌ Erreur lors du nettoyage:', error);
  }
};

const cleanupMovieSubtitles = async (movieId) => {
  try {
    const subtitles = await pool.query(
      'SELECT file_path FROM subtitles WHERE movie_id = $1',
      [movieId]
    );

    for (const subtitle of subtitles.rows) {
      if (fs.existsSync(subtitle.file_path)) {
        await fs.remove(subtitle.file_path);
        console.log(`🗑️ Sous-titre supprimé: ${subtitle.file_path}`);
      }
    }

    // Supprimer les entrées de la base de données
    await pool.query(
      'DELETE FROM subtitles WHERE movie_id = $1',
      [movieId]
    );

  } catch (error) {
    console.error(`Erreur lors du nettoyage des sous-titres pour le film ${movieId}:`, error);
  }
};

const cleanupEmptyDirectories = async () => {
  try {
    const storagePaths = [
      process.env.STORAGE_PATH || '/app/storage/videos',
      process.env.SUBTITLE_STORAGE_PATH || '/app/storage/subtitles',
      '/app/torrents'
    ];

    for (const storagePath of storagePaths) {
      if (fs.existsSync(storagePath)) {
        await removeEmptyDirectories(storagePath);
      }
    }
  } catch (error) {
    console.error('Erreur lors du nettoyage des répertoires vides:', error);
  }
};

const removeEmptyDirectories = async (dirPath) => {
  try {
    const files = await fs.readdir(dirPath);
    
    if (files.length === 0) {
      // Le répertoire est vide, on peut le supprimer
      await fs.rmdir(dirPath);
      console.log(`📁 Répertoire vide supprimé: ${dirPath}`);
      return;
    }

    // Traiter récursivement les sous-répertoires
    for (const file of files) {
      const filePath = path.join(dirPath, file);
      const stats = await fs.stat(filePath);
      
      if (stats.isDirectory()) {
        await removeEmptyDirectories(filePath);
      }
    }

    // Vérifier à nouveau si le répertoire est maintenant vide
    const remainingFiles = await fs.readdir(dirPath);
    if (remainingFiles.length === 0) {
      await fs.rmdir(dirPath);
      console.log(`📁 Répertoire vide supprimé: ${dirPath}`);
    }

  } catch (error) {
    // Ignorer les erreurs de répertoires non vides ou non trouvés
    if (error.code !== 'ENOTEMPTY' && error.code !== 'ENOENT') {
      console.error(`Erreur lors de la suppression du répertoire ${dirPath}:`, error);
    }
  }
};

const cleanupTempFiles = async () => {
  try {
    const tempPaths = [
      '/tmp',
      '/app/temp',
      process.env.TEMP_PATH || '/app/temp'
    ];

    for (const tempPath of tempPaths) {
      if (fs.existsSync(tempPath)) {
        await cleanupOldTempFiles(tempPath);
      }
    }
  } catch (error) {
    console.error('Erreur lors du nettoyage des fichiers temporaires:', error);
  }
};

const cleanupOldTempFiles = async (tempPath) => {
  try {
    const files = await fs.readdir(tempPath);
    const oneDayAgo = Date.now() - (24 * 60 * 60 * 1000); // 24 heures

    for (const file of files) {
      const filePath = path.join(tempPath, file);
      
      try {
        const stats = await fs.stat(filePath);
        
        // Supprimer les fichiers temporaires de plus de 24h
        if (stats.mtime.getTime() < oneDayAgo) {
          if (stats.isDirectory()) {
            await fs.remove(filePath);
            console.log(`📁 Répertoire temporaire supprimé: ${filePath}`);
          } else {
            await fs.remove(filePath);
            console.log(`🗑️ Fichier temporaire supprimé: ${filePath}`);
          }
        }
      } catch (error) {
        // Ignorer les erreurs de fichiers inaccessibles
        continue;
      }
    }
  } catch (error) {
    console.error(`Erreur lors du nettoyage de ${tempPath}:`, error);
  }
};

const recordCleanupStats = async (deletedCount, freedSpace) => {
  try {
    // Optionnel: Enregistrer les statistiques de nettoyage
    // Peut être utile pour le monitoring et les rapports
    console.log('📊 Enregistrement des statistiques de nettoyage...');
    
    // TODO: Créer une table cleanup_stats si nécessaire
    // INSERT INTO cleanup_stats (deleted_count, freed_space, cleanup_date)
    
  } catch (error) {
    console.error('Erreur lors de l\'enregistrement des stats:', error);
  }
};

const getStorageStats = async () => {
  try {
    const storagePath = process.env.STORAGE_PATH || '/app/storage/videos';
    
    if (!fs.existsSync(storagePath)) {
      return {
        totalFiles: 0,
        totalSize: 0,
        totalSizeMB: 0,
        totalSizeGB: 0
      };
    }

    let totalFiles = 0;
    let totalSize = 0;

    const files = await fs.readdir(storagePath);
    
    for (const file of files) {
      const filePath = path.join(storagePath, file);
      try {
        const stats = await fs.stat(filePath);
        if (stats.isFile()) {
          totalFiles++;
          totalSize += stats.size;
        }
      } catch (error) {
        continue;
      }
    }

    return {
      totalFiles,
      totalSize,
      totalSizeMB: (totalSize / 1024 / 1024).toFixed(2),
      totalSizeGB: (totalSize / 1024 / 1024 / 1024).toFixed(2)
    };
  } catch (error) {
    console.error('Erreur lors du calcul des statistiques de stockage:', error);
    return null;
  }
};

const forceCleanupMovie = async (movieId) => {
  try {
    console.log(`🗑️ Nettoyage forcé du film ${movieId}`);

    const result = await pool.query(
      'SELECT video_path, title FROM movies WHERE id = $1',
      [movieId]
    );

    if (result.rows.length === 0) {
      throw new Error('Film non trouvé');
    }

    const movie = result.rows[0];

    if (movie.video_path && fs.existsSync(movie.video_path)) {
      const stats = fs.statSync(movie.video_path);
      await fs.remove(movie.video_path);
      
      console.log(`✅ Fichier vidéo supprimé: ${movie.title}`);
      
      await pool.query(
        'UPDATE movies SET status = $1, video_path = NULL WHERE id = $2',
        ['pending', movieId]
      );
    }

    await cleanupMovieSubtitles(movieId);

    return true;
  } catch (error) {
    console.error(`Erreur lors du nettoyage forcé du film ${movieId}:`, error);
    return false;
  }
};

module.exports = {
  cleanupOldVideos,
  cleanupMovieSubtitles,
  cleanupEmptyDirectories,
  cleanupTempFiles,
  getStorageStats,
  forceCleanupMovie
};