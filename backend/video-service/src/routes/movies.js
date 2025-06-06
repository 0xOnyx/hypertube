const express = require('express');
const fs = require('fs');
const path = require('path');
const { pool } = require('../config/database');
const { startTorrentDownload } = require('../services/torrentService');
const { streamVideo } = require('../services/streamingService');
const { getSubtitles } = require('../services/subtitleService');

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Movie:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         imdbId:
 *           type: string
 *         title:
 *           type: string
 *         year:
 *           type: integer
 *         rating:
 *           type: number
 *         runtime:
 *           type: integer
 *         genre:
 *           type: string
 *         director:
 *           type: string
 *         plot:
 *           type: string
 *         posterUrl:
 *           type: string
 *         status:
 *           type: string
 *           enum: [pending, downloading, ready, error]
 */

/**
 * @swagger
 * /movies/{id}:
 *   get:
 *     summary: Récupérer les détails d'un film
 *     tags: [Movies]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID du film
 *     responses:
 *       200:
 *         description: Détails du film
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Movie'
 *       404:
 *         description: Film non trouvé
 */
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const result = await pool.query(
      'SELECT * FROM movies WHERE id = $1',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Film non trouvé' });
    }

    const movie = result.rows[0];

    // Mettre à jour la date de dernier accès
    await pool.query(
      'UPDATE movies SET last_accessed = CURRENT_TIMESTAMP WHERE id = $1',
      [id]
    );

    res.json({
      id: movie.id,
      imdbId: movie.imdb_id,
      title: movie.title,
      year: movie.year,
      rating: movie.rating,
      runtime: movie.runtime,
      genre: movie.genre,
      director: movie.director,
      plot: movie.plot,
      posterUrl: movie.poster_url,
      status: movie.status,
      createdAt: movie.created_at,
      lastAccessed: movie.last_accessed,
    });
  } catch (error) {
    console.error('Erreur lors de la récupération du film:', error);
    res.status(500).json({ error: 'Erreur interne du serveur' });
  }
});

/**
 * @swagger
 * /movies/{id}/stream:
 *   post:
 *     summary: Lancer le téléchargement d'un torrent et préparer le streaming
 *     tags: [Movies]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID du film
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - magnetLink
 *             properties:
 *               magnetLink:
 *                 type: string
 *                 description: Lien magnet du torrent
 *     responses:
 *       200:
 *         description: Téléchargement démarré
 *       400:
 *         description: Données invalides
 *       404:
 *         description: Film non trouvé
 */
router.post('/:id/stream', async (req, res) => {
  try {
    const { id } = req.params;
    const { magnetLink } = req.body;

    if (!magnetLink) {
      return res.status(400).json({ error: 'Lien magnet requis' });
    }

    // Vérifier si le film existe
    const movieResult = await pool.query(
      'SELECT * FROM movies WHERE id = $1',
      [id]
    );

    if (movieResult.rows.length === 0) {
      return res.status(404).json({ error: 'Film non trouvé' });
    }

    const movie = movieResult.rows[0];

    // Si le film est déjà prêt, pas besoin de redémarrer
    if (movie.status === 'ready' && movie.video_path && fs.existsSync(movie.video_path)) {
      return res.json({ 
        status: 'ready', 
        message: 'Film déjà disponible',
        videoPath: movie.video_path 
      });
    }

    // Mettre à jour le statut et démarrer le téléchargement
    await pool.query(
      'UPDATE movies SET status = $1, magnet_link = $2 WHERE id = $3',
      ['downloading', magnetLink, id]
    );

    // Démarrer le téléchargement en arrière-plan
    startTorrentDownload(id, magnetLink);

    res.json({ 
      status: 'downloading', 
      message: 'Téléchargement démarré' 
    });
  } catch (error) {
    console.error('Erreur lors du démarrage du stream:', error);
    res.status(500).json({ error: 'Erreur interne du serveur' });
  }
});

/**
 * @swagger
 * /movies/{id}/video:
 *   get:
 *     summary: Streamer le fichier vidéo avec support Range
 *     tags: [Movies]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID du film
 *       - in: header
 *         name: Range
 *         schema:
 *           type: string
 *         required: false
 *         description: Range header pour streaming partiel
 *     responses:
 *       206:
 *         description: Contenu partiel (streaming)
 *         content:
 *           video/mp4:
 *             schema:
 *               type: string
 *               format: binary
 *       200:
 *         description: Fichier vidéo complet
 *       404:
 *         description: Film non trouvé ou non disponible
 *       416:
 *         description: Range non satisfiable
 */
router.get('/:id/video', async (req, res) => {
  try {
    const { id } = req.params;
    
    const result = await pool.query(
      'SELECT * FROM movies WHERE id = $1',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Film non trouvé' });
    }

    const movie = result.rows[0];

    if (movie.status !== 'ready' || !movie.video_path) {
      return res.status(404).json({ 
        error: 'Vidéo non disponible', 
        status: movie.status 
      });
    }

    // Vérifier si le fichier existe
    if (!fs.existsSync(movie.video_path)) {
      // Marquer le film comme erreur
      await pool.query(
        'UPDATE movies SET status = $1 WHERE id = $2',
        ['error', id]
      );
      return res.status(404).json({ error: 'Fichier vidéo non trouvé' });
    }

    // Mettre à jour la date de dernier accès
    await pool.query(
      'UPDATE movies SET last_accessed = CURRENT_TIMESTAMP WHERE id = $1',
      [id]
    );

    // Utiliser le service de streaming
    await streamVideo(movie.video_path, req, res);
  } catch (error) {
    console.error('Erreur lors du streaming:', error);
    res.status(500).json({ error: 'Erreur interne du serveur' });
  }
});

/**
 * @swagger
 * /movies/{id}/subtitles/{lang}:
 *   get:
 *     summary: Récupérer les sous-titres dans une langue spécifique
 *     tags: [Movies]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID du film
 *       - in: path
 *         name: lang
 *         schema:
 *           type: string
 *         required: true
 *         description: Code langue (ex: fr, en, es)
 *     responses:
 *       200:
 *         description: Fichier de sous-titres
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *       404:
 *         description: Sous-titres non trouvés
 */
router.get('/:id/subtitles/:lang', async (req, res) => {
  try {
    const { id, lang } = req.params;
    
    const result = await pool.query(
      'SELECT * FROM subtitles WHERE movie_id = $1 AND language_code = $2',
      [id, lang]
    );

    if (result.rows.length === 0) {
      // Essayer de télécharger les sous-titres
      const subtitlePath = await getSubtitles(id, lang);
      if (!subtitlePath) {
        return res.status(404).json({ error: 'Sous-titres non trouvés' });
      }
      
      // Sauvegarder en base
      await pool.query(
        'INSERT INTO subtitles (movie_id, language_code, file_path) VALUES ($1, $2, $3)',
        [id, lang, subtitlePath]
      );
      
      return res.sendFile(path.resolve(subtitlePath));
    }

    const subtitle = result.rows[0];
    
    if (!fs.existsSync(subtitle.file_path)) {
      return res.status(404).json({ error: 'Fichier de sous-titres non trouvé' });
    }

    res.sendFile(path.resolve(subtitle.file_path));
  } catch (error) {
    console.error('Erreur lors de la récupération des sous-titres:', error);
    res.status(500).json({ error: 'Erreur interne du serveur' });
  }
});

/**
 * @swagger
 * /movies/{id}/status:
 *   get:
 *     summary: Récupérer le statut de téléchargement d'un film
 *     tags: [Movies]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID du film
 *     responses:
 *       200:
 *         description: Statut du film
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                 progress:
 *                   type: number
 *                 downloadSpeed:
 *                   type: number
 *       404:
 *         description: Film non trouvé
 */
router.get('/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    
    const result = await pool.query(
      'SELECT status FROM movies WHERE id = $1',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Film non trouvé' });
    }

    const movie = result.rows[0];
    
    // TODO: Récupérer les informations de progression depuis le service torrent
    res.json({
      status: movie.status,
      progress: movie.status === 'ready' ? 100 : 0,
      downloadSpeed: 0
    });
  } catch (error) {
    console.error('Erreur lors de la récupération du statut:', error);
    res.status(500).json({ error: 'Erreur interne du serveur' });
  }
});

module.exports = router; 