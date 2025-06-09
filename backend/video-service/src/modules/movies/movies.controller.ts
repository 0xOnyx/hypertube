import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { MoviesService } from './movies.service';
import { Movie } from '../../common/entities/movie.entity';
import { Comment } from '../../common/entities/comment.entity';
import { WatchHistory } from '../../common/entities/watch-history.entity';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateWatchHistoryDto } from './dto/update-watch-history.dto';
import { MovieSearchDto } from './dto/movie-search.dto';

@ApiTags('movies')
@Controller('movies')
export class MoviesController {
  constructor(private readonly moviesService: MoviesService) {}

  @Get()
  @ApiOperation({ summary: 'Get all movies with pagination' })
  @ApiResponse({ status: 200, description: 'Movies list', type: [Movie] })
  async findAll(@Query() searchDto: MovieSearchDto) {
    return this.moviesService.findAll(searchDto);
  }

  @Get('search')
  @ApiOperation({ summary: 'Search movies' })
  @ApiResponse({ status: 200, description: 'Search results', type: [Movie] })
  async search(@Query() searchDto: MovieSearchDto) {
    return this.moviesService.search(searchDto);
  }

  @Get('popular')
  @ApiOperation({ summary: 'Get popular movies' })
  @ApiResponse({ status: 200, description: 'Popular movies', type: [Movie] })
  async getPopular(@Query('page') page = 1, @Query('limit') limit = 20) {
    return this.moviesService.getPopular(page, limit);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get movie by ID' })
  @ApiResponse({ status: 200, description: 'Movie details', type: Movie })
  @ApiResponse({ status: 404, description: 'Movie not found' })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.moviesService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new movie' })
  @ApiResponse({ status: 201, description: 'Movie created', type: Movie })
  @ApiBearerAuth()
  async create(@Body() createMovieDto: CreateMovieDto) {
    return this.moviesService.create(createMovieDto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a movie' })
  @ApiResponse({ status: 200, description: 'Movie updated', type: Movie })
  @ApiBearerAuth()
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateMovieDto: UpdateMovieDto,
  ) {
    return this.moviesService.update(id, updateMovieDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a movie' })
  @ApiResponse({ status: 200, description: 'Movie deleted' })
  @ApiBearerAuth()
  async remove(@Param('id', ParseIntPipe) id: number) {
    return this.moviesService.remove(id);
  }

  // Comments
  @Get(':id/comments')
  @ApiOperation({ summary: 'Get comments for a movie' })
  @ApiResponse({ status: 200, description: 'Movie comments', type: [Comment] })
  async getComments(@Param('id', ParseIntPipe) id: number) {
    return this.moviesService.getComments(id);
  }

  @Post(':id/comments')
  @ApiOperation({ summary: 'Add a comment to a movie' })
  @ApiResponse({ status: 201, description: 'Comment added', type: Comment })
  @ApiBearerAuth()
  async addComment(
    @Param('id', ParseIntPipe) id: number,
    @Body() createCommentDto: CreateCommentDto,
  ) {
    return this.moviesService.addComment(id, createCommentDto);
  }

  // Watch history
  @Get(':id/watch-history/:userId')
  @ApiOperation({ summary: 'Get user watch history for a movie' })
  @ApiResponse({ status: 200, description: 'Watch history', type: WatchHistory })
  @ApiBearerAuth()
  async getWatchHistory(
    @Param('id', ParseIntPipe) id: number,
    @Param('userId', ParseIntPipe) userId: number,
  ) {
    return this.moviesService.getWatchHistory(id, userId);
  }

  @Post(':id/watch-history')
  @ApiOperation({ summary: 'Update watch history' })
  @ApiResponse({ status: 200, description: 'History updated', type: WatchHistory })
  @ApiBearerAuth()
  async updateWatchHistory(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateWatchHistoryDto: UpdateWatchHistoryDto,
  ) {
    return this.moviesService.updateWatchHistory(id, updateWatchHistoryDto);
  }

  @Get(':id/stream')
  @ApiOperation({ summary: 'Get streaming URL for a movie' })
  @ApiResponse({ status: 200, description: 'Streaming URL' })
  @ApiBearerAuth()
  async getStreamingUrl(@Param('id', ParseIntPipe) id: number) {
    return this.moviesService.getStreamingUrl(id);
  }
} 