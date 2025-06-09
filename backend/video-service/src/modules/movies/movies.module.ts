import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MoviesController } from './movies.controller';
import { MoviesService } from './movies.service';
import { Movie } from '../../common/entities/movie.entity';
import { Comment } from '../../common/entities/comment.entity';
import { WatchHistory } from '../../common/entities/watch-history.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Movie, Comment, WatchHistory])],
  controllers: [MoviesController],
  providers: [MoviesService],
  exports: [MoviesService],
})
export class MoviesModule {} 