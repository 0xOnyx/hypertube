const { Pool } = require('pg');

// Utiliser POSTGRES_URL si disponible, sinon utiliser les variables individuelles
const pool = new Pool(
  process.env.POSTGRES_URL ? {
    connectionString: process.env.POSTGRES_URL,
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
  } : {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    database: process.env.DB_NAME || 'hypertube',
    user: process.env.DB_USER || 'hypertube',
    password: process.env.DB_PASSWORD || 'hypertube_password',
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
  }
);

const connectDB = async () => {
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT NOW()');
    client.release();
    console.log('✅ Connexion PostgreSQL établie:', result.rows[0].now);
    return pool;
  } catch (error) {
    console.error('❌ Erreur de connexion PostgreSQL:', error);
    throw error;
  }
};

module.exports = {
  pool,
  connectDB,
}; 