const { Client } = require('pg');

async function seedDatabase() {
  const client = new Client({
    host: process.env.POSTGRES_HOST || 'localhost',
    port: process.env.POSTGRES_PORT || 5432,
    user: process.env.POSTGRES_USER || 'hypertube_user',
    password: process.env.POSTGRES_PASSWORD || 'hypertube_password',
    database: process.env.POSTGRES_DB || 'hypertube',
  });

  try {
    await client.connect();
    console.log('🔌 Connected to database...');

    // Créer d'abord les tables si elles n'existent pas
    console.log('📋 Creating tables if not exist...');
    
    await client.query(`
      CREATE TABLE IF NOT EXISTS "movies" (
        "id" SERIAL PRIMARY KEY,
        "tmdbId" INTEGER UNIQUE NOT NULL,
        "imdbId" VARCHAR,
        "title" VARCHAR NOT NULL,
        "originalTitle" VARCHAR,
        "overview" TEXT,
        "releaseDate" DATE,
        "runtime" INTEGER,
        "genres" TEXT[] DEFAULT '{}',
        "posterPath" VARCHAR,
        "backdropPath" VARCHAR,
        "voteAverage" DECIMAL(3,1) DEFAULT 0,
        "voteCount" INTEGER DEFAULT 0,
        "popularity" DECIMAL(10,3) DEFAULT 0,
        "adult" BOOLEAN DEFAULT FALSE,
        "originalLanguage" VARCHAR(5),
        "status" VARCHAR(20) DEFAULT 'available',
        "tagline" VARCHAR,
        "homepage" VARCHAR,
        "budget" BIGINT,
        "revenue" BIGINT,
        "productionCompanies" JSON,
        "productionCountries" JSON,
        "spokenLanguages" JSON,
        "createdAt" TIMESTAMP DEFAULT NOW(),
        "updatedAt" TIMESTAMP DEFAULT NOW()
      )
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS "torrents" (
        "id" SERIAL PRIMARY KEY,
        "magnetUri" VARCHAR UNIQUE NOT NULL,
        "hash" VARCHAR NOT NULL,
        "name" VARCHAR NOT NULL,
        "size" BIGINT NOT NULL,
        "seeders" INTEGER DEFAULT 0,
        "leechers" INTEGER DEFAULT 0,
        "quality" VARCHAR(10) NOT NULL,
        "status" VARCHAR(20) DEFAULT 'pending',
        "progress" DECIMAL(5,2) DEFAULT 0,
        "filePath" VARCHAR,
        "createdAt" TIMESTAMP DEFAULT NOW(),
        "updatedAt" TIMESTAMP DEFAULT NOW(),
        "movieId" INTEGER NOT NULL REFERENCES "movies"("id") ON DELETE CASCADE
      )
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS "comments" (
        "id" SERIAL PRIMARY KEY,
        "userId" INTEGER NOT NULL,
        "content" TEXT NOT NULL,
        "rating" INTEGER CHECK ("rating" >= 1 AND "rating" <= 10),
        "createdAt" TIMESTAMP DEFAULT NOW(),
        "updatedAt" TIMESTAMP DEFAULT NOW(),
        "movieId" INTEGER NOT NULL
      )
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS "watch_history" (
        "id" SERIAL PRIMARY KEY,
        "userId" INTEGER NOT NULL,
        "watchedAt" TIMESTAMP DEFAULT NOW(),
        "progress" DECIMAL(5,2) DEFAULT 0,
        "completed" BOOLEAN DEFAULT FALSE,
        "createdAt" TIMESTAMP DEFAULT NOW(),
        "updatedAt" TIMESTAMP DEFAULT NOW(),
        "movieId" INTEGER NOT NULL
      )
    `);

    // Nettoyer les données existantes
    console.log('🧹 Cleaning existing data...');
    await client.query('DELETE FROM "comments"');
    await client.query('DELETE FROM "watch_history"');
    await client.query('DELETE FROM "torrents"');
    await client.query('DELETE FROM "movies"');

    // Insérer des films populaires
    console.log('🎬 Inserting movies...');
    
    const movies = [
      {
        tmdbId: 550,
        imdbId: 'tt0137523',
        title: 'Fight Club',
        originalTitle: 'Fight Club',
        overview: 'A ticking-time-bomb insomniac and a slippery soap salesman channel primal male aggression into a shocking new form of therapy.',
        releaseDate: '1999-10-15',
        runtime: 139,
        genres: ['Drama', 'Thriller'],
        posterPath: '/pB8BM7pdSp6B6Ih7QZ4DrQ3PmJK.jpg',
        backdropPath: '/fCayJrkfRaCRCTh8GqN30f8oyQF.jpg',
        voteAverage: 8.4,
        voteCount: 26280,
        popularity: 61.416,
        tagline: 'Mischief. Mayhem. Soap.',
        originalLanguage: 'en'
      },
      {
        tmdbId: 238,
        imdbId: 'tt0111161',
        title: 'The Shawshank Redemption',
        originalTitle: 'The Shawshank Redemption',
        overview: 'Framed in the 1940s for the double murder of his wife and her lover, upstanding banker Andy Dufresne begins a new life at the Shawshank prison.',
        releaseDate: '1994-09-23',
        runtime: 142,
        genres: ['Drama', 'Crime'],
        posterPath: '/q6y0Go1tsGEsmtFryDOJo3dEmqu.jpg',
        backdropPath: '/SBtFtwLY8WKKEbABFYM5B0YstT.jpg',
        voteAverage: 8.7,
        voteCount: 24947,
        popularity: 88.632,
        tagline: 'Fear can hold you prisoner. Hope can set you free.',
        originalLanguage: 'en'
      },
      {
        tmdbId: 680,
        imdbId: 'tt0110912',
        title: 'Pulp Fiction',
        originalTitle: 'Pulp Fiction',
        overview: 'A burger-loving hit man, his philosophical partner, a drug-addled gangster moll and a washed-up boxer converge in this sprawling, comedic crime caper.',
        releaseDate: '1994-09-10',
        runtime: 154,
        genres: ['Crime', 'Drama'],
        posterPath: '/d5iIlFn5s0ImszYzBPb8JPIfbXD.jpg',
        backdropPath: '/4cDFJr4HnXN5AdPw4AKrmLlMWdO.jpg',
        voteAverage: 8.5,
        voteCount: 26727,
        popularity: 97.924,
        tagline: 'Just because you are a character does not mean you have character.',
        originalLanguage: 'en'
      },
      {
        tmdbId: 155,
        imdbId: 'tt0468569',
        title: 'The Dark Knight',
        originalTitle: 'The Dark Knight',
        overview: 'Batman raises the stakes in his war on crime with the help of Lt. Jim Gordon and District Attorney Harvey Dent.',
        releaseDate: '2008-07-16',
        runtime: 152,
        genres: ['Action', 'Crime', 'Drama', 'Thriller'],
        posterPath: '/qJ2tW6WMUDux911r6m7haRef0WH.jpg',
        backdropPath: '/hkUDUYVws3ri1n1c8d4ESCKsj1b.jpg',
        voteAverage: 8.5,
        voteCount: 31617,
        popularity: 123.167,
        tagline: 'Welcome to a world without rules.',
        originalLanguage: 'en'
      },
      {
        tmdbId: 13,
        imdbId: 'tt0109830',
        title: 'Forrest Gump',
        originalTitle: 'Forrest Gump',
        overview: 'A man with a low IQ has accomplished great things in his life and been present during significant historic events.',
        releaseDate: '1994-06-23',
        runtime: 142,
        genres: ['Comedy', 'Drama', 'Romance'],
        posterPath: '/arw2vcBveWOVZr6pxd9XTd1TdQa.jpg',
        backdropPath: '/3h1JZGDhZ8nzxdgvkxha0qBqi05.jpg',
        voteAverage: 8.5,
        voteCount: 25821,
        popularity: 78.991,
        tagline: 'Life is like a box of chocolates... you never know what you are gonna get.',
        originalLanguage: 'en'
      },
      {
        tmdbId: 424,
        imdbId: 'tt0078748',
        title: 'Alien',
        originalTitle: 'Alien',
        overview: 'During its return to the earth, commercial spaceship Nostromo intercepts a distress signal from a distant planet.',
        releaseDate: '1979-05-25',
        runtime: 117,
        genres: ['Horror', 'Science Fiction'],
        posterPath: '/vfrQk5IPloGg1v9Rzbh2Eg3VGyM.jpg',
        backdropPath: '/zfeZGv1mNLOPVefO1jjDg7MP7HZ.jpg',
        voteAverage: 8.1,
        voteCount: 13492,
        popularity: 95.321,
        tagline: 'In space no one can hear you scream.',
        originalLanguage: 'en'
      },
      {
        tmdbId: 278,
        imdbId: 'tt0111161',
        title: 'The Matrix',
        originalTitle: 'The Matrix',
        overview: 'Set in the 22nd century, The Matrix tells the story of a computer hacker who joins a group of underground insurgents fighting the vast and powerful computers who now rule the earth.',
        releaseDate: '1999-03-30',
        runtime: 136,
        genres: ['Action', 'Science Fiction'],
        posterPath: '/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg',
        backdropPath: '/fNG7i7RqMErkcqhohV2a6cV1Ekg.jpg',
        voteAverage: 8.2,
        voteCount: 23858,
        popularity: 85.416,
        tagline: 'Welcome to the Real World.',
        originalLanguage: 'en'
      },
      {
        tmdbId: 372058,
        imdbId: 'tt4154756',
        title: 'Your Name',
        originalTitle: '君の名は。',
        overview: 'High schoolers Mitsuha and Taki are complete strangers living separate lives. But one night, they suddenly switch places.',
        releaseDate: '2016-08-26',
        runtime: 106,
        genres: ['Romance', 'Animation', 'Drama'],
        posterPath: '/q719jXXEzOoYaps6babgKnONONX.jpg',
        backdropPath: '/7prYzufdIOy1KCTZKVWpjBFqqNr.jpg',
        voteAverage: 8.5,
        voteCount: 10863,
        popularity: 92.115,
        tagline: 'Now I remember your name. And you remember mine.',
        originalLanguage: 'ja'
      }
    ];

    for (const movie of movies) {
      await client.query(`
        INSERT INTO "movies" (
          "tmdbId", "imdbId", "title", "originalTitle", "overview", "releaseDate", 
          "runtime", "genres", "posterPath", "backdropPath", "voteAverage", 
          "voteCount", "popularity", "adult", "originalLanguage", "tagline"
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)
      `, [
        movie.tmdbId, movie.imdbId, movie.title, movie.originalTitle, movie.overview,
        movie.releaseDate, movie.runtime, movie.genres, movie.posterPath, movie.backdropPath,
        movie.voteAverage, movie.voteCount, movie.popularity, false, movie.originalLanguage, movie.tagline
      ]);
    }

    // Insérer des torrents pour chaque film
    console.log('📁 Inserting torrents...');
    
    const result = await client.query('SELECT id FROM "movies"');
    const movieIds = result.rows.map(row => row.id);

    const qualities = ['720p', '1080p', '2160p'];
    
    for (const movieId of movieIds) {
      // Créer 2-3 torrents par film avec différentes qualités
      for (let i = 0; i < 2; i++) {
        const quality = qualities[i % qualities.length];
        const size = quality === '720p' ? 1500000000 : quality === '1080p' ? 3000000000 : 8000000000; // Tailles approximatives
        
        await client.query(`
          INSERT INTO "torrents" (
            "magnetUri", "hash", "name", "size", "seeders", "leechers", 
            "quality", "status", "progress", "movieId"
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
        `, [
          `magnet:?xt=urn:btih:${Math.random().toString(36).substring(7)}&dn=Movie+${movieId}+${quality}`,
          Math.random().toString(36).substring(7),
          `Movie ${movieId} ${quality}`,
          size,
          Math.floor(Math.random() * 100) + 10, // 10-110 seeders
          Math.floor(Math.random() * 50) + 5,   // 5-55 leechers
          quality,
          'completed',
          100,
          movieId
        ]);
      }
    }

    // Insérer des commentaires
    console.log('💬 Inserting comments...');
    
    const comments = [
      'Amazing movie! One of my all-time favorites.',
      'Great cinematography and excellent acting.',
      'A masterpiece of cinema.',
      'Loved every minute of it!',
      'The plot was incredible and kept me on the edge of my seat.',
      'Beautiful storytelling and character development.',
      'Highly recommended for anyone who loves good cinema.',
      'This movie changed my perspective on life.',
      'Incredible soundtrack and visual effects.',
      'A must-watch classic!'
    ];

    for (const movieId of movieIds) {
      // 3-5 commentaires par film
      const numComments = Math.floor(Math.random() * 3) + 3;
      for (let i = 0; i < numComments; i++) {
        await client.query(`
          INSERT INTO "comments" ("userId", "content", "rating", "movieId")
          VALUES ($1, $2, $3, $4)
        `, [
          Math.floor(Math.random() * 10) + 1, // userId 1-10
          comments[Math.floor(Math.random() * comments.length)],
          Math.floor(Math.random() * 5) + 6, // rating 6-10
          movieId
        ]);
      }
    }

    // Insérer de l'historique de visionnage
    console.log('📺 Inserting watch history...');
    
    for (const movieId of movieIds) {
      // Quelques entrées d'historique par film
      const numHistory = Math.floor(Math.random() * 3) + 1;
      for (let i = 0; i < numHistory; i++) {
        await client.query(`
          INSERT INTO "watch_history" ("userId", "progress", "completed", "movieId")
          VALUES ($1, $2, $3, $4)
        `, [
          Math.floor(Math.random() * 10) + 1, // userId 1-10
          Math.floor(Math.random() * 100), // progress 0-100%
          Math.random() > 0.5, // completed true/false
          movieId
        ]);
      }
    }

    console.log('✅ Database seeded successfully!');
    console.log(`📊 Inserted:`);
    console.log(`   - ${movies.length} movies`);
    console.log(`   - ${movieIds.length * 2} torrents`);
    console.log(`   - Multiple comments and watch history entries`);
    
  } catch (error) {
    console.error('❌ Error seeding database:', error);
  } finally {
    await client.end();
  }
}

// Execute if run directly
if (require.main === module) {
  seedDatabase();
}

module.exports = { seedDatabase }; 