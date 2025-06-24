import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, Between } from 'typeorm';
import { Movie } from '../../common/entities/movie.entity';
import { Comment } from '../../common/entities/comment.entity';
import { WatchHistory } from '../../common/entities/watch-history.entity';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateWatchHistoryDto } from './dto/update-watch-history.dto';
import { MovieSearchDto } from './dto/movie-search.dto';

@Injectable()
export class MoviesService {
  constructor(
    @InjectRepository(Movie)
    private movieRepository: Repository<Movie>,
    @InjectRepository(Comment)
    private commentRepository: Repository<Comment>,
    @InjectRepository(WatchHistory)
    private watchHistoryRepository: Repository<WatchHistory>,
  ) {}

  async findAll(searchDto: MovieSearchDto) {
    const { page = 1, limit = 20, sortBy = 'createdAt', sortOrder = 'DESC' } = searchDto;
    const skip = (page - 1) * limit;

    const [movies, total] = await this.movieRepository.findAndCount({
      skip,
      take: limit,
      order: { [sortBy]: sortOrder },
      relations: ['torrents'],
    });

    return {
      data: movies,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async search(searchDto: MovieSearchDto) {
    const { 
      query, 
      genres, 
      yearMin, 
      yearMax, 
      ratingMin, 
      page = 1, 
      limit = 20,
      sortBy = 'rating',
      sortOrder = 'DESC'
    } = searchDto;

    const queryBuilder = this.movieRepository.createQueryBuilder('movie');

    if (query) {
      queryBuilder.andWhere(
        '(movie.title ILIKE :query OR movie.originalTitle ILIKE :query OR movie.synopsis ILIKE :query)',
        { query: `%${query}%` }
      );
    }

    if (genres && genres.length > 0) {
      queryBuilder.andWhere('movie.genres && :genres', { genres });
    }

    if (yearMin) {
      queryBuilder.andWhere('movie.year >= :yearMin', { yearMin });
    }

    if (yearMax) {
      queryBuilder.andWhere('movie.year <= :yearMax', { yearMax });
    }

    if (ratingMin) {
      queryBuilder.andWhere('movie.rating >= :ratingMin', { ratingMin });
    }

    const skip = (page - 1) * limit;
    queryBuilder
      .leftJoinAndSelect('movie.torrents', 'torrents')
      .orderBy(`movie.${sortBy}`, sortOrder)
      .skip(skip)
      .take(limit);

    const [movies, total] = await queryBuilder.getManyAndCount();

    return {
      data: movies,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async getPopular(page = 1, limit = 20) {
    const skip = (page - 1) * limit;

    const [movies, total] = await this.movieRepository.findAndCount({
      where: { rating: Between(7, 10) },
      order: { rating: 'DESC', year: 'DESC' },
      skip,
      take: limit,
      relations: ['torrents'],
    });

    return {
      data: movies,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: number): Promise<Movie> {
    const movie = await this.movieRepository.findOne({
      where: { id },
      relations: ['torrents', 'comments', 'watchHistory'],
    });

    if (!movie) {
      throw new NotFoundException(`Movie with ID ${id} not found`);
    }

    return movie;
  }

  async create(createMovieDto: CreateMovieDto): Promise<Movie> {
    const movie = this.movieRepository.create(createMovieDto);
    return this.movieRepository.save(movie);
  }

  async update(id: number, updateMovieDto: UpdateMovieDto): Promise<Movie> {
    const movie = await this.findOne(id);
    Object.assign(movie, updateMovieDto);
    return this.movieRepository.save(movie);
  }

  async remove(id: number): Promise<void> {
    const movie = await this.findOne(id);
    await this.movieRepository.remove(movie);
  }

  // Commentaires
  async getComments(movieId: number): Promise<Comment[]> {
    return this.commentRepository.find({
      where: { movieId, isVisible: true },
      order: { createdAt: 'DESC' },
    });
  }

  async addComment(movieId: number, createCommentDto: CreateCommentDto): Promise<Comment> {
    const movie = await this.findOne(movieId);
    const comment = this.commentRepository.create({
      ...createCommentDto,
      movieId,
    });
    return this.commentRepository.save(comment);
  }

  // Historique de visionnage
  async getWatchHistory(movieId: number, userId: number): Promise<WatchHistory | null> {
    return this.watchHistoryRepository.findOne({
      where: { movieId, userId },
    });
  }

  async updateWatchHistory(movieId: number, updateWatchHistoryDto: UpdateWatchHistoryDto): Promise<WatchHistory> {
    const { userId, ...updateData } = updateWatchHistoryDto;
    
    let watchHistory = await this.getWatchHistory(movieId, userId);
    
    if (!watchHistory) {
      watchHistory = this.watchHistoryRepository.create({
        movieId,
        userId,
        ...updateData,
      });
    } else {
      Object.assign(watchHistory, updateData);
    }

    return this.watchHistoryRepository.save(watchHistory);
  }

  async getStreamingUrl(movieId: number): Promise<{ url: string }> {
    const movie = await this.findOne(movieId);
    
    if (!movie.videoPath) {
      throw new NotFoundException('Video file not available for this movie');
    }

    // Here, you could generate a signed URL or return the streaming server URL
    const streamingUrl = `/api/v1/streaming/movies/${movieId}/stream`;
    
    return { url: streamingUrl };
  }

  async getUserHistory(userId: number, page = 1, limit = 20) {
    const skip = (page - 1) * limit;

    const queryBuilder = this.movieRepository
      .createQueryBuilder('movie')
      .innerJoinAndSelect('movie.watchHistory', 'history', 'history.userId = :userId', { userId })
      .leftJoinAndSelect('movie.torrents', 'torrents')
      .orderBy('history.updatedAt', 'DESC')
      .skip(skip)
      .take(limit);

    const [movies, total] = await queryBuilder.getManyAndCount();

    return {
      data: movies,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }
} 