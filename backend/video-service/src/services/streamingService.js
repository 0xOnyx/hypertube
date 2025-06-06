const fs = require('fs');
const path = require('path');
const mime = require('mime-types');

const CHUNK_SIZE = 1024 * 1024; // 1MB chunks

const streamVideo = async (videoPath, req, res) => {
  try {
    const stat = fs.statSync(videoPath);
    const fileSize = stat.size;
    const range = req.headers.range;

    // Définir le type MIME
    const mimeType = mime.lookup(videoPath) || 'video/mp4';

    if (range) {
      // Streaming avec Range (lecture partielle)
      const parts = range.replace(/bytes=/, "").split("-");
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : Math.min(start + CHUNK_SIZE - 1, fileSize - 1);

      if (start >= fileSize) {
        res.status(416).send('Requested range not satisfiable\n' + start + ' >= ' + fileSize);
        return;
      }

      const chunksize = (end - start) + 1;
      const file = fs.createReadStream(videoPath, { start, end });

      const head = {
        'Content-Range': `bytes ${start}-${end}/${fileSize}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': chunksize,
        'Content-Type': mimeType,
        'Cache-Control': 'public, max-age=31536000', // Cache pendant 1 an
      };

      res.writeHead(206, head);
      file.pipe(res);

      file.on('error', (error) => {
        console.error('Erreur lors de la lecture du fichier:', error);
        res.status(500).end();
      });

    } else {
      // Streaming complet (sans Range)
      const head = {
        'Content-Length': fileSize,
        'Content-Type': mimeType,
        'Accept-Ranges': 'bytes',
        'Cache-Control': 'public, max-age=31536000',
      };

      res.writeHead(200, head);
      
      const stream = fs.createReadStream(videoPath);
      stream.pipe(res);

      stream.on('error', (error) => {
        console.error('Erreur lors de la lecture du fichier:', error);
        res.status(500).end();
      });
    }

  } catch (error) {
    if (error.code === 'ENOENT') {
      res.status(404).json({ error: 'Fichier vidéo non trouvé' });
    } else {
      console.error('Erreur lors du streaming:', error);
      res.status(500).json({ error: 'Erreur lors du streaming' });
    }
  }
};

const getVideoInfo = (videoPath) => {
  try {
    const stat = fs.statSync(videoPath);
    const mimeType = mime.lookup(videoPath) || 'video/mp4';
    
    return {
      size: stat.size,
      mimeType,
      lastModified: stat.mtime,
      exists: true
    };
  } catch (error) {
    return {
      exists: false,
      error: error.message
    };
  }
};

const generateThumbnail = async (videoPath, outputPath, timeOffset = '00:00:10') => {
  // TODO: Utiliser FFmpeg pour générer une miniature
  // Cette fonction sera implémentée avec le service FFmpeg
  return null;
};

module.exports = {
  streamVideo,
  getVideoInfo,
  generateThumbnail
}; 