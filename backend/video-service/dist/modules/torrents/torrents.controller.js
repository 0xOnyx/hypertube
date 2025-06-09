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
exports.TorrentsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const torrents_service_1 = require("./torrents.service");
let TorrentsController = class TorrentsController {
    constructor(torrentsService) {
        this.torrentsService = torrentsService;
    }
    async getTorrentsByMovie(movieId) {
        return this.torrentsService.findByMovieId(movieId);
    }
    async startDownload(id) {
        return this.torrentsService.startDownload(id);
    }
};
exports.TorrentsController = TorrentsController;
__decorate([
    (0, common_1.Get)(':movieId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get torrents for a movie' }),
    __param(0, (0, common_1.Param)('movieId', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], TorrentsController.prototype, "getTorrentsByMovie", null);
__decorate([
    (0, common_1.Post)(':id/download'),
    (0, swagger_1.ApiOperation)({ summary: 'Start torrent download' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], TorrentsController.prototype, "startDownload", null);
exports.TorrentsController = TorrentsController = __decorate([
    (0, swagger_1.ApiTags)('torrents'),
    (0, common_1.Controller)('torrents'),
    __metadata("design:paramtypes", [torrents_service_1.TorrentsService])
], TorrentsController);
//# sourceMappingURL=torrents.controller.js.map