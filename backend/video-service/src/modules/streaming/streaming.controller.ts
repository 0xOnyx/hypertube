import { Controller, Get, Param, ParseIntPipe, Res } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { Response } from 'express';
import { StreamingService } from './streaming.service';

@ApiTags('streaming')
@Controller('streaming')
export class StreamingController {
  constructor(private readonly streamingService: StreamingService) {}

  @Get('movies/:id/stream')
  @ApiOperation({ summary: 'Stream a movie' })
  async streamMovie(
    @Param('id', ParseIntPipe) id: number,
    @Res() res: Response,
  ) {
    return this.streamingService.streamMovie(id, res);
  }
} 