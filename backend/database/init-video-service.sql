-- Hypertube Database Initialization Script
-- Compatible with TypeORM entities in video-service

-- Enable extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Movies table (compatible with Movie entity)
CREATE TABLE IF NOT EXISTS movies (
    id SERIAL PRIMARY KEY,
    "imdbId" VARCHAR(50) UNIQUE NOT NULL,
    title VARCHAR(500) NOT NULL,
    "originalTitle" VARCHAR(500),
    year INTEGER,
    rating DECIMAL(3,1),
    runtime INTEGER, -- in minutes
    synopsis TEXT,
    genres TEXT[], -- Array of genres (simple-array in TypeORM)
    directors TEXT[], -- Array of directors (simple-array in TypeORM)
    actors TEXT[], -- Array of actor names (simple-array in TypeORM)
    "posterUrl" VARCHAR(500), -- URL to poster image
    "backdropUrl" VARCHAR(500), -- URL to backdrop image
    "trailerUrl" VARCHAR(500), -- URL to trailer
    status VARCHAR(20) DEFAULT 'available', -- available, downloading, processing, unavailable
    "videoPath" VARCHAR(1000), -- Path to video file
    "fileSize" BIGINT, -- in bytes
    quality VARCHAR(10), -- Video quality (720p, 1080p, etc.)
    "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Torrents table (compatible with Torrent entity)
CREATE TABLE IF NOT EXISTS torrents (
    id SERIAL PRIMARY KEY,
    "magnetUri" TEXT UNIQUE NOT NULL,
    hash VARCHAR(64) NOT NULL,
    name VARCHAR(500) NOT NULL,
    size BIGINT NOT NULL, -- in bytes
    seeders INTEGER DEFAULT 0,
    leechers INTEGER DEFAULT 0,
    quality VARCHAR(10) NOT NULL, -- 720p, 1080p, etc.
    status VARCHAR(20) DEFAULT 'pending', -- pending, downloading, completed, failed, seeding
    progress DECIMAL(5,2) DEFAULT 0, -- Download progress (0-100)
    "filePath" VARCHAR(1000), -- Downloaded file path
    "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "movieId" INTEGER NOT NULL REFERENCES movies(id) ON DELETE CASCADE
);

-- Comments table (compatible with Comment entity)
CREATE TABLE IF NOT EXISTS comments (
    id SERIAL PRIMARY KEY,
    "userId" INTEGER NOT NULL, -- Reference to user (managed by auth-service)
    content TEXT NOT NULL,
    rating DECIMAL(2,1), -- User rating (1-5)
    "isModerated" BOOLEAN DEFAULT FALSE,
    "isVisible" BOOLEAN DEFAULT TRUE,
    "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "movieId" INTEGER NOT NULL REFERENCES movies(id) ON DELETE CASCADE
);

-- Watch History table (compatible with WatchHistory entity)
CREATE TABLE IF NOT EXISTS watch_history (
    id SERIAL PRIMARY KEY,
    "userId" INTEGER NOT NULL, -- Reference to user (managed by auth-service)
    "watchPosition" INTEGER DEFAULT 0, -- Current watch position in seconds
    "totalWatchTime" INTEGER, -- Total watched time in seconds
    completed BOOLEAN DEFAULT FALSE,
    "progressPercentage" DECIMAL(5,2) DEFAULT 0, -- Watched percentage (0-100)
    status VARCHAR(20) DEFAULT 'watching', -- watching, paused, completed, abandoned
    "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "movieId" INTEGER NOT NULL REFERENCES movies(id) ON DELETE CASCADE,
    UNIQUE("userId", "movieId")
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS "IDX_movies_imdbId" ON movies("imdbId");
CREATE INDEX IF NOT EXISTS "IDX_movies_title_year" ON movies(title, year);
CREATE INDEX IF NOT EXISTS "IDX_movies_status" ON movies(status);

CREATE INDEX IF NOT EXISTS "IDX_torrents_magnetUri" ON torrents("magnetUri");
CREATE INDEX IF NOT EXISTS "IDX_torrents_movieId" ON torrents("movieId");
CREATE INDEX IF NOT EXISTS "IDX_torrents_quality" ON torrents(quality);

CREATE INDEX IF NOT EXISTS "IDX_comments_movieId_userId" ON comments("movieId", "userId");
CREATE INDEX IF NOT EXISTS "IDX_comments_movieId" ON comments("movieId");
CREATE INDEX IF NOT EXISTS "IDX_comments_userId" ON comments("userId");

CREATE INDEX IF NOT EXISTS "IDX_watch_history_userId_movieId" ON watch_history("userId", "movieId");
CREATE INDEX IF NOT EXISTS "IDX_watch_history_userId" ON watch_history("userId");
CREATE INDEX IF NOT EXISTS "IDX_watch_history_movieId" ON watch_history("movieId");

-- Update timestamp trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW."updatedAt" = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at columns
CREATE TRIGGER update_movies_updated_at 
    BEFORE UPDATE ON movies 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_torrents_updated_at 
    BEFORE UPDATE ON torrents 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_comments_updated_at 
    BEFORE UPDATE ON comments 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_watch_history_updated_at 
    BEFORE UPDATE ON watch_history 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert sample movies for testing
INSERT INTO movies ("imdbId", title, year, runtime, genres, directors, actors, synopsis, "posterUrl", rating, status)
VALUES 
    ('tt0111161', 'The Shawshank Redemption', 1994, 142, 
     ARRAY['Drama'], ARRAY['Frank Darabont'], ARRAY['Tim Robbins', 'Morgan Freeman'], 
     'Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.',
     'https://m.media-amazon.com/images/M/MV5BMDFkYTc0MGEtZmNhMC00ZDIzLWFmNTEtODM1ZmRlYWMwMWFmXkEyXkFqcGdeQXVyMTMxODk2OTU@._V1_SX300.jpg',
     9.3, 'available'),
    
    ('tt0068646', 'The Godfather', 1972, 175, 
     ARRAY['Crime', 'Drama'], ARRAY['Francis Ford Coppola'], ARRAY['Marlon Brando', 'Al Pacino'], 
     'The aging patriarch of an organized crime dynasty transfers control of his clandestine empire to his reluctant son.',
     'https://m.media-amazon.com/images/M/MV5BM2MyNjYxNmUtYTAwNi00MTYxLWJmNWYtYzZlODY3ZTk3OTFlXkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_SX300.jpg',
     9.2, 'available'),
     
    ('tt0137523', 'Fight Club', 1999, 139, 
     ARRAY['Drama', 'Thriller'], ARRAY['David Fincher'], ARRAY['Brad Pitt', 'Edward Norton'], 
     'An insomniac office worker and a soap salesman form an underground fight club.',
     'https://m.media-amazon.com/images/M/MV5BNDIzNDU0YzEtYzE5Ni00ZjlkLTk5ZjgtNjM3NWE4YzA3Nzk3XkEyXkFqcGdeQXVyMjUzOTY0NTY@._V1_SX300.jpg',
     8.8, 'available'),
     
    ('tt0468569', 'The Dark Knight', 2008, 152, 
     ARRAY['Action', 'Crime', 'Drama'], ARRAY['Christopher Nolan'], ARRAY['Christian Bale', 'Heath Ledger'], 
     'Batman faces the Joker, a criminal mastermind who wants to plunge Gotham City into anarchy.',
     'https://m.media-amazon.com/images/M/MV5BMTMxNTMwODM0NF5BMl5BanBnXkFtZTcwODAyMTk2Mw@@._V1_SX300.jpg',
     9.0, 'available'),
     
    ('tt0109830', 'Forrest Gump', 1994, 142, 
     ARRAY['Comedy', 'Drama', 'Romance'], ARRAY['Robert Zemeckis'], ARRAY['Tom Hanks', 'Robin Wright'], 
     'The presidencies of Kennedy and Johnson, events of Vietnam, Watergate, and other history unfold through the perspective of an Alabama man.',
     'https://m.media-amazon.com/images/M/MV5BNWIwODRlZTUtY2U3ZS00Yzg1LWJhNzYtMmZiYmEyNmU1NjMzXkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_SX300.jpg',
     8.8, 'available')
ON CONFLICT ("imdbId") DO NOTHING;

-- Insert sample torrents
DO $$
DECLARE
    movie_record RECORD;
    qualities TEXT[] := ARRAY['720p', '1080p'];
    quality_text TEXT;
BEGIN
    FOR movie_record IN SELECT id, title FROM movies LOOP
        FOREACH quality_text IN ARRAY qualities LOOP
            INSERT INTO torrents ("magnetUri", hash, name, size, seeders, leechers, quality, status, progress, "movieId")
            VALUES (
                'magnet:?xt=urn:btih:' || substr(md5(random()::text || movie_record.id::text || quality_text), 1, 40) || '&dn=' || replace(movie_record.title, ' ', '+') || '+' || quality_text,
                substr(md5(random()::text || movie_record.id::text || quality_text), 1, 40),
                movie_record.title || ' ' || quality_text,
                CASE quality_text 
                    WHEN '720p' THEN 1500000000 
                    WHEN '1080p' THEN 3000000000 
                    ELSE 2000000000 
                END,
                floor(random() * 100 + 10)::int,
                floor(random() * 50 + 5)::int,
                quality_text,
                'completed',
                100,
                movie_record.id
            )
            ON CONFLICT ("magnetUri") DO NOTHING;
        END LOOP;
    END LOOP;
END $$;

-- Insert sample comments
DO $$
DECLARE
    movie_record RECORD;
    comment_texts TEXT[] := ARRAY[
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
    comment_text TEXT;
    i INTEGER;
BEGIN
    FOR movie_record IN SELECT id FROM movies LOOP
        FOR i IN 1..3 LOOP -- 3 comments per movie
            SELECT comment_texts[floor(random() * array_length(comment_texts, 1) + 1)] INTO comment_text;
            INSERT INTO comments ("userId", content, rating, "movieId")
            VALUES (
                floor(random() * 10 + 1)::int, -- Random userId 1-10
                comment_text,
                round((random() * 2 + 3)::numeric, 1), -- Random rating 3.0-5.0
                movie_record.id
            );
        END LOOP;
    END LOOP;
END $$;

-- Insert sample watch history
DO $$
DECLARE
    movie_record RECORD;
    i INTEGER;
BEGIN
    FOR movie_record IN SELECT id FROM movies LOOP
        FOR i IN 1..2 LOOP -- 2 watch history entries per movie
            INSERT INTO watch_history ("userId", "watchPosition", "totalWatchTime", completed, "progressPercentage", "movieId")
            VALUES (
                floor(random() * 10 + 1)::int, -- Random userId 1-10
                floor(random() * 7200)::int, -- Random watch position 0-2 hours
                floor(random() * 3600 + 1800)::int, -- Random total watch time 30min-1h
                random() > 0.7, -- 30% chance completed
                round((random() * 100)::numeric, 2), -- Random progress 0-100%
                movie_record.id
            )
            ON CONFLICT ("userId", "movieId") DO NOTHING;
        END LOOP;
    END LOOP;
END $$; 