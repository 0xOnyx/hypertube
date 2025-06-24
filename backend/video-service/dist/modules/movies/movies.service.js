"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MoviesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const movie_entity_1 = require("../../common/entities/movie.entity");
const comment_entity_1 = require("../../common/entities/comment.entity");
const watch_history_entity_1 = require("../../common/entities/watch-history.entity");
let MoviesService = class MoviesService {
    constructor(movieRepository, commentRepository, watchHistoryRepository) {
        this.movieRepository = movieRepository;
        this.commentRepository = commentRepository;
        this.watchHistoryRepository = watchHistoryRepository;
    }
    async findAll(searchDto) {
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
    async search(searchDto) {
        const { query, genres, yearMin, yearMax, ratingMin, page = 1, limit = 20, sortBy = 'rating', sortOrder = 'DESC' } = searchDto;
        const queryBuilder = this.movieRepository.createQueryBuilder('movie');
        if (query) {
            queryBuilder.andWhere('(movie.title ILIKE :query OR movie.originalTitle ILIKE :query OR movie.synopsis ILIKE :query)', { query: `%${query}%` });
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
            where: { rating: (0, typeorm_2.Between)(7, 10) },
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
    async findOne(id) {
        const movie = await this.movieRepository.findOne({
            where: { id },
            relations: ['torrents', 'comments', 'watchHistory'],
        });
        if (!movie) {
            throw new common_1.NotFoundException(`Movie with ID ${id} not found`);
        }
        return movie;
    }
    async create(createMovieDto) {
        const movie = this.movieRepository.create(createMovieDto);
        return this.movieRepository.save(movie);
    }
    async update(id, updateMovieDto) {
        const movie = await this.findOne(id);
        Object.assign(movie, updateMovieDto);
        return this.movieRepository.save(movie);
    }
    async remove(id) {
        const movie = await this.findOne(id);
        await this.movieRepository.remove(movie);
    }
    async getComments(movieId) {
        return this.commentRepository.find({
            where: { movieId, isVisible: true },
            order: { createdAt: 'DESC' },
        });
    }
    async addComment(movieId, createCommentDto) {
        const movie = await this.findOne(movieId);
        const comment = this.commentRepository.create({
            ...createCommentDto,
            movieId,
        });
        return this.commentRepository.save(comment);
    }
    async getWatchHistory(movieId, userId) {
        return this.watchHistoryRepository.findOne({
            where: { movieId, userId },
        });
    }
    async updateWatchHistory(movieId, updateWatchHistoryDto) {
        const { userId, ...updateData } = updateWatchHistoryDto;
        let watchHistory = await this.getWatchHistory(movieId, userId);
        if (!watchHistory) {
            watchHistory = this.watchHistoryRepository.create({
                movieId,
                userId,
                ...updateData,
            });
        }
        else {
            Object.assign(watchHistory, updateData);
        }
        return this.watchHistoryRepository.save(watchHistory);
    }
    async getStreamingUrl(movieId) {
        const movie = await this.findOne(movieId);
        if (!movie.videoPath) {
            throw new common_1.NotFoundException('Video file not available for this movie');
        }
        const streamingUrl = `/api/v1/streaming/movies/${movieId}/stream`;
        return { url: streamingUrl };
    }
    async getUserHistory(userId, page = 1, limit = 20) {
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
};
exports.MoviesService = MoviesService;
exports.MoviesService = MoviesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(movie_entity_1.Movie)),
    __param(1, (0, typeorm_1.InjectRepository)(comment_entity_1.Comment)),
    __param(2, (0, typeorm_1.InjectRepository)(watch_history_entity_1.WatchHistory)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], MoviesService);
//# sourceMappingURL=movies.service.js.map