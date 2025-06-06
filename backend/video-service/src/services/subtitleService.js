const axios = require('axios');
const fs = require('fs-extra');
const path = require('path');
const { pool } = require('../config/database');

const SUBTITLE_STORAGE_PATH = process.env.SUBTITLE_STORAGE_PATH || '/app/storage/subtitles';

// Assurer que le répertoire de stockage des sous-titres existe
fs.ensureDirSync(SUBTITLE_STORAGE_PATH);

// Service de téléchargement de sous-titres depuis OpenSubtitles ou autres sources
const getSubtitles = async (movieId, languageCode) => {
  try {
    console.log(`🔍 Recherche de sous-titres pour le film ${movieId} en ${languageCode}`);

    // Récupérer les informations du film depuis la base de données
    const movieResult = await pool.query(
      'SELECT * FROM movies WHERE id = $1',
      [movieId]
    );

    if (movieResult.rows.length === 0) {
      throw new Error('Film non trouvé');
    }

    const movie = movieResult.rows[0];
    
    // Vérifier si les sous-titres existent déjà
    const existingSubtitle = await pool.query(
      'SELECT * FROM subtitles WHERE movie_id = $1 AND language_code = $2',
      [movieId, languageCode]
    );

    if (existingSubtitle.rows.length > 0) {
      const subtitle = existingSubtitle.rows[0];
      if (fs.existsSync(subtitle.file_path)) {
        console.log(`✅ Sous-titres déjà disponibles: ${subtitle.file_path}`);
        return subtitle.file_path;
      }
    }

    // Essayer de télécharger depuis différentes sources
    let subtitlePath = null;

    // 1. Essayer avec l'IMDB ID si disponible
    if (movie.imdb_id) {
      subtitlePath = await downloadFromOpenSubtitles(movie.imdb_id, languageCode, movieId);
    }

    // 2. Essayer avec le titre du film
    if (!subtitlePath && movie.title) {
      subtitlePath = await searchSubtitlesByTitle(movie.title, movie.year, languageCode, movieId);
    }

    // 3. Générer des sous-titres automatiques (placeholder)
    if (!subtitlePath) {
      subtitlePath = await generateAutoSubtitles(movieId, languageCode);
    }

    if (subtitlePath) {
      // Sauvegarder en base de données
      await pool.query(
        'INSERT INTO subtitles (movie_id, language_code, file_path) VALUES ($1, $2, $3) ON CONFLICT (movie_id, language_code) DO UPDATE SET file_path = $3',
        [movieId, languageCode, subtitlePath]
      );

      console.log(`✅ Sous-titres téléchargés et sauvegardés: ${subtitlePath}`);
      return subtitlePath;
    }

    console.log(`❌ Aucuns sous-titres trouvés pour le film ${movieId} en ${languageCode}`);
    return null;

  } catch (error) {
    console.error('Erreur lors de la récupération des sous-titres:', error);
    return null;
  }
};

const downloadFromOpenSubtitles = async (imdbId, languageCode, movieId) => {
  try {
    // Note: Cette implémentation est un placeholder
    // Dans un vrai projet, vous devriez utiliser l'API OpenSubtitles
    // avec une clé API valide
    
    console.log(`🔍 Recherche sur OpenSubtitles: IMDB ${imdbId}, langue ${languageCode}`);
    
    // API OpenSubtitles (exemple, nécessite une clé API)
    const openSubtitlesApiKey = process.env.OPENSUBTITLES_API_KEY;
    
    if (!openSubtitlesApiKey) {
      console.log('⚠️ Clé API OpenSubtitles non configurée');
      return null;
    }

    // Exemple d'appel API (à adapter selon la documentation OpenSubtitles)
    const response = await axios.get(`https://api.opensubtitles.com/api/v1/subtitles`, {
      headers: {
        'Api-Key': openSubtitlesApiKey,
        'Content-Type': 'application/json'
      },
      params: {
        imdb_id: imdbId,
        languages: languageCode,
        order_by: 'download_count'
      },
      timeout: 10000
    });

    if (response.data && response.data.data && response.data.data.length > 0) {
      const subtitle = response.data.data[0];
      const downloadUrl = subtitle.attributes.url;
      
      if (downloadUrl) {
        const subtitlePath = path.join(SUBTITLE_STORAGE_PATH, `${movieId}_${languageCode}.srt`);
        await downloadSubtitleFile(downloadUrl, subtitlePath);
        return subtitlePath;
      }
    }

    return null;
  } catch (error) {
    console.error('Erreur OpenSubtitles:', error.message);
    return null;
  }
};

const searchSubtitlesByTitle = async (title, year, languageCode, movieId) => {
  try {
    console.log(`🔍 Recherche par titre: "${title}" (${year}) en ${languageCode}`);
    
    // Placeholder - Dans un vrai projet, utilisez une API de sous-titres
    // comme SubDB, OpenSubtitles, ou d'autres services
    
    return null;
  } catch (error) {
    console.error('Erreur recherche par titre:', error);
    return null;
  }
};

const downloadSubtitleFile = async (url, outputPath) => {
  try {
    console.log(`⬇️ Téléchargement: ${url} -> ${outputPath}`);

    const response = await axios({
      method: 'GET',
      url: url,
      responseType: 'stream',
      timeout: 30000
    });

    const writer = fs.createWriteStream(outputPath);
    response.data.pipe(writer);

    return new Promise((resolve, reject) => {
      writer.on('finish', () => {
        console.log(`✅ Sous-titre téléchargé: ${outputPath}`);
        resolve(outputPath);
      });
      writer.on('error', reject);
    });
  } catch (error) {
    console.error('Erreur téléchargement sous-titre:', error);
    throw error;
  }
};

const generateAutoSubtitles = async (movieId, languageCode) => {
  try {
    console.log(`🤖 Génération de sous-titres automatiques pour le film ${movieId}`);
    
    // Placeholder pour des sous-titres générés automatiquement
    // Dans un vrai projet, vous pourriez utiliser:
    // - Speech-to-text avec FFmpeg et des APIs comme Google Speech, Azure, etc.
    // - Services de transcription automatique
    
    const subtitlePath = path.join(SUBTITLE_STORAGE_PATH, `${movieId}_${languageCode}_auto.srt`);
    
    // Créer un fichier de sous-titres par défaut
    const defaultSubtitles = `1
00:00:00,000 --> 00:00:05,000
Sous-titres non disponibles

2
00:00:05,000 --> 00:00:10,000
Auto-generated subtitles not available for this content
`;

    await fs.writeFile(subtitlePath, defaultSubtitles);
    console.log(`✅ Sous-titres par défaut créés: ${subtitlePath}`);
    
    return subtitlePath;
  } catch (error) {
    console.error('Erreur génération sous-titres auto:', error);
    return null;
  }
};

const convertSubtitleFormat = async (inputPath, outputPath, targetFormat = 'srt') => {
  try {
    // Placeholder pour la conversion de formats de sous-titres
    // Supporte: srt, vtt, ass, ssa, etc.
    
    const inputContent = await fs.readFile(inputPath, 'utf8');
    
    // Conversion simple SRT -> WebVTT
    if (targetFormat === 'vtt' && path.extname(inputPath) === '.srt') {
      const vttContent = convertSrtToVtt(inputContent);
      await fs.writeFile(outputPath, vttContent);
      return outputPath;
    }
    
    // Pour d'autres conversions, utiliser des librairies spécialisées
    // comme subtitle, node-ffmpeg, etc.
    
    return inputPath;
  } catch (error) {
    console.error('Erreur conversion sous-titres:', error);
    return null;
  }
};

const convertSrtToVtt = (srtContent) => {
  let vttContent = 'WEBVTT\n\n';
  
  // Remplacer les virgules par des points pour les timestamps
  vttContent += srtContent.replace(/(\d{2}:\d{2}:\d{2}),(\d{3})/g, '$1.$2');
  
  return vttContent;
};

const getAvailableLanguages = async (movieId) => {
  try {
    const result = await pool.query(
      'SELECT language_code FROM subtitles WHERE movie_id = $1',
      [movieId]
    );
    
    return result.rows.map(row => row.language_code);
  } catch (error) {
    console.error('Erreur récupération langues disponibles:', error);
    return [];
  }
};

const cleanupOldSubtitles = async (daysOld = 30) => {
  try {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysOld);
    
    const result = await pool.query(
      'SELECT file_path FROM subtitles WHERE created_at < $1',
      [cutoffDate]
    );
    
    for (const row of result.rows) {
      if (fs.existsSync(row.file_path)) {
        await fs.remove(row.file_path);
        console.log(`🗑️ Sous-titre supprimé: ${row.file_path}`);
      }
    }
    
    await pool.query(
      'DELETE FROM subtitles WHERE created_at < $1',
      [cutoffDate]
    );
    
    console.log(`✅ Nettoyage des sous-titres de plus de ${daysOld} jours terminé`);
  } catch (error) {
    console.error('Erreur nettoyage sous-titres:', error);
  }
};

module.exports = {
  getSubtitles,
  downloadFromOpenSubtitles,
  convertSubtitleFormat,
  getAvailableLanguages,
  cleanupOldSubtitles
}; 