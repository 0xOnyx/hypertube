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
exports.WatchHistory = void 0;
const typeorm_1 = require("typeorm");
const swagger_1 = require("@nestjs/swagger");
const movie_entity_1 = require("./movie.entity");
let WatchHistory = class WatchHistory {
};
exports.WatchHistory = WatchHistory;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    (0, swagger_1.ApiProperty)({ description: 'Unique history ID' }),
    __metadata("design:type", Number)
], WatchHistory.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    (0, swagger_1.ApiProperty)({ description: 'User ID' }),
    __metadata("design:type", Number)
], WatchHistory.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.Column)('int', { default: 0 }),
    (0, swagger_1.ApiProperty)({ description: 'Watch position in seconds' }),
    __metadata("design:type", Number)
], WatchHistory.prototype, "watchPosition", void 0);
__decorate([
    (0, typeorm_1.Column)('int', { nullable: true }),
    (0, swagger_1.ApiProperty)({ description: 'Total watched time in seconds', required: false }),
    __metadata("design:type", Number)
], WatchHistory.prototype, "totalWatchTime", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: false }),
    (0, swagger_1.ApiProperty)({ description: 'Movie completed' }),
    __metadata("design:type", Boolean)
], WatchHistory.prototype, "completed", void 0);
__decorate([
    (0, typeorm_1.Column)('decimal', { precision: 5, scale: 2, default: 0 }),
    (0, swagger_1.ApiProperty)({ description: 'Watched percentage (0-100)' }),
    __metadata("design:type", Number)
], WatchHistory.prototype, "progressPercentage", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar', { length: 20, default: 'watching' }),
    (0, swagger_1.ApiProperty)({
        description: 'Watch status',
        enum: ['watching', 'paused', 'completed', 'abandoned']
    }),
    __metadata("design:type", String)
], WatchHistory.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    (0, swagger_1.ApiProperty)({ description: 'First watch date' }),
    __metadata("design:type", Date)
], WatchHistory.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    (0, swagger_1.ApiProperty)({ description: 'Last update date' }),
    __metadata("design:type", Date)
], WatchHistory.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => movie_entity_1.Movie, (movie) => movie.watchHistory, { onDelete: 'CASCADE' }),
    __metadata("design:type", movie_entity_1.Movie)
], WatchHistory.prototype, "movie", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], WatchHistory.prototype, "movieId", void 0);
exports.WatchHistory = WatchHistory = __decorate([
    (0, typeorm_1.Entity)('watch_history'),
    (0, typeorm_1.Index)(['userId', 'movieId'], { unique: true })
], WatchHistory);
//# sourceMappingURL=watch-history.entity.js.map