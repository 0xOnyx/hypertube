import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { Movie } from '../common/entities/movie.entity';
import { Torrent } from '../common/entities/torrent.entity';
import { WatchHistory } from '../common/entities/watch-history.entity';
import { Comment } from '../common/entities/comment.entity';

export const databaseConfig = (
  configService: ConfigService,
): TypeOrmModuleOptions => ({
  type: 'postgres',
  host: configService.get('POSTGRES_HOST', 'localhost'),
  port: configService.get('POSTGRES_PORT', 5432),
  username: configService.get('POSTGRES_USER', 'hypertube_user'),
  password: configService.get('POSTGRES_PASSWORD', 'hypertube_password'),
  database: configService.get('POSTGRES_DB', 'hypertube'),
  entities: [Movie, Torrent, WatchHistory, Comment],
  migrations: ['dist/database/migrations/*.js'],
  synchronize: configService.get('NODE_ENV') !== 'production',
  logging: configService.get('NODE_ENV') === 'development',
  retryAttempts: 3,
  retryDelay: 3000,
}); 