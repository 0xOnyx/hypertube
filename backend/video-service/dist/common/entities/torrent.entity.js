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
exports.Torrent = void 0;
const typeorm_1 = require("typeorm");
const swagger_1 = require("@nestjs/swagger");
const movie_entity_1 = require("./movie.entity");
let Torrent = class Torrent {
};
exports.Torrent = Torrent;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    (0, swagger_1.ApiProperty)({ description: 'Unique torrent ID' }),
    __metadata("design:type", Number)
], Torrent.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ unique: true }),
    (0, swagger_1.ApiProperty)({ description: 'Torrent magnet URI' }),
    __metadata("design:type", String)
], Torrent.prototype, "magnetUri", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    (0, swagger_1.ApiProperty)({ description: 'Torrent hash' }),
    __metadata("design:type", String)
], Torrent.prototype, "hash", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    (0, swagger_1.ApiProperty)({ description: 'Torrent name' }),
    __metadata("design:type", String)
], Torrent.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)('bigint'),
    (0, swagger_1.ApiProperty)({ description: 'Size in bytes' }),
    __metadata("design:type", Number)
], Torrent.prototype, "size", void 0);
__decorate([
    (0, typeorm_1.Column)('int', { default: 0 }),
    (0, swagger_1.ApiProperty)({ description: 'Number of seeders' }),
    __metadata("design:type", Number)
], Torrent.prototype, "seeders", void 0);
__decorate([
    (0, typeorm_1.Column)('int', { default: 0 }),
    (0, swagger_1.ApiProperty)({ description: 'Number of leechers' }),
    __metadata("design:type", Number)
], Torrent.prototype, "leechers", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar', { length: 10 }),
    (0, swagger_1.ApiProperty)({ description: 'Torrent quality (720p, 1080p, etc.)' }),
    __metadata("design:type", String)
], Torrent.prototype, "quality", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar', { length: 20, default: 'pending' }),
    (0, swagger_1.ApiProperty)({
        description: 'Download status',
        enum: ['pending', 'downloading', 'completed', 'failed', 'seeding']
    }),
    __metadata("design:type", String)
], Torrent.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)('decimal', { precision: 5, scale: 2, default: 0 }),
    (0, swagger_1.ApiProperty)({ description: 'Download progress (0-100)' }),
    __metadata("design:type", Number)
], Torrent.prototype, "progress", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    (0, swagger_1.ApiProperty)({ description: 'Downloaded file path', required: false }),
    __metadata("design:type", String)
], Torrent.prototype, "filePath", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    (0, swagger_1.ApiProperty)({ description: 'Creation date' }),
    __metadata("design:type", Date)
], Torrent.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    (0, swagger_1.ApiProperty)({ description: 'Last update date' }),
    __metadata("design:type", Date)
], Torrent.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => movie_entity_1.Movie, (movie) => movie.torrents, { onDelete: 'CASCADE' }),
    __metadata("design:type", movie_entity_1.Movie)
], Torrent.prototype, "movie", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], Torrent.prototype, "movieId", void 0);
exports.Torrent = Torrent = __decorate([
    (0, typeorm_1.Entity)('torrents'),
    (0, typeorm_1.Index)(['magnetUri'], { unique: true })
], Torrent);
//# sourceMappingURL=torrent.entity.js.map