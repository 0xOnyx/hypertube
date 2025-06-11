-- Seeding script pour Hypertube Video Service
-- Nettoyer les données existantes
DELETE FROM "comments";
DELETE FROM "watch_history";
DELETE FROM "torrents";
DELETE FROM "movies";

-- Insérer des films populaires
INSERT INTO "movies" (
  "tmdbId", "imdbId", "title", "originalTitle", "overview", "releaseDate", 
  "runtime", "genres", "posterPath", "backdropPath", "voteAverage", 
  "voteCount", "popularity", "adult", "originalLanguage", "tagline"
) VALUES 
(550, 'tt0137523', 'Fight Club', 'Fight Club', 'A ticking-time-bomb insomniac and a slippery soap salesman channel primal male aggression into a shocking new form of therapy.', '1999-10-15', 139, ARRAY['Drama', 'Thriller'], '/pB8BM7pdSp6B6Ih7QZ4DrQ3PmJK.jpg', '/fCayJrkfRaCRCTh8GqN30f8oyQF.jpg', 8.4, 26280, 61.416, false, 'en', 'Mischief. Mayhem. Soap.'),

(238, 'tt0111161', 'The Shawshank Redemption', 'The Shawshank Redemption', 'Framed in the 1940s for the double murder of his wife and her lover, upstanding banker Andy Dufresne begins a new life at the Shawshank prison.', '1994-09-23', 142, ARRAY['Drama', 'Crime'], '/q6y0Go1tsGEsmtFryDOJo3dEmqu.jpg', '/SBtFtwLY8WKKEbABFYM5B0YstT.jpg', 8.7, 24947, 88.632, false, 'en', 'Fear can hold you prisoner. Hope can set you free.'),

(680, 'tt0110912', 'Pulp Fiction', 'Pulp Fiction', 'A burger-loving hit man, his philosophical partner, a drug-addled gangster moll and a washed-up boxer converge in this sprawling, comedic crime caper.', '1994-09-10', 154, ARRAY['Crime', 'Drama'], '/d5iIlFn5s0ImszYzBPb8JPIfbXD.jpg', '/4cDFJr4HnXN5AdPw4AKrmLlMWdO.jpg', 8.5, 26727, 97.924, false, 'en', 'Just because you are a character does not mean you have character.'),

(155, 'tt0468569', 'The Dark Knight', 'The Dark Knight', 'Batman raises the stakes in his war on crime with the help of Lt. Jim Gordon and District Attorney Harvey Dent.', '2008-07-16', 152, ARRAY['Action', 'Crime', 'Drama', 'Thriller'], '/qJ2tW6WMUDux911r6m7haRef0WH.jpg', '/hkUDUYVws3ri1n1c8d4ESCKsj1b.jpg', 8.5, 31617, 123.167, false, 'en', 'Welcome to a world without rules.'),

(13, 'tt0109830', 'Forrest Gump', 'Forrest Gump', 'A man with a low IQ has accomplished great things in his life and been present during significant historic events.', '1994-06-23', 142, ARRAY['Comedy', 'Drama', 'Romance'], '/arw2vcBveWOVZr6pxd9XTd1TdQa.jpg', '/3h1JZGDhZ8nzxdgvkxha0qBqi05.jpg', 8.5, 25821, 78.991, false, 'en', 'Life is like a box of chocolates... you never know what you are gonna get.'),

(424, 'tt0078748', 'Alien', 'Alien', 'During its return to the earth, commercial spaceship Nostromo intercepts a distress signal from a distant planet.', '1979-05-25', 117, ARRAY['Horror', 'Science Fiction'], '/vfrQk5IPloGg1v9Rzbh2Eg3VGyM.jpg', '/zfeZGv1mNLOPVefO1jjDg7MP7HZ.jpg', 8.1, 13492, 95.321, false, 'en', 'In space no one can hear you scream.'),

(603, 'tt0133093', 'The Matrix', 'The Matrix', 'Set in the 22nd century, The Matrix tells the story of a computer hacker who joins a group of underground insurgents fighting the vast and powerful computers who now rule the earth.', '1999-03-30', 136, ARRAY['Action', 'Science Fiction'], '/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg', '/fNG7i7RqMErkcqhohV2a6cV1Ekg.jpg', 8.2, 23858, 85.416, false, 'en', 'Welcome to the Real World.'),

(372058, 'tt4154756', 'Your Name', '君の名は。', 'High schoolers Mitsuha and Taki are complete strangers living separate lives. But one night, they suddenly switch places.', '2016-08-26', 106, ARRAY['Romance', 'Animation', 'Drama'], '/q719jXXEzOoYaps6babgKnONONX.jpg', '/7prYzufdIOy1KCTZKVWpjBFqqNr.jpg', 8.5, 10863, 92.115, false, 'ja', 'Now I remember your name. And you remember mine.');

-- Insérer des torrents pour chaque film
INSERT INTO "torrents" ("magnetUri", "hash", "name", "size", "seeders", "leechers", "quality", "status", "progress", "movieId")
SELECT 
  'magnet:?xt=urn:btih:' || substr(md5(random()::text), 0, 20) || '&dn=Movie+' || id || '+720p',
  substr(md5(random()::text), 0, 20),
  'Movie ' || id || ' 720p',
  1500000000,
  floor(random() * 100 + 10)::int,
  floor(random() * 50 + 5)::int,
  '720p',
  'completed',
  100,
  id
FROM "movies";

INSERT INTO "torrents" ("magnetUri", "hash", "name", "size", "seeders", "leechers", "quality", "status", "progress", "movieId")
SELECT 
  'magnet:?xt=urn:btih:' || substr(md5(random()::text), 0, 20) || '&dn=Movie+' || id || '+1080p',
  substr(md5(random()::text), 0, 20),
  'Movie ' || id || ' 1080p',
  3000000000,
  floor(random() * 80 + 15)::int,
  floor(random() * 40 + 8)::int,
  '1080p',
  'completed',
  100,
  id
FROM "movies";

-- Insérer des commentaires
INSERT INTO "comments" ("userId", "content", "rating", "movieId")
SELECT 
  floor(random() * 10 + 1)::int,
  (ARRAY[
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
  ])[floor(random() * 10 + 1)],
  floor(random() * 5 + 6)::int,
  m.id
FROM "movies" m, generate_series(1, 4) as comment_num;

-- Insérer de l'historique de visionnage
INSERT INTO "watch_history" ("userId", "progress", "completed", "movieId")
SELECT 
  floor(random() * 10 + 1)::int,
  floor(random() * 100)::int,
  random() > 0.5,
  m.id
FROM "movies" m, generate_series(1, 2) as history_num;

-- Afficher un résumé
SELECT 
  'Movies' as table_name, 
  COUNT(*) as count 
FROM "movies"
UNION ALL
SELECT 
  'Torrents' as table_name, 
  COUNT(*) as count 
FROM "torrents"
UNION ALL
SELECT 
  'Comments' as table_name, 
  COUNT(*) as count 
FROM "comments"
UNION ALL
SELECT 
  'Watch History' as table_name, 
  COUNT(*) as count 
FROM "watch_history"; 