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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Movie = void 0;
const typeorm_1 = require("typeorm");
const swagger_1 = require("@nestjs/swagger");
const torrent_entity_1 = require("./torrent.entity");
const watch_history_entity_1 = require("./watch-history.entity");
const comment_entity_1 = require("./comment.entity");
let Movie = class Movie {
};
exports.Movie = Movie;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    (0, swagger_1.ApiProperty)({ description: 'Unique movie ID' }),
    __metadata("design:type", Number)
], Movie.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ unique: true }),
    (0, swagger_1.ApiProperty)({ description: 'IMDB ID of the movie' }),
    __metadata("design:type", String)
], Movie.prototype, "imdbId", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    (0, swagger_1.ApiProperty)({ description: 'Movie title' }),
    __metadata("design:type", String)
], Movie.prototype, "title", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    (0, swagger_1.ApiProperty)({ description: 'Original movie title', required: false }),
    __metadata("design:type", String)
], Movie.prototype, "originalTitle", void 0);
__decorate([
    (0, typeorm_1.Column)('int', { nullable: true }),
    (0, swagger_1.ApiProperty)({ description: 'Release year', required: false }),
    __metadata("design:type", Number)
], Movie.prototype, "year", void 0);
__decorate([
    (0, typeorm_1.Column)('decimal', { precision: 3, scale: 1, nullable: true }),
    (0, swagger_1.ApiProperty)({ description: 'IMDB rating', required: false }),
    __metadata("design:type", Number)
], Movie.prototype, "rating", void 0);
__decorate([
    (0, typeorm_1.Column)('int', { nullable: true }),
    (0, swagger_1.ApiProperty)({ description: 'Runtime in minutes', required: false }),
    __metadata("design:type", Number)
], Movie.prototype, "runtime", void 0);
__decorate([
    (0, typeorm_1.Column)('text', { nullable: true }),
    (0, swagger_1.ApiProperty)({ description: 'Movie synopsis', required: false }),
    __metadata("design:type", String)
], Movie.prototype, "synopsis", void 0);
__decorate([
    (0, typeorm_1.Column)('simple-array', { nullable: true }),
    (0, swagger_1.ApiProperty)({ description: 'Movie genres', type: [String], required: false }),
    __metadata("design:type", Array)
], Movie.prototype, "genres", void 0);
__decorate([
    (0, typeorm_1.Column)('simple-array', { nullable: true }),
    (0, swagger_1.ApiProperty)({ description: 'Directors', type: [String], required: false }),
    __metadata("design:type", Array)
], Movie.prototype, "directors", void 0);
__decorate([
    (0, typeorm_1.Column)('simple-array', { nullable: true }),
    (0, swagger_1.ApiProperty)({ description: 'Main actors', type: [String], required: false }),
    __metadata("design:type", Array)
], Movie.prototype, "actors", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    (0, swagger_1.ApiProperty)({ description: 'Poster URL', required: false }),
    __metadata("design:type", String)
], Movie.prototype, "posterUrl", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    (0, swagger_1.ApiProperty)({ description: 'Backdrop URL', required: false }),
    __metadata("design:type", String)
], Movie.prototype, "backdropUrl", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    (0, swagger_1.ApiProperty)({ description: 'Trailer URL', required: false }),
    __metadata("design:type", String)
], Movie.prototype, "trailerUrl", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar', { length: 20, default: 'available' }),
    (0, swagger_1.ApiProperty)({
        description: 'Movie status',
        enum: ['available', 'downloading', 'processing', 'unavailable']
    }),
    __metadata("design:type", String)
], Movie.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    (0, swagger_1.ApiProperty)({ description: 'Video file path', required: false }),
    __metadata("design:type", String)
], Movie.prototype, "videoPath", void 0);
__decorate([
    (0, typeorm_1.Column)('bigint', { nullable: true }),
    (0, swagger_1.ApiProperty)({ description: 'File size in bytes', required: false }),
    __metadata("design:type", Number)
], Movie.prototype, "fileSize", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar', { length: 10, nullable: true }),
    (0, swagger_1.ApiProperty)({ description: 'Video quality', required: false }),
    __metadata("design:type", String)
], Movie.prototype, "quality", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    (0, swagger_1.ApiProperty)({ description: 'Creation date' }),
    __metadata("design:type", Date)
], Movie.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    (0, swagger_1.ApiProperty)({ description: 'Last update date' }),
    __metadata("design:type", Date)
], Movie.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => torrent_entity_1.Torrent, (torrent) => torrent.movie),
    __metadata("design:type", Array)
], Movie.prototype, "torrents", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => watch_history_entity_1.WatchHistory, (history) => history.movie),
    __metadata("design:type", Array)
], Movie.prototype, "watchHistory", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => comment_entity_1.Comment, (comment) => comment.movie),
    __metadata("design:type", Array)
], Movie.prototype, "comments", void 0);
exports.Movie = Movie = __decorate([
    (0, typeorm_1.Entity)('movies'),
    (0, typeorm_1.Index)(['imdbId'], { unique: true }),
    (0, typeorm_1.Index)(['title', 'year'])
], Movie);
//# sourceMappingURL=movie.entity.js.map