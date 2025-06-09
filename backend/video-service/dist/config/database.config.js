"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.databaseConfig = void 0;
const movie_entity_1 = require("../common/entities/movie.entity");
const torrent_entity_1 = require("../common/entities/torrent.entity");
const watch_history_entity_1 = require("../common/entities/watch-history.entity");
const comment_entity_1 = require("../common/entities/comment.entity");
const databaseConfig = (configService) => ({
    type: 'postgres',
    host: configService.get('POSTGRES_HOST', 'localhost'),
    port: configService.get('POSTGRES_PORT', 5432),
    username: configService.get('POSTGRES_USER', 'hypertube_user'),
    password: configService.get('POSTGRES_PASSWORD', 'hypertube_password'),
    database: configService.get('POSTGRES_DB', 'hypertube'),
    entities: [movie_entity_1.Movie, torrent_entity_1.Torrent, watch_history_entity_1.WatchHistory, comment_entity_1.Comment],
    migrations: ['dist/database/migrations/*.js'],
    synchronize: configService.get('NODE_ENV') !== 'production',
    logging: configService.get('NODE_ENV') === 'development',
    retryAttempts: 3,
    retryDelay: 3000,
});
exports.databaseConfig = databaseConfig;
//# sourceMappingURL=database.config.js.map