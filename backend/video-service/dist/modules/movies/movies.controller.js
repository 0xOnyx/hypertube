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
exports.MoviesController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const movies_service_1 = require("./movies.service");
const movie_entity_1 = require("../../common/entities/movie.entity");
const comment_entity_1 = require("../../common/entities/comment.entity");
const watch_history_entity_1 = require("../../common/entities/watch-history.entity");
const create_movie_dto_1 = require("./dto/create-movie.dto");
const update_movie_dto_1 = require("./dto/update-movie.dto");
const create_comment_dto_1 = require("./dto/create-comment.dto");
const update_watch_history_dto_1 = require("./dto/update-watch-history.dto");
const movie_search_dto_1 = require("./dto/movie-search.dto");
let MoviesController = class MoviesController {
    constructor(moviesService) {
        this.moviesService = moviesService;
    }
    async findAll(searchDto) {
        return this.moviesService.findAll(searchDto);
    }
    async search(searchDto) {
        return this.moviesService.search(searchDto);
    }
    async getPopular(page = 1, limit = 20) {
        return this.moviesService.getPopular(page, limit);
    }
    async getUserHistory(userId, pageStr = '1', limitStr = '20', request) {
        const userIdNum = parseInt(userId);
        if (isNaN(userIdNum)) {
            const headers = request.headers;
            throw new common_1.BadRequestException({
                message: 'Invalid user-id header: must be a number',
                error: 'Bad Request',
                statusCode: 400,
                requestHeaders: headers
            });
        }
        const page = parseInt(pageStr);
        if (isNaN(page) || page < 1) {
            throw new common_1.BadRequestException('Invalid page parameter: must be a positive number');
        }
        const limit = parseInt(limitStr);
        if (isNaN(limit) || limit < 1) {
            throw new common_1.BadRequestException('Invalid limit parameter: must be a positive number');
        }
        return this.moviesService.getUserHistory(userIdNum, page, limit);
    }
    async findOne(id) {
        return this.moviesService.findOne(id);
    }
    async create(createMovieDto) {
        return this.moviesService.create(createMovieDto);
    }
    async update(id, updateMovieDto) {
        return this.moviesService.update(id, updateMovieDto);
    }
    async remove(id) {
        return this.moviesService.remove(id);
    }
    async getComments(id) {
        return this.moviesService.getComments(id);
    }
    async addComment(id, createCommentDto) {
        return this.moviesService.addComment(id, createCommentDto);
    }
    async getWatchHistory(id, userId) {
        return this.moviesService.getWatchHistory(id, userId);
    }
    async updateWatchHistory(id, updateWatchHistoryDto) {
        return this.moviesService.updateWatchHistory(id, updateWatchHistoryDto);
    }
    async getStreamingUrl(id) {
        return this.moviesService.getStreamingUrl(id);
    }
};
exports.MoviesController = MoviesController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get all movies with pagination' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Movies list', type: [movie_entity_1.Movie] }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [movie_search_dto_1.MovieSearchDto]),
    __metadata("design:returntype", Promise)
], MoviesController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('search'),
    (0, swagger_1.ApiOperation)({ summary: 'Search movies' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Search results', type: [movie_entity_1.Movie] }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [movie_search_dto_1.MovieSearchDto]),
    __metadata("design:returntype", Promise)
], MoviesController.prototype, "search", null);
__decorate([
    (0, common_1.Get)('popular'),
    (0, swagger_1.ApiOperation)({ summary: 'Get popular movies' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Popular movies', type: [movie_entity_1.Movie] }),
    __param(0, (0, common_1.Query)('page')),
    __param(1, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], MoviesController.prototype, "getPopular", null);
__decorate([
    (0, common_1.Get)('history'),
    (0, swagger_1.ApiOperation)({ summary: 'Get user watch history' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Watch history', type: [movie_entity_1.Movie] }),
    (0, swagger_1.ApiBearerAuth)(),
    __param(0, (0, common_1.Headers)('X-User-Id')),
    __param(1, (0, common_1.Query)('page')),
    __param(2, (0, common_1.Query)('limit')),
    __param(3, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object, Object]),
    __metadata("design:returntype", Promise)
], MoviesController.prototype, "getUserHistory", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get movie by ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Movie details', type: movie_entity_1.Movie }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Movie not found' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], MoviesController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new movie' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Movie created', type: movie_entity_1.Movie }),
    (0, swagger_1.ApiBearerAuth)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_movie_dto_1.CreateMovieDto]),
    __metadata("design:returntype", Promise)
], MoviesController.prototype, "create", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update a movie' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Movie updated', type: movie_entity_1.Movie }),
    (0, swagger_1.ApiBearerAuth)(),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, update_movie_dto_1.UpdateMovieDto]),
    __metadata("design:returntype", Promise)
], MoviesController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete a movie' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Movie deleted' }),
    (0, swagger_1.ApiBearerAuth)(),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], MoviesController.prototype, "remove", null);
__decorate([
    (0, common_1.Get)(':id/comments'),
    (0, swagger_1.ApiOperation)({ summary: 'Get comments for a movie' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Movie comments', type: [comment_entity_1.Comment] }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], MoviesController.prototype, "getComments", null);
__decorate([
    (0, common_1.Post)(':id/comments'),
    (0, swagger_1.ApiOperation)({ summary: 'Add a comment to a movie' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Comment added', type: comment_entity_1.Comment }),
    (0, swagger_1.ApiBearerAuth)(),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, create_comment_dto_1.CreateCommentDto]),
    __metadata("design:returntype", Promise)
], MoviesController.prototype, "addComment", null);
__decorate([
    (0, common_1.Get)(':id/watch-history/:userId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get user watch history for a movie' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Watch history', type: watch_history_entity_1.WatchHistory }),
    (0, swagger_1.ApiBearerAuth)(),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Param)('userId', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", Promise)
], MoviesController.prototype, "getWatchHistory", null);
__decorate([
    (0, common_1.Post)(':id/watch-history'),
    (0, swagger_1.ApiOperation)({ summary: 'Update watch history' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'History updated', type: watch_history_entity_1.WatchHistory }),
    (0, swagger_1.ApiBearerAuth)(),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, update_watch_history_dto_1.UpdateWatchHistoryDto]),
    __metadata("design:returntype", Promise)
], MoviesController.prototype, "updateWatchHistory", null);
__decorate([
    (0, common_1.Get)(':id/stream'),
    (0, swagger_1.ApiOperation)({ summary: 'Get streaming URL for a movie' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Streaming URL' }),
    (0, swagger_1.ApiBearerAuth)(),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], MoviesController.prototype, "getStreamingUrl", null);
exports.MoviesController = MoviesController = __decorate([
    (0, swagger_1.ApiTags)('movies'),
    (0, common_1.Controller)('movies'),
    __metadata("design:paramtypes", [movies_service_1.MoviesService])
], MoviesController);
//# sourceMappingURL=movies.controller.js.map