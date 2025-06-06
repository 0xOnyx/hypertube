const ffmpeg = require('fluent-ffmpeg');
const path = require('path');
const fs = require('fs-extra');

// Configuration FFmpeg - les binaires devraient être disponibles dans le container Docker
const convertToMp4 = (inputPath, outputPath) => {
  return new Promise((resolve, reject) => {
    console.log(`🔄 Début de la conversion: ${inputPath} -> ${outputPath}`);

    // Vérifier que le fichier d'entrée existe
    if (!fs.existsSync(inputPath)) {
      return reject(new Error(`Fichier d'entrée non trouvé: ${inputPath}`));
    }

    // Créer le répertoire de sortie si nécessaire
    fs.ensureDirSync(path.dirname(outputPath));

    ffmpeg(inputPath)
      .output(outputPath)
      .videoCodec('libx264')
      .audioCodec('aac')
      .format('mp4')
      .addOptions([
        '-preset fast',
        '-crf 23',
        '-maxrate 4M',
        '-bufsize 8M',
        '-movflags +faststart', // Optimisation pour le streaming
        '-pix_fmt yuv420p', // Compatibilité maximale
      ])
      .on('start', (commandLine) => {
        console.log(`▶️ FFmpeg démarré: ${commandLine}`);
      })
      .on('progress', (progress) => {
        if (progress.percent) {
          console.log(`📈 Conversion: ${Math.round(progress.percent)}%`);
        }
      })
      .on('end', () => {
        console.log(`✅ Conversion terminée: ${outputPath}`);
        resolve(outputPath);
      })
      .on('error', (err) => {
        console.error(`❌ Erreur de conversion:`, err);
        
        // Nettoyer le fichier de sortie en cas d'erreur
        if (fs.existsSync(outputPath)) {
          fs.removeSync(outputPath);
        }
        
        reject(err);
      })
      .run();
  });
};

const generateThumbnail = (inputPath, outputPath, timeOffset = '00:00:10') => {
  return new Promise((resolve, reject) => {
    console.log(`🖼️ Génération de miniature: ${inputPath} -> ${outputPath}`);

    if (!fs.existsSync(inputPath)) {
      return reject(new Error(`Fichier d'entrée non trouvé: ${inputPath}`));
    }

    fs.ensureDirSync(path.dirname(outputPath));

    ffmpeg(inputPath)
      .screenshots({
        timestamps: [timeOffset],
        filename: path.basename(outputPath),
        folder: path.dirname(outputPath),
        size: '320x240'
      })
      .on('end', () => {
        console.log(`✅ Miniature générée: ${outputPath}`);
        resolve(outputPath);
      })
      .on('error', (err) => {
        console.error(`❌ Erreur de génération de miniature:`, err);
        reject(err);
      });
  });
};

const getVideoMetadata = (inputPath) => {
  return new Promise((resolve, reject) => {
    ffmpeg.ffprobe(inputPath, (err, metadata) => {
      if (err) {
        console.error(`❌ Erreur de lecture des métadonnées:`, err);
        return reject(err);
      }

      const videoStream = metadata.streams.find(stream => stream.codec_type === 'video');
      const audioStream = metadata.streams.find(stream => stream.codec_type === 'audio');

      const info = {
        duration: metadata.format.duration,
        size: metadata.format.size,
        bitrate: metadata.format.bit_rate,
        format: metadata.format.format_name,
        video: videoStream ? {
          codec: videoStream.codec_name,
          width: videoStream.width,
          height: videoStream.height,
          fps: eval(videoStream.r_frame_rate),
          bitrate: videoStream.bit_rate
        } : null,
        audio: audioStream ? {
          codec: audioStream.codec_name,
          channels: audioStream.channels,
          sampleRate: audioStream.sample_rate,
          bitrate: audioStream.bit_rate
        } : null
      };

      console.log(`📊 Métadonnées extraites pour: ${inputPath}`);
      resolve(info);
    });
  });
};

const convertToStreamingFormat = (inputPath, outputPath) => {
  return new Promise((resolve, reject) => {
    console.log(`🔄 Conversion pour streaming: ${inputPath} -> ${outputPath}`);

    if (!fs.existsSync(inputPath)) {
      return reject(new Error(`Fichier d'entrée non trouvé: ${inputPath}`));
    }

    fs.ensureDirSync(path.dirname(outputPath));

    ffmpeg(inputPath)
      .output(outputPath)
      .videoCodec('libx264')
      .audioCodec('aac')
      .format('mp4')
      .addOptions([
        '-preset medium',
        '-crf 20',
        '-maxrate 2M',
        '-bufsize 4M',
        '-movflags +faststart',
        '-pix_fmt yuv420p',
        '-profile:v baseline',
        '-level 3.0'
      ])
      .on('start', (commandLine) => {
        console.log(`▶️ FFmpeg streaming démarré: ${commandLine}`);
      })
      .on('progress', (progress) => {
        if (progress.percent) {
          console.log(`📈 Conversion streaming: ${Math.round(progress.percent)}%`);
        }
      })
      .on('end', () => {
        console.log(`✅ Conversion streaming terminée: ${outputPath}`);
        resolve(outputPath);
      })
      .on('error', (err) => {
        console.error(`❌ Erreur de conversion streaming:`, err);
        
        if (fs.existsSync(outputPath)) {
          fs.removeSync(outputPath);
        }
        
        reject(err);
      })
      .run();
  });
};

// Fonction utilitaire pour nettoyer les fichiers temporaires
const cleanupTempFiles = (directory) => {
  try {
    const files = fs.readdirSync(directory);
    files.forEach(file => {
      const filePath = path.join(directory, file);
      const stats = fs.statSync(filePath);
      
      // Supprimer les fichiers temporaires de plus de 24h
      if (stats.isFile() && Date.now() - stats.mtime.getTime() > 24 * 60 * 60 * 1000) {
        fs.removeSync(filePath);
        console.log(`🗑️ Fichier temporaire supprimé: ${filePath}`);
      }
    });
  } catch (error) {
    console.error('Erreur lors du nettoyage des fichiers temporaires:', error);
  }
};

module.exports = {
  convertToMp4,
  generateThumbnail,
  getVideoMetadata,
  convertToStreamingFormat,
  cleanupTempFiles
}; 