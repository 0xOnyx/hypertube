import { Controller, Get, Post, Body, Param, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { TorrentsService } from './torrents.service';

@ApiTags('torrents')
@Controller('torrents')
export class TorrentsController {
  constructor(private readonly torrentsService: TorrentsService) {}

  @Get(':movieId')
  @ApiOperation({ summary: 'Get torrents for a movie' })
  async getTorrentsByMovie(@Param('movieId', ParseIntPipe) movieId: number) {
    return this.torrentsService.findByMovieId(movieId);
  }

  @Post(':id/download')
  @ApiOperation({ summary: 'Start torrent download' })
  async startDownload(@Param('id', ParseIntPipe) id: number) {
    return this.torrentsService.startDownload(id);
  }
} 