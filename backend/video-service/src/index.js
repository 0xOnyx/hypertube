const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const cron = require('node-cron');

const movieRoutes = require('./routes/movies');
const { connectDB } = require('./config/database');
const errorHandler = require('./middleware/errorHandler');
const { cleanupOldVideos } = require('./services/cleanupService');

const app = express();
const PORT = process.env.PORT || 3002;

// Middleware de sécurité
app.use(helmet());
app.use(cors());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200 // limite plus élevée pour le streaming
});
app.use(limiter);

// Middleware de parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Configuration Swagger
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Hypertube Video Service API',
      version: '1.0.0',
      description: 'Service de streaming vidéo pour Hypertube',
    },
    servers: [
      {
        url: 'http://localhost:3002',
        description: 'Serveur de développement',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
  },
  apis: ['./src/routes/*.js'],
};

const specs = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

// Routes
app.use('/movies', movieRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    service: 'video-service', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Middleware de gestion d'erreurs
app.use(errorHandler);

// Tâche cron pour nettoyer les vieux fichiers (tous les jours à 2h du matin)
cron.schedule('0 2 * * *', () => {
  console.log('🧹 Démarrage du nettoyage des anciens fichiers...');
  cleanupOldVideos();
});

// Connexion à la base de données et démarrage du serveur
async function startServer() {
  try {
    await connectDB();
    console.log('✅ Connexion à la base de données établie');
    
    app.listen(PORT, () => {
      console.log(`🚀 Video Service démarré sur le port ${PORT}`);
      console.log(`📚 Documentation Swagger disponible sur http://localhost:${PORT}/api-docs`);
    });
  } catch (error) {
    console.error('❌ Erreur lors du démarrage du serveur:', error);
    process.exit(1);
  }
}

startServer();

module.exports = app; 