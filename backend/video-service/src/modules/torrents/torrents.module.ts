import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TorrentsController } from './torrents.controller';
import { TorrentsService } from './torrents.service';
import { Torrent } from '../../common/entities/torrent.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Torrent])],
  controllers: [TorrentsController],
  providers: [TorrentsService],
  exports: [TorrentsService],
})
export class TorrentsModule {} 